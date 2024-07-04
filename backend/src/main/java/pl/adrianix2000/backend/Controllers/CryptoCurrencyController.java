package pl.adrianix2000.backend.Controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import pl.adrianix2000.backend.Models.CustomHttpResponse;
import pl.adrianix2000.backend.Models.DTO.ExtremeHttpRequest;
import pl.adrianix2000.backend.Models.Entities.Quotes;
import pl.adrianix2000.backend.Services.CryptoCurrencyService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RestController
@RequestMapping("/currencies")
@Slf4j
@RequiredArgsConstructor
public class CryptoCurrencyController {

    private final CryptoCurrencyService service;

    @PostMapping("/updateData")
    public ResponseEntity<Object> updateCryptoData(@RequestParam String cryptoCurrencyName) {
        CustomHttpResponse response = service.updateCryptoHistoricalData(cryptoCurrencyName);
        return ResponseEntity.status(response.getStatus()).body(response.getBody().get());
    }

    @PostMapping("/getExtremes")
    public ResponseEntity<Object> getExtremum(@RequestBody ExtremeHttpRequest request) {

        Map<String, List<String>> extremums = new HashMap<>();
        extremums.put("Extremums", service.getExtremes(request));

        return ResponseEntity.ok(extremums);
    }

    @GetMapping("/getAllCryptoNames")
    public ResponseEntity<Map<String, List<String>>> getAvailableCryptoNames() {
        Map<String, List<String>> result = new HashMap<>();
        result.put("AvailableCryptoCurrencies", service.getAllCryptoNames());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/quotes")
    public ResponseEntity<Map<String, List<Quotes>>> getCryptoQuotes(@RequestParam String cryptoName) {
        List<Quotes> cryptoCurrencyQuotes = service.getAllCryptoHistoricalQuotes(cryptoName);
        Map<String, List<Quotes>> result = new HashMap<>();
        result.put("quotes", cryptoCurrencyQuotes);
        return ResponseEntity.ok(result);
    }
}
