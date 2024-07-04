package pl.adrianix2000.backend.Repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import pl.adrianix2000.backend.Models.DTO.UserRegistryRequest;
import pl.adrianix2000.backend.Models.Entities.User;
import pl.adrianix2000.backend.Models.Mappers.UserMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
@Deprecated
public class InMemoryUserRespository {

    private List<User> users;

    private final UserMapper userMapper;

    @Autowired
    public InMemoryUserRespository(UserMapper userMapper) {
        users = new ArrayList<>();

//        users.add(new User(1, "Adrian", "Sak", "test1", "daudshlock@gmail.com"));
//        users.add(new User(2, "Rafał", "Seredowski", "test2", "rafals123@gmail.com"));

        this.userMapper = userMapper;
    }


    public List<User> getAllUsers() {
        return users;
    }

    public Optional<User> findUserByEmail(String email) {
        return users.stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst();
    }

    public boolean addUser(UserRegistryRequest user) {

        User newUser = userMapper.UserRegistryRequestToUser(user);
        newUser.setId(users.size() + 1);

        users.add(newUser);

        return true;
    }
}
