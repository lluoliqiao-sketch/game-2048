package org.example.dto;

import lombok.Data;

import java.util.List;

@Data
public class GeminiResponse {
    private List<Candidate> candidates;
    private UsageMetadata usageMetadata;
    private String modelVersion;
    private String createTime;
    private String responseId;


    @Data
    public static class Candidate {
        private Content content;
    }

    @Data
    public static class Content {
        private String role;
        private List<Part> parts;
    }

    @Data
    public static class Part {
        private String text;
    }

    @Data
    public static class UsageMetadata {
        private String trafficType;
    }
}