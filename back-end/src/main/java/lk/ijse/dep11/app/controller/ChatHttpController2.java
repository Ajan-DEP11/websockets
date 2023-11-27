package lk.ijse.dep11.app.controller;

import lk.ijse.dep11.app.to.MessageTO;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.util.List;
import java.util.Map;
import java.util.Vector;

@RestController
@RequestMapping("/api/v2/messages")
@CrossOrigin
public class ChatHttpController2 {

    private final List<MessageTO> chatMessages = new Vector<>();

    @GetMapping(produces = "application/json")
    public List<MessageTO> retrieveMessages() {
        return chatMessages;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = "application/json", produces = "application/json")
    public MessageTO sendMessage(@RequestBody @Valid MessageTO message){
        chatMessages.add(message);
        return message;
    }

}
