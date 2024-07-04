package pl.adrianix2000.backend.Controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.adrianix2000.backend.Services.PostService;

import java.util.List;
import java.util.Map;

@Controller
@RestController
@RequestMapping("/cryptoPosts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/cryptoArticles")
    public ResponseEntity<Map<String, Map<String, List<String>>>> getArticleTitle(@RequestParam String cryptoSymbol) {
        return ResponseEntity.ok(postService.readCsv(cryptoSymbol));
    }
}