package pl.adrianix2000.backend.Models.Mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import pl.adrianix2000.backend.Models.DTO.UserLoginResponse;
import pl.adrianix2000.backend.Models.DTO.UserRegistryRequest;
import pl.adrianix2000.backend.Models.Entities.User;

@Mapper
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper( UserMapper.class );

    @Mapping(source = "first_name", target = "first_name")
    @Mapping(source = "last_name", target = "last_name")
    @Mapping(source = "password", target = "password")
    @Mapping(source = "email", target = "email")
    UserLoginResponse UserToUserLoginResponse(User user);


    @Mapping(source = "first_name", target = "first_name")
    @Mapping(source = "last_name", target = "last_name")
    @Mapping(source = "password", target = "password")
    @Mapping(source = "email", target = "email")
    User UserRegistryRequestToUser(UserRegistryRequest userRegistryRequest);
}

