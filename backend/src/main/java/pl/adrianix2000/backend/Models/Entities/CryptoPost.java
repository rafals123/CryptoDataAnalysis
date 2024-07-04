package pl.adrianix2000.backend.Models.Entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "crypto_posts")
public class CryptoPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "title")
    private String title;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "date")
    private LocalDate date;
    @Column(name = "is_positive")
    private boolean isPositive;
    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private PostCategory category;
    @Column(name = "link")
    private String link;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "cryptocurrency_id")
    private CryptoCurrency cryptoCurrency;
}
