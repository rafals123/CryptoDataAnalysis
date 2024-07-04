package pl.adrianix2000.backend.Services.Analysis;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.adrianix2000.backend.Models.Entities.CryptoCurrency;
import pl.adrianix2000.backend.Models.Entities.News;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsFilter {

    private final String newsFilePath = "/home/rafal/Pulpit/daneAnaliza/News_Category_Dataset_v3.json";
    private final ObjectMapper objectMapper;

    public List<News> readNewsFromFile() {
        List<News> result = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(newsFilePath))) {
            String line;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            while ((line = reader.readLine()) != null) {
                JsonNode node = objectMapper.readTree(line);

                String date = node.get("date").asText();
                LocalDateTime date2 = LocalDateTime.parse(date + "T23:59:59"); // ISO format for LocalDateTime

                News news = News.builder()
                        .category(node.get("category").asText())
                        .date(date2)
                        .link(node.get("link").asText())
                        .short_description(node.get("short_description").asText())
                        .build();
                result.add(news);

            }
        } catch (IOException ex) {
            throw new RuntimeException("Failed to read file", ex);
        }

        return result;
    }
}
