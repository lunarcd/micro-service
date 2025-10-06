package com.example.microservice.user_service.service.impl;

import com.example.microservice.user_service.events.UserEvent;
import com.example.microservice.user_service.model.User;
import com.example.microservice.user_service.model.UserDto;
import com.example.microservice.user_service.repository.UserRepository;
import com.example.microservice.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final KafkaTemplate<String, UserEvent> kafkaTemplate;

    @Override
    @CachePut(value = "users", key = "#result.id")
    @CacheEvict(value = "usersAll", allEntries = true)
    public UserDto createUser(User user) {
        User savedUser = userRepository.save(user);
        kafkaTemplate.send("user-topic", new UserEvent(savedUser.getId(), savedUser.getName(), savedUser.getEmail()));
        return mapToDto(savedUser);
    }

    @Override
    @Cacheable(value = "usersAll")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Cacheable(value = "users", key = "#id")
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDto(user.getId(), user.getName(), user.getEmail());
    }

    private UserDto mapToDto(User user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail());
    }
}
