package org.example.controller;

import org.example.assistant.AssistantService;
import org.example.dto.FrontEndQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    @Autowired
    private AssistantService assistantService;

    @PostMapping("board")
    public String handleBoard(@RequestBody FrontEndQuery query) {
        System.out.println("POST /api/assistant/board called with query: " + query);
        return assistantService.processMessage(query.getMessage(), true);
    }

    @PostMapping("msg")
    public String handleMsg(@RequestBody FrontEndQuery query) {
        System.out.println("POST /api/assistant/msg called with msg: " + query);
        return assistantService.processMessage(query.getMessage(), false);
    }

    // for testing
    @GetMapping("msg")
    public String getMsg() {
        System.out.println("GET /api/assistant/msg called");
        return assistantService.processMessage();
    }
}
