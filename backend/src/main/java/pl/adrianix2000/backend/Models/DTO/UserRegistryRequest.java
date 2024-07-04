package pl.adrianix2000.backend.Models.DTO;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
public class UserRegistryRequest {
    @NotBlank(message = "Imię nie może być puste")
    @Size(max = 60, message = "Imię może zawierać maksymalnie 60 znaków")
    @Pattern(regexp = "^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*$", message = "Imię musi zaczynać się z dużej litery i zawierać tylko litery")
    private String first_name;
    @NotBlank(message = "Nazwisko nie może być puste")
    @Size(max = 70, message = "Nazwisko może zawierać maksymalnie 70 znaków")
    @Pattern(regexp = "^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*$", message = "Nazwisko musi zaczynać się z dużej litery i zawierać tylko litery")
    private String last_name;
    @NotBlank(message = "Hasło nie może być puste")
    @Size(min = 8, message = "Hasło musi zawierać minimum 8 znaków")
    private String password;
    @NotBlank(message = "Adres e-mail nie może być pusty")
    @Email(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Nieprawidłowy format adresu e-mail")
    private String email;
}
