package com.example.microservice.user_service.service;

import com.example.microservice.user_service.model.User;
import com.example.microservice.user_service.model.UserDto;

import java.util.List;

public interface UserService {
    UserDto createUser(User user);

    List<User> getAllUsers();

    UserDto getUserById(Long id);
}
