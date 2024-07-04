package pl.adrianix2000.backend.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.Optional;

@Data
@Builder
@AllArgsConstructor
public class CustomHttpResponse {
    private HttpStatus status;
    private Optional<Object> body;

}
