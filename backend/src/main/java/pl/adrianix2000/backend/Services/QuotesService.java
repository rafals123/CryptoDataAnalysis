package pl.adrianix2000.backend.Services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.adrianix2000.backend.Configuration.ResourcesLocalization;
import pl.adrianix2000.backend.Exceptions.ApplicationException;
import pl.adrianix2000.backend.Models.Entities.CryptoCurrency;
import pl.adrianix2000.backend.Models.Entities.Quotes;
import pl.adrianix2000.backend.Repositories.QuotesRepository;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuotesService {

    final private QuotesRepository quotesRepository;

    @Transactional
    public void readQuotesFromCsvToDb(LocalDateTime from, CryptoCurrency cryptoCurrency) {
        String filePath = ResourcesLocalization.MAIN_RESOURCE_DIRECTORY +
                ResourcesLocalization.CRYPTO_DATA_RESOURCE_DIRECTORY +
                "coin_" + cryptoCurrency.getName().toLowerCase() + ".csv";

        File file = new File(filePath);
        log.info(filePath);
        try {
            FileReader fileReader = new FileReader(file);
            BufferedReader bufferedReader = new BufferedReader(fileReader);
            
            List<Quotes> lines = bufferedReader.lines().skip(1).map(line -> convertLineToQuotes(line, cryptoCurrency)).toList();
            lines = from == null ? lines : lines.stream().filter(l -> l.getDateTime().isAfter(from)).toList();


            if(lines.isEmpty()) throw new ApplicationException("All data in the database are up to date.", HttpStatus.OK);

            quotesRepository.saveAll(lines);

        }catch (FileNotFoundException ex) {

            throw new ApplicationException("There is no file on the server containing historical data for the cryptocurrency named " +
                    cryptoCurrency.getName(),
                    HttpStatus.NOT_FOUND);
        }
    }

    @Transactional(readOnly = true)
    public List<Quotes> getAllCryptoQuotes(String cryptoName) {
        return quotesRepository.findByCurrencyName(cryptoName);
    }

    public Quotes convertLineToQuotes(String fileLine, CryptoCurrency cryptoCurrency) {
        String[] splitted = fileLine.split(",");

        if(Arrays.stream(splitted).anyMatch(s -> s.trim().equals("null"))) {
            throw new ApplicationException("No date in the file", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if(splitted.length != 10)
            throw new ApplicationException("Invalid file format", HttpStatus.UNPROCESSABLE_ENTITY);

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        Quotes convertedLine = Quotes.builder()
                .currency(cryptoCurrency)
                .dateTime(LocalDateTime.parse(splitted[3], dateFormatter))
                .high_price(new BigDecimal(splitted[4]))
                .low_price(new BigDecimal(splitted[5]))
                .open_price(new BigDecimal(splitted[6]))
                .close_price(new BigDecimal(splitted[7]))
                .volume(new BigDecimal(splitted[8]))
                .marketcap(new BigDecimal(splitted[9]))
                .build();

        return convertedLine;
    }
}
