package pl.adrianix2000.backend.Models.DTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExtremeHttpRequest {
    private String cryptoCurrencyName;
    private int extremeType;
     //0 - minimum, 1 - maximum
}
