package org.example.assistant;

import com.google.gson.Gson;
import com.squareup.okhttp.*;
import org.example.dto.GeminiRequest;
import org.example.dto.GeminiResponse;
import org.example.factory.HttpClientFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;


@Service
public class AssistantService {

    @Autowired
    private HttpClientFactory httpClientFactory;

    private final Gson gson = new Gson();

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String URL = "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent?key=%s";
    private static final String ROLE = "user";
    private static final String QUESTION_TEMPLATE = "In the game 2048, you maneuver numbered tiles on a 4x4 grid by swiping in four possible directions (up, down, left, or right). When two tiles with the same number touch, they merge into one tile with their combined value. After each move, a new tile (usually a 2 or 4) appears on the grid. The objective is to create a tile with the number 2048 before the grid fills up, at which point the game ends if no more moves are possible. Strategy involves planning moves to keep higher tiles in a corner and maximizing merges.\n" +
            "Current board status is: %s.\n" +
            "The goal is to get the optimal next move to achieve the highest score or reach the 2048 tile and avoid game over.\n" +
            "Use only few words, suggest the best next move.";

    public String processMessage(String msg, boolean useTemplate) {
        String question = useTemplate ? QUESTION_TEMPLATE.formatted(msg) : msg;
        return generateContent(question);
    }

    public String processMessage() {
        System.out.println("AssistantService got your request for testing purpose, processing sample question...");
        String sampleQuestion = "What is the capital of France?";
        return generateContent(sampleQuestion);
    }


    private String generateContent(String question) {
        try {
            OkHttpClient client = httpClientFactory.getClient();

            String jsonStr = gson.toJson(createRequest(question));

            RequestBody body = RequestBody.create(
                    MediaType.parse("application/json"), jsonStr);

            Request request = new Request.Builder()
                    .url(String.format(URL, apiKey))
                    .post(body)
                    .build();

            System.out.println("Going to send request: \n" + jsonStr);
            long startTime = System.currentTimeMillis();
            Response response = client.newCall(request).execute();
            System.out.println("************** Response **************\n" + response);

            long endTime = System.currentTimeMillis();
            System.out.println("Content generated in " + (endTime - startTime) + " ms");
            if (!response.isSuccessful()) {
                return "Error generating content: " + response.message();
            }

            String responseBody = response.body().string();
            System.out.println("Response Body: " + responseBody);
            GeminiResponse[] responses = gson.fromJson(responseBody, GeminiResponse[].class);
            return formattedResponse(responses);
        } catch (Exception e) {
            System.out.println("Error generating content: " + e.getMessage());
            return "Error generating content: " + e.getMessage();
        }
    }

    private static GeminiRequest createRequest(String question) {
        GeminiRequest request = new GeminiRequest();
        GeminiRequest.Content content = new GeminiRequest.Content();
        content.setRole(ROLE);
        GeminiRequest.Part part = new GeminiRequest.Part();
        part.setText(question);

        content.setParts(java.util.Collections.singletonList(part));
        request.setContents(java.util.Collections.singletonList(content));
        return request;
    }


    private String formattedResponse(GeminiResponse[] responses) {
        StringBuilder sb = new StringBuilder();
        try {
            List<GeminiResponse> responseList = Arrays.asList(responses);
            responseList.forEach(r -> sb.append(r.getCandidates().get(0).getContent().getParts().get(0).getText()));
        } catch (Exception e) {
            sb.append("Error parsing response: ").append(e.getMessage());
        }
        return sb.toString();
    }
}
