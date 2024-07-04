package pl.adrianix2000.backend.Controllers;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import pl.adrianix2000.backend.Models.CustomHttpResponse;
import pl.adrianix2000.backend.Models.DTO.UserLoginRequest;
import pl.adrianix2000.backend.Models.DTO.UserRegistryRequest;
import pl.adrianix2000.backend.Services.UserService;

import java.util.stream.Collectors;
import java.util.*;

@Controller
@RestController
@RequestMapping("/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthenticationController {

    private final UserService service;


    @PostMapping("/registry")
    public ResponseEntity<Object> registry(@Valid @RequestBody UserRegistryRequest request, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors().stream()
                    .map(e -> e.getDefaultMessage())
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }


        CustomHttpResponse response = service.addUser(request);
        return ResponseEntity.status(response.getStatus()).body(response.getBody().get());
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody UserLoginRequest request) {
        CustomHttpResponse response = service.loginUser(request);

        return ResponseEntity.status(response.getStatus())
                .body(response.getBody().get());

    }

}
