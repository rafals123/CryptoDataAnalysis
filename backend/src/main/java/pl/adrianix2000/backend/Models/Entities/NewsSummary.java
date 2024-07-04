package pl.adrianix2000.backend.Models.Entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NewsSummary {
    private News news;
    private CryptoCurrency crypto;
    private BigDecimal firstDifference;
    private BigDecimal secondDifference;
    private BigDecimal difference;
    private BigDecimal weekDifference;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDateTime date;
}
