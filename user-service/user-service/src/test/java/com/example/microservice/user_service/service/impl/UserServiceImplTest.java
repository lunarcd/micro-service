package com.example.microservice.user_service.service.impl;

import com.example.microservice.user_service.events.UserEvent;
import com.example.microservice.user_service.model.User;
import com.example.microservice.user_service.model.UserDto;
import com.example.microservice.user_service.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private KafkaTemplate<String, UserEvent> kafkaTemplate;

    @InjectMocks
    private UserServiceImpl userService;

    static Stream<User> userProvider() {
        User user1 = new User();
        user1.setId(1L);
        user1.setName("Test User 1");
        user1.setEmail("test1@example.com");

        User user2 = new User();
        user2.setId(2L);
        user2.setName("Test User 2");
        user2.setEmail("test2@example.com");

        return Stream.of(user1, user2);
    }

    @ParameterizedTest
    @MethodSource("userProvider")
    void testGetUserById(User user) {
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        UserDto userDto = userService.getUserById(user.getId());

        assertEquals(user.getName(), userDto.getName());
    }

    @Test
    void testGetUserById_userNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserById(1L));
    }

    @ParameterizedTest
    @MethodSource("userProvider")
    void testCreateUser(User user) {
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserDto userDto = userService.createUser(user);

        assertEquals(user.getName(), userDto.getName());
    }

    @ParameterizedTest
    @MethodSource("userProvider")
    void testCreateUser_sendsKafkaEvent(User user) {
        when(userRepository.save(any(User.class))).thenReturn(user);

        userService.createUser(user);

        verify(kafkaTemplate).send(eq("user-topic"),
                argThat(event -> event.getId().equals(user.getId()) &&
                        event.getUsername().equals(user.getName()) &&
                        event.getEmail().equals(user.getEmail())));
    }

    @Test
    void testGetAllUsers() {
        User user1 = new User();
        user1.setId(1L);
        user1.setName("User 1");
        user1.setEmail("u1@example.com");

        User user2 = new User();
        user2.setId(2L);
        user2.setName("User 2");
        user2.setEmail("u2@example.com");

        when(userRepository.findAll()).thenReturn(List.of(user1, user2));

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
        assertEquals("User 1", result.get(0).getName());
        assertEquals("User 2", result.get(1).getName());
    }
}
