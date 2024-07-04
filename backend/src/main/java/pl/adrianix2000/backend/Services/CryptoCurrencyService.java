package pl.adrianix2000.backend.Services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.adrianix2000.backend.Exceptions.ApplicationException;
import pl.adrianix2000.backend.Models.CustomHttpResponse;
import pl.adrianix2000.backend.Models.DTO.ExtremeHttpRequest;
import pl.adrianix2000.backend.Models.Entities.CryptoCurrency;
import pl.adrianix2000.backend.Models.Entities.Quotes;
import pl.adrianix2000.backend.Repositories.CryptoCurrencyRepository;
import pl.adrianix2000.backend.Services.Analysis.ExtremeFinder;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CryptoCurrencyService {

    final private CryptoCurrencyRepository repository;
    final private QuotesService quotesService;
    final private ExtremeFinder extremeFinder;

    private CryptoCurrency extractCryptoFromOptional(Optional<CryptoCurrency> optionalCryptoCurrency, String errorCommunicate) {
        if(optionalCryptoCurrency.isEmpty()) {
            throw new ApplicationException(errorCommunicate, HttpStatus.NOT_FOUND);
        }

        return optionalCryptoCurrency.get();
    }

    @Transactional(readOnly = true)
    public CryptoCurrency getCryptoByName(String cryptoCurrencyName) {
        Optional<CryptoCurrency> optionalCryptoCurrency = repository.findByName(cryptoCurrencyName);
        return extractCryptoFromOptional(optionalCryptoCurrency,
                "There is no cryptocurrency in the system named " + cryptoCurrencyName);
    }

    @Transactional(readOnly = true)
    public CryptoCurrency getCryptoBySymbol(String cryptoCurrencySymbol) {
        Optional<CryptoCurrency> optionalCryptoCurrency = repository.findBySymbol(cryptoCurrencySymbol.toUpperCase());
        return extractCryptoFromOptional(optionalCryptoCurrency,
                "There is no cryptocurrency in the system with symbol: " + cryptoCurrencySymbol);
    }

    @Transactional(readOnly = true)
    public List<String> getAllCryptoNames() {
        return repository.getAllCryptoNames();
    }

    @Transactional(readOnly = true)
    public List<Quotes> getAllCryptoHistoricalQuotes(String cryptoName) {
        CryptoCurrency foundedCurrency = getCryptoByName(cryptoName);

        return quotesService.getAllCryptoQuotes(cryptoName);
    }


    @Transactional
    public CustomHttpResponse updateCryptoHistoricalData(String cryptoCurrencyName) {

        CryptoCurrency foundedCurrency = getCryptoByName(cryptoCurrencyName);

        Optional<LocalDateTime> latestDate = foundedCurrency.getQuotes().stream()
                .map(Quotes::getDateTime).max(Comparator.naturalOrder());


        if(latestDate.isPresent()) {
            quotesService.readQuotesFromCsvToDb(latestDate.get(), foundedCurrency);
        } else {
            quotesService.readQuotesFromCsvToDb(null, foundedCurrency);
        }

        return CustomHttpResponse.builder()
                .body(Optional.of("Historical market data updated of cryptocurrency " + cryptoCurrencyName))
                .status(HttpStatus.OK)
                .build();
    }
    @Transactional(readOnly = true)
    public List<String> getExtremes(ExtremeHttpRequest request) {
        CryptoCurrency foundedCurrency = getCryptoByName(request.getCryptoCurrencyName());

        List<Quotes> currencyQuotes = foundedCurrency.getQuotes();


        return extremeFinder.findLocalMinima(currencyQuotes);
    }


}
