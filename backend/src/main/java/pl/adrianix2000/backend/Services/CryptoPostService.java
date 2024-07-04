package pl.adrianix2000.backend.Services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import pl.adrianix2000.backend.Exceptions.ApplicationException;
import pl.adrianix2000.backend.Models.CustomHttpResponse;
import pl.adrianix2000.backend.Models.DTO.AddCryptoPostsRequest;
import pl.adrianix2000.backend.Models.Entities.CryptoCurrency;
import pl.adrianix2000.backend.Models.Entities.CryptoPost;
import pl.adrianix2000.backend.Models.Entities.PostCategory;
import pl.adrianix2000.backend.Models.Mappers.CryptoPostMapper;
import pl.adrianix2000.backend.Repositories.CryptoPostRepository;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CryptoPostService {
    final String filePath = "/home/rafal/Pulpit/6 semestr/crypto/CryptoDataAnalysis/backend/src/main/resources/Data/Posts/data3.tsv";
    final String xmlFilePath = "/home/rafal/Pulpit/6 semestr/crypto/CryptoDataAnalysis/backend/src/main/resources/Data/Posts/data1.xml";

    final CryptoCurrencyService cryptoCurrencyService;
    final CryptoPostRepository repository;

    private final CryptoPostMapper mapper;

    @Transactional
    public void writeAllPostFromFileToDb() {
        List<CryptoPost> allPosts = readAllPostsFromFile();
        repository.saveAll(allPosts);
    }

    @Transactional(readOnly = true)
    public List<CryptoPost> readAllPostsFromFile() {
        File file = new File(filePath);
        List<CryptoPost> allPosts = new ArrayList<>();
        try {
            FileReader fileReader = new FileReader(file);
            BufferedReader bufferedReader = new BufferedReader(fileReader);

            allPosts = bufferedReader.lines().skip(1).map(this::convertLineToCryptoPost).toList();
        } catch(FileNotFoundException ex) {
            throw new ApplicationException("File not found", HttpStatus.NO_CONTENT);
        }
        return allPosts;
    }

    @Transactional(readOnly = true)
    public List<CryptoPost> getAllCryptoPosts() {
        return repository.findAll();
    }

    @Transactional
    public CustomHttpResponse addCryptoPost(AddCryptoPostsRequest request) {
        CryptoCurrency cryptoCurrency = cryptoCurrencyService.getCryptoByName(request.getCryptoName());
        CryptoPost newPost = mapper.AddCryptoPostsRequestToCryptoPost(request);
        newPost.setCryptoCurrency(cryptoCurrency);
        repository.save(newPost);

        return CustomHttpResponse.builder()
                .body(Optional.of("New crypto post was added to db"))
                .status(HttpStatus.OK)
                .build();
    }
    public List<CryptoPost> readAllPostsFromXML() {
        DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();

        List<CryptoPost> result = new ArrayList<>();
        try {
            DocumentBuilder builder = documentBuilderFactory.newDocumentBuilder();
            File file = new File(xmlFilePath);

            //    <date>2018-03-06T00:00:00+00:00</date>
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            try {
                Document document = builder.parse(file);

                Element root = document.getDocumentElement();
                NodeList nodes = root.getElementsByTagName("Post");

                log.info("Number of posts: " + nodes.getLength());

                for (int i = 0; i < nodes.getLength(); i++) {
                    Element postElement = (Element) nodes.item(i);

                    CryptoCurrency cryptoCurrency = cryptoCurrencyService.getCryptoBySymbol(
                            getElementTextContent(postElement, "cryptoCurrency")
                                    .toUpperCase());

                    String stringData = getElementTextContent(postElement, "date");

                    CryptoPost cryptoPost = CryptoPost.builder()
                            .date(LocalDate.parse(stringData.split("T")[0], formatter))
                            .title(getElementTextContent(postElement, "title"))
                            .cryptoCurrency(cryptoCurrency)
                            .isPositive(Boolean.parseBoolean(getElementTextContent(postElement, "isPositive")))
                            .category(PostCategory.valueOf(getElementTextContent(postElement, "category")))
                            .link(getElementTextContent(postElement, "link"))
                            .build();

                    result.add(cryptoPost);
                }

            } catch (SAXException saxException) {
                throw new ApplicationException("SAX EXCEPTION", HttpStatus.INTERNAL_SERVER_ERROR);
            } catch (FileNotFoundException fileNotFoundException) {
                throw new ApplicationException("File could not be found", HttpStatus.NO_CONTENT);
            } catch (IOException ioException) {
                throw new ApplicationException("IO exception", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (ParserConfigurationException ex) {
            throw new ApplicationException("INTERNAL SERVER ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result;
    }

    private String getElementTextContent(Element parentElement, String tagName) {
        NodeList nodeList = parentElement.getElementsByTagName(tagName);
        if (nodeList.getLength() > 0) {
            return nodeList.item(0).getTextContent();
        }
        return null;
    }


    public List<CryptoPost> getPostForCrypto(String cryptoCurrencyName) {
        CryptoCurrency crypto = cryptoCurrencyService.getCryptoByName(cryptoCurrencyName);
        return repository.findCryptoPostsByCryptoName(crypto.getSymbol());
    }

    private CryptoPost convertLineToCryptoPost(String line) {
        String[] splitted = line.split("\t");
        if(splitted.length != 6) {
            throw new ApplicationException("Invalid file format", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        String cryptoSymbol = splitted[1];
        CryptoCurrency cryptoCurrency = cryptoCurrencyService.getCryptoBySymbol(cryptoSymbol.toUpperCase());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return CryptoPost.builder()
                .date(LocalDate.parse(splitted[0], formatter))
                .title(splitted[2])
                .isPositive(Boolean.parseBoolean(splitted[3]))
                .category(PostCategory.valueOf(splitted[4]))
                .cryptoCurrency(cryptoCurrency)
                .link(splitted[5])
                .build();
    }
}
