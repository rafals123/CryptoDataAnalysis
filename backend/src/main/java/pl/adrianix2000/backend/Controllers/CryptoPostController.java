package pl.adrianix2000.backend.Controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.adrianix2000.backend.Models.CustomHttpResponse;
import pl.adrianix2000.backend.Models.DTO.AddCryptoPostsRequest;
import pl.adrianix2000.backend.Models.Entities.CryptoPost;
import pl.adrianix2000.backend.Services.CryptoPostService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RestController
@RequestMapping("/cryptoPosts")
@RequiredArgsConstructor
public class CryptoPostController {

    final CryptoPostService service;

    @GetMapping("/allPosts")
    public ResponseEntity<Map<String, List<CryptoPost>>> getAllPosts() {
        List<CryptoPost> allPosts = service.getAllCryptoPosts();
        Map<String, List<CryptoPost>> response = new HashMap<>();
        response.put("posts", allPosts);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/updatePosts")
    public ResponseEntity<String> updateAllCryptoPosts() {
        service.writeAllPostFromFileToDb();
        return ResponseEntity.ok("Posts are updated");
    }
    @GetMapping("/postsForCrypto")
    public ResponseEntity<Map<String, List<CryptoPost>>> getPostForCrypto(@RequestParam String cryptoName) {
        List<CryptoPost> posts = service.getPostForCrypto(cryptoName);
        Map<String, List<CryptoPost>> result = new HashMap<>();
        result.put("posts", posts);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/test")
    public void test() {
        service.readAllPostsFromXML();
    }

    @PostMapping("/addPost")
    public ResponseEntity<Object> addPost(@RequestBody AddCryptoPostsRequest request) {
        CustomHttpResponse response = service.addCryptoPost(request);
        return ResponseEntity.status(response.getStatus()).body(response.getBody());
    }
}
