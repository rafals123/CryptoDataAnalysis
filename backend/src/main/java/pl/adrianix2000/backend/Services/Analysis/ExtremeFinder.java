package pl.adrianix2000.backend.Services.Analysis;

import org.springframework.stereotype.Service;
import pl.adrianix2000.backend.Models.Entities.CryptoCurrency;
import pl.adrianix2000.backend.Models.Entities.Quotes;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class ExtremeFinder {
/*
    public List<String> findLocalMinima(List<Quotes> quotes) {

        int currentTrendLength = 0;
        BigDecimal firstTrendPrice = null;
        BigDecimal lastTrendPrice = null;

        List<String> result = new ArrayList<>();

        for (int i = 1; i < quotes.size(); i++) {
            Quotes previousQuote = quotes.get(i-1);
            Quotes currentQuote = quotes.get(i);

            if((previousQuote.getClose_price().compareTo(previousQuote.getOpen_price()))>0) //czerwona
            {
                if((currentQuote.getClose_price().compareTo(currentQuote.getOpen_price()))<0) //zielona
                {
                    currentTrendLength = 1;
                    firstTrendPrice = currentQuote.getOpen_price();
                }
            }
            else { //zielona
                if((currentQuote.getClose_price().compareTo(currentQuote.getOpen_price()))<0) //zielona
                {
                    currentTrendLength++;
                    lastTrendPrice = currentQuote.getClose_price();
                } else { //czerwona

                    BigDecimal difference = lastTrendPrice.subtract(firstTrendPrice)
                            .divide(firstTrendPrice, 2, BigDecimal.ROUND_HALF_UP)
                            .multiply(BigDecimal.valueOf(100));


                    if(currentTrendLength > 5 || difference.compareTo(new BigDecimal("-10.0")) < 0) {
                        result.add(previousQuote.getDateTime().toString());
                    }

                    currentTrendLength = 0;
                }
            }
        }

        return result;
    }
*/
//public List<String> findLocalMinima(List<Quotes> quotes) {
//    int windowSize = 7;
//    List<String> result = new ArrayList<>();
//    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
//
//    Quotes startOfKrach = null;
//
//    quotes = quotes.stream()
//            .filter(q -> {
//                BigDecimal closePrice = q.getClose_price();
//                BigDecimal openPrice = q.getOpen_price();
//                BigDecimal priceDifference = closePrice.subtract(openPrice).abs();
//                BigDecimal priceChangePercentage = priceDifference
//                        .divide(openPrice, RoundingMode.HALF_UP)
//                        .multiply(new BigDecimal(100));
//                return priceChangePercentage.compareTo(new BigDecimal(0.1)) > 0;
//            })
//            .toList();
//
//
//    for (int i = windowSize; i < quotes.size()-1; i++) {
//        Quotes currentQuote = quotes.get(i);
//
//        BigDecimal average = calculateMovingAverage(quotes, i - windowSize, i);
//
//        if (isLocalMinima(quotes, i, windowSize, average)) {
//
//            if (!result.isEmpty()) {
//
//                if(!isLocalMinima(quotes, i+1, windowSize, average)) {
//
//                    if (startOfKrach.getOpen_price().subtract(quotes.get(i).getClose_price())
//                            .divide(startOfKrach.getOpen_price(), RoundingMode.HALF_UP)
//                            .multiply(new BigDecimal(100.0))
//                            .compareTo(new BigDecimal(15.0)) < 0) {
//                        result.add(currentQuote.getDateTime().toString());
//
//                    }
//
//                }
//            } else {
//                result.add(currentQuote.getDateTime().toString());
//            }
//        } else {
//            if (isLocalMinima(quotes, i+1, windowSize, average)) {
//                startOfKrach = quotes.get(i+1);
//            }
//        }
//    }
//
//    return result;
//}

    public List<String> findLocalMinima(List<Quotes> quotes) {
        int windowSize = 12; // Rozmiar okna czasowego do sprawdzania minimów
        List<String> result = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        for (int i = windowSize; i < quotes.size() - windowSize; i++) {
            Quotes currentQuote = quotes.get(i);
            BigDecimal average = calculateMovingAverage(quotes, i - windowSize, i + windowSize);

            if (isLocalMinima(quotes, i, windowSize, average)) {
                result.add(currentQuote.getDateTime().toString());
            }
        }

        return result;
    }

    private BigDecimal calculateMovingAverage(List<Quotes> quotes, int start, int end) {
        BigDecimal sum = BigDecimal.ZERO;
        for (int i = start; i <= end && i < quotes.size(); i++) {
            sum = sum.add(quotes.get(i).getClose_price());
        }
        return sum.divide(BigDecimal.valueOf(end - start + 1), 2, RoundingMode.HALF_UP);
    }

    private boolean isLocalMinima(List<Quotes> quotes, int currentIndex, int windowSize, BigDecimal average) {
        Quotes currentQuote = quotes.get(currentIndex);
        BigDecimal currentPrice = currentQuote.getClose_price();

        if (currentPrice.compareTo(average) < 0) {
            // Sprawdzanie czy aktualna cena jest mniejsza od cen w oknie przed i po aktualnym punkcie
            for (int i = currentIndex - windowSize; i < currentIndex + windowSize && i < quotes.size(); i++) {
                if (i != currentIndex && quotes.get(i).getClose_price().compareTo(currentPrice) <= 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    private boolean isLocalMaxima(List<Quotes> quotes, int currentIndex, int windowSize, BigDecimal average) {
        Quotes currentQuote = quotes.get(currentIndex);
        BigDecimal currentPrice = currentQuote.getClose_price();

        if (currentPrice.compareTo(average) > 0) {
            for (int i = currentIndex - windowSize; i < currentIndex + windowSize && i < quotes.size(); i++) {
                if (i != currentIndex && quotes.get(i).getClose_price().compareTo(currentPrice) >= 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

}