package pl.adrianix2000.backend.Services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.adrianix2000.backend.Exceptions.ApplicationException;
import pl.adrianix2000.backend.Models.Entities.CryptoCurrency;
import pl.adrianix2000.backend.Models.Entities.QuoteChanges;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Deprecated
public class PostService {

    private final String filePath = "/home/rafal/Pulpit/daneAnaliza/DATASET_NEW/BTC.csv";
    private final CryptoCurrencyService cryptoCurrencyService;
    private final NewsService newsService;

    private List<String> getEnableArticleCSVFiles() {
        File file = new File("/home/rafal/Pulpit/6 semestr/crypto/CryptoDataAnalysis/backend/src/main/resources/Data/Posts");
        if(file.isDirectory()) {
            return Arrays.stream(file.listFiles()).map(f -> f.getName()).toList();
        }
        return List.of();
    }

    private Map<String, List<String>> getMostInfluentDatesWithArticles(CryptoCurrency crypto, Map<String, List<String>> news) {
        List<QuoteChanges> cryptoBiggestQuotesChanges = newsService.getQuoteChanges(crypto, 100);
        final List<String> quotesDates = cryptoBiggestQuotesChanges.stream().map(q -> q.getDate().toString()).toList();


        Map<String, List<String>> filteredNews = news.entrySet()
                .stream()
                .filter(e -> quotesDates.contains(e.getKey()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        Map<String, List<String>> sortedNews = new TreeMap<>(new Comparator<String>() {
            @Override
            public int compare(String date1, String date2) {
                try {
                    return dateFormat.parse(date1).compareTo(dateFormat.parse(date2));
                } catch (ParseException e) {
                    throw new IllegalArgumentException(e);
                }
            }
        });
        sortedNews.putAll(filteredNews);

        return sortedNews;
    }

    public Map<String, Map<String, List<String>>> readCsv(String cryptoTicker) {

        CryptoCurrency crypto = cryptoCurrencyService.getCryptoBySymbol(cryptoTicker);

        List<String> enableCryptoCsvPostFiles = getEnableArticleCSVFiles();

        log.info("size = " + enableCryptoCsvPostFiles.size());

        Optional<String> optionalFilePath = enableCryptoCsvPostFiles.stream()
                .filter(x -> x.equals(crypto.getSymbol().toUpperCase() + ".csv"))
                .findFirst();

        if(optionalFilePath.isEmpty()) {
            log.info("Can't find artical csv file for crypto: " + crypto.getName());
            throw new ApplicationException("Can't find artical csv file for crypto: " + crypto.getName(), HttpStatus.NO_CONTENT);
        }

        String filePath = "/home/rafal/Pulpit/6 semestr/crypto/CryptoDataAnalysis/backend/src/main/resources/Data/Posts/" + crypto.getSymbol().toUpperCase() + ".csv";

        Map<String, Map<String, List<String>>> articles = new HashMap<>();
        Map<String, List<String>> temp = new HashMap<>();

        try {
            FileReader fileReader = new FileReader(new File(filePath));
            BufferedReader bufferedReader = new BufferedReader(fileReader);
            List<String> linesWithoutTitleLine = bufferedReader.lines().skip(1).toList();

            //articles = linesWithoutTitleLine.stream().map(a -> getArticle(a)).toList();
            for(String line : linesWithoutTitleLine) {
                Map.Entry<String, List<String>> articlesForDay = getArticle(line);
                temp.put(articlesForDay.getKey(), articlesForDay.getValue());
            }


        } catch (FileNotFoundException ex) {
            log.info("can not find this file: " + filePath);
            throw new ApplicationException("can not find this file: " + filePath, HttpStatus.NO_CONTENT);
        }

        temp = getMostInfluentDatesWithArticles(crypto, temp);

        articles.put("articles", temp);
        return articles;
    }


    private Map.Entry<String, List<String>> getArticle(String line) {
        String[] splitted = line.split(",");
        log.info("" + splitted.length);
        if(splitted.length < 8) {
            throw new ApplicationException("Invalid csv file", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        String regex = "[|@\\\\/\\?!#%^&*()_+=\\[\\]{};:\"“”‘’|,<>\\/?]|(?<=')\\s+|\\s+(?=')";



//        String result = Arrays.stream(splitted)
//                .skip(7)
//                .map(a -> a.replaceAll(regex, ""))
//                .collect(Collectors.joining(""));

//        List<String> result = Arrays.stream(Arrays.stream(splitted)
//                .skip(7)
//                .collect(Collectors.joining(","))
//                .split("' "))
//                .map(s -> s.replaceAll(regex, "").trim()).toList();
//
//        log.info(splitted[1] + " " + result);

        return new AbstractMap.SimpleEntry<>(
                splitted[1] + "T23:59:59",
//                Arrays.stream(Arrays.stream(splitted)
//                        .skip(7)
//                        .map(a -> a.replaceAll(regex, "").trim())
//                        .collect(Collectors.joining(""))
//                        .split("''"))
//                        .filter(t -> !t.isEmpty())
//                        .toList()
                Arrays.stream(Arrays.stream(splitted)
                                .skip(7)
                                .collect(Collectors.joining(","))
                                .split("', '"))
                        .map(s -> s.replaceAll(regex, "").trim()).toList()
        );
    }
}