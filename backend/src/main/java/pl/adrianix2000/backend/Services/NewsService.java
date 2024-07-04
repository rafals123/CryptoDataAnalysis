package pl.adrianix2000.backend.Services;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.adrianix2000.backend.Models.Entities.*;
import pl.adrianix2000.backend.Services.Analysis.NewsFilter;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsService {

    private final CryptoCurrencyService cryptoCurrencyService;
    private final NewsFilter newsFilter;

    public List<QuoteChanges> getQuoteChanges(CryptoCurrency cryptoCurrency, int howMany) {

        List<Quotes> cryptoQuotes = cryptoCurrency.getQuotes();

        List<QuoteChanges> summaries = new ArrayList<>();

        MathContext mc = new MathContext(8);

        for (int i = 0; i < cryptoQuotes.size() - 8; i++) {
            BigDecimal openPrice = cryptoQuotes.get(i).getOpen_price();
            BigDecimal closePrice = cryptoQuotes.get(i).getClose_price();
            BigDecimal closePriceDay1 = cryptoQuotes.get(i + 1).getClose_price();
            BigDecimal closePriceDay3 = cryptoQuotes.get(i + 3).getClose_price();
            BigDecimal closePriceDay7 = cryptoQuotes.get(i + 7).getClose_price();

            BigDecimal dayDifference = (closePrice.subtract(openPrice, mc))
                    .divide(openPrice, mc)
                    .multiply(BigDecimal.valueOf(100));

            BigDecimal twoDaysDifference = (closePrice.subtract(closePriceDay1, mc))
                    .divide(closePriceDay1, mc)
                    .multiply(BigDecimal.valueOf(100));

            BigDecimal threeDaysDifference = (closePrice.subtract(closePriceDay3, mc))
                    .divide(closePriceDay3, mc)
                    .multiply(BigDecimal.valueOf(100));

            BigDecimal weekDifference = (closePrice.subtract(closePriceDay7, mc))
                    .divide(closePriceDay7, mc)
                    .multiply(BigDecimal.valueOf(100));

            summaries.add(QuoteChanges.builder()
                    .cryptoName(cryptoCurrency.getName())
                    .date(cryptoQuotes.get(i).getDateTime())
                    .dayDifference(dayDifference)
                    .twoDaysDifference(twoDaysDifference)
                    .threeDaysDifference(threeDaysDifference)
                    .weekDifference(weekDifference)
                    .build());
        }

        summaries.sort(Comparator.comparing(QuoteChanges::getDayDifference).reversed());
        return summaries.stream().limit(howMany).toList();
    }

    public List<NewsSummary> getMostInfluentNewsForCrypto(String cryptoName) {

        CryptoCurrency cryptoCurrency = cryptoCurrencyService.getCryptoByName(cryptoName);

        List<News> allNews = newsFilter.readNewsFromFile();

        List<QuoteChanges> quoteChanges = getQuoteChanges(cryptoCurrency, 20);

        List<NewsSummary> summaries = new ArrayList<>();

        for(QuoteChanges q : quoteChanges) {
            List<News> news = allNews.stream().filter(n -> n.getDate().equals(q.getDate())).toList();
            summaries = Stream.concat(summaries.stream(), news.stream().map(n -> NewsSummary.builder()
                    .crypto(cryptoCurrency)
                    .date(q.getDate())
                    .firstDifference(q.getDayDifference())
                    .difference(q.getDayDifference())
                    .secondDifference(q.getTwoDaysDifference())
                    .weekDifference(q.getWeekDifference())
                    .news(n)
                    .build())).toList();
        }

        return summaries;
//        CryptoCurrency cryptoCurrency = cryptoCurrencyService.getCryptoByName(cryptoName);
//
//        List<Quotes> cryptoQuotes = cryptoCurrency.getQuotes();
//
//        List<News> allNews = newsFilter.readNewsFromFile();
//
//        List<NewsSummary> summaries = new ArrayList<>();
//
//        log.info("ilosc newsow: " + allNews.size());
//
//        for(News news : allNews) {
//
//            try {
//                LocalDateTime newsDate = news.getDate();
//                LocalDateTime newsDatePlusDay = newsDate.plusDays(1);
//                LocalDateTime newsDatePlusWeek = newsDate.plusDays(7);
//             //   LocalDateTime newsDateMinusDay = newsDate.plusDays(-1);
//
//                Quotes newsDateQuote = cryptoQuotes.stream().filter(q -> q.getDateTime().equals(newsDate)).findAny().get();
//                Quotes newsDateQuotePlusDay = cryptoQuotes.stream().filter(q -> q.getDateTime().equals(newsDatePlusDay)).findAny().get();
//                Quotes newsDateQuotePlusWeek = cryptoQuotes.stream().filter(q -> q.getDateTime().equals(newsDatePlusWeek)).findAny().get();
//               // Quotes newsDateQuoteMinusDay = cryptoQuotes.stream().filter(q -> q.getDateTime().equals(newsDateMinusDay)).findAny().get();
//
//
//                BigDecimal firstDifference = (newsDateQuotePlusDay.getClose_price().subtract(newsDateQuote.getClose_price()))
//                        .divide(newsDateQuote.getClose_price(), MathContext.DECIMAL128)
//                        .multiply(BigDecimal.valueOf(100));
//                BigDecimal secondDifference = (newsDateQuotePlusWeek.getClose_price().subtract(newsDateQuote.getClose_price()))
//                        .divide(newsDateQuote.getClose_price(), MathContext.DECIMAL128)
//                        .multiply(BigDecimal.valueOf(100));
//                BigDecimal difference = (newsDateQuote.getOpen_price().subtract(newsDateQuote.getClose_price())
//                        .divide(newsDateQuote.getOpen_price(), MathContext.DECIMAL128)
//                        .multiply(BigDecimal.valueOf(100)));
//
//                summaries.add(NewsSummary.builder()
//                        .crypto(cryptoCurrency)
//                        .news(news)
//                        .firstDifference(firstDifference)
//                        .secondDifference(secondDifference)
//                        .difference(difference)
//                        .build());
//            } catch (Exception ex) {
//
//            }
//        }
//
//        summaries.sort(Comparator.comparing(NewsSummary::getDifference));
//        return summaries.stream().limit(60).toList();
    }


}