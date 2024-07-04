package pl.adrianix2000.backend.Services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator.Builder;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import pl.adrianix2000.backend.Models.DTO.UserLoginResponse;
import pl.adrianix2000.backend.Models.Entities.User;

import java.time.Instant;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;

@Service
@Slf4j
public class JWTService {

    @Value("${security.keys.private_key}")
    private String PRIVATE_KEY;


    private Date calculateExpirationDate(int minutes) {
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.MINUTE, minutes);
        return calendar.getTime();
    }


    public String generateToken(User user) {

        Date expirationDate = calculateExpirationDate(15);

        Builder tokenBuilder = JWT.create()
                .withClaim("firstName", user.getFirst_name())
                .withClaim("lastName", user.getLast_name())
                .withClaim("email", user.getEmail())
                .withClaim("role", user.getRole().toString())
                .withExpiresAt(expirationDate)
                .withIssuedAt(Date.from(Instant.now()));

        return  tokenBuilder.sign(Algorithm.HMAC256(PRIVATE_KEY));
    }

    public Authentication verifyToken(String token) throws TokenExpiredException {

        DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(PRIVATE_KEY))
                .build()
                .verify(token);

        UserLoginResponse userLoginResponse = UserLoginResponse.builder()
                .first_name(decodedJWT.getClaim("firstName").asString())
                .last_name(decodedJWT.getClaim("lastName").asString())
                .email(decodedJWT.getClaim("email").asString())
                .token(token)
                .build();

        return new UsernamePasswordAuthenticationToken(userLoginResponse,
                null, Collections.emptyList());

    }

    public String getClaimFromToken(String token, String claimName) {
        DecodedJWT decodedJWT = JWT.decode(token);
        return decodedJWT.getClaim(claimName).asString();
    }


}
