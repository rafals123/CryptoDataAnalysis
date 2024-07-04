package pl.adrianix2000.backend.Controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.adrianix2000.backend.Models.Entities.CryptoCurrency;
import pl.adrianix2000.backend.Models.Entities.News;
import pl.adrianix2000.backend.Models.Entities.NewsSummary;
import pl.adrianix2000.backend.Models.Entities.QuoteChanges;
import pl.adrianix2000.backend.Services.Analysis.NewsFilter;
import pl.adrianix2000.backend.Services.CryptoCurrencyService;
import pl.adrianix2000.backend.Services.NewsService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RestController
@RequestMapping("/news")
@Slf4j
@RequiredArgsConstructor
public class NewsController {

    private final NewsFilter newsFilter;
    private final NewsService newsService;
    private final CryptoCurrencyService cryptoCurrencyService;

    @GetMapping("/getNews")
    public ResponseEntity<Map<String, List<News>>> getNews()
    {
        Map<String, List<News>> result = new HashMap<>();
        result.put("AvailableNews", newsFilter.readNewsFromFile());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/mostInfluNews")
    public ResponseEntity<List<NewsSummary>>getMostInfluentNewsForCrypto(@RequestParam String cryptoName)
    {
        List<NewsSummary> test = newsService.getMostInfluentNewsForCrypto(cryptoName);
        return ResponseEntity.ok(test);
    }

    @GetMapping("/biggestQuoteChanges")
    public ResponseEntity<List<QuoteChanges>>getBiggestQuoteChanges(@RequestParam String cryptoName)
    {
        CryptoCurrency c = cryptoCurrencyService.getCryptoByName(cryptoName);
        List<QuoteChanges> result = newsService.getQuoteChanges(c, 100);

        result = result.stream()
                .filter(r -> r.getDate().isAfter(LocalDateTime.of(2018, 3, 1, 23, 59, 59)))
                .toList();

        return ResponseEntity.ok(result);
    }
}
