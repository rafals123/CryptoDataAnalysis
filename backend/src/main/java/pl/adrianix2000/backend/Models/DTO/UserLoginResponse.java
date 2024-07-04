package pl.adrianix2000.backend.Models.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class UserLoginResponse {
    private String first_name;
    private String last_name;
    private String password;
    private String email;
    private String token;
}
