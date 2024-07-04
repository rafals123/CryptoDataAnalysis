package pl.adrianix2000.backend.Models.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.adrianix2000.backend.Models.Entities.PostCategory;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddCryptoPostsRequest {
    private String title;
    private LocalDate date;
    private boolean positive;
    private PostCategory category;
    private String link;
    private String cryptoName;
}
