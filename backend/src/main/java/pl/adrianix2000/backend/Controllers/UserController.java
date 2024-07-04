package pl.adrianix2000.backend.Controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.adrianix2000.backend.Models.Entities.User;
import pl.adrianix2000.backend.Services.JWTService;
import pl.adrianix2000.backend.Services.UserService;

import java.util.List;

@Controller
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService service;
    private final JWTService jwtService;

    @GetMapping("/getAll")
    private List<User> getAllUsers() {
        return service.getAllUsers();
    }

//    @GetMapping("/token")
//    private String getToken() {
//        return jwtService.generateToken();
//    }

}
