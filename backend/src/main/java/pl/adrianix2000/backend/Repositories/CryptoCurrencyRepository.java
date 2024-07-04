package pl.adrianix2000.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import pl.adrianix2000.backend.Models.Entities.CryptoCurrency;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface CryptoCurrencyRepository extends JpaRepository<CryptoCurrency, Long> {
    @Transactional(readOnly = true)
    Optional<CryptoCurrency> findByName(String name);
    @Transactional(readOnly = true)
    @Query("SELECT c.name FROM CryptoCurrency c")
    List<String> getAllCryptoNames();
    @Transactional(readOnly = true)
    Optional<CryptoCurrency> findBySymbol(String symbol);
}
