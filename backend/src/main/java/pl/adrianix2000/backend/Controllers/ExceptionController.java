package pl.adrianix2000.backend.Controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import pl.adrianix2000.backend.Exceptions.ApplicationException;
import pl.adrianix2000.backend.Models.DTO.ErrorDTO;

@Controller
@ControllerAdvice
@Slf4j
public class ExceptionController {

    @ExceptionHandler(value = ApplicationException.class)
    public ResponseEntity<ErrorDTO> handleException(ApplicationException exception) {
        return ResponseEntity.status(exception.getStatus())
                .body(new ErrorDTO(exception.getMessage()));
    }

}
