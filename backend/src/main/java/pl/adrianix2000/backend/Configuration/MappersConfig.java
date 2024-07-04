package pl.adrianix2000.backend.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.adrianix2000.backend.Models.Mappers.CryptoPostMapper;
import pl.adrianix2000.backend.Models.Mappers.UserMapper;

@Configuration
public class MappersConfig {
    @Bean
    public UserMapper createUserMapper() {
        return UserMapper.INSTANCE;
    }

    @Bean
    public CryptoPostMapper createCryptoPostMapper() {
        return CryptoPostMapper.INSTANCE;
    }

    @Bean
    public ObjectMapper getMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }

}
