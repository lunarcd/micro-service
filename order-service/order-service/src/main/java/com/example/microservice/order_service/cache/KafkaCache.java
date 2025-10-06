package com.example.microservice.order_service.cache;

import com.example.microservice.order_service.UserDto;
import com.example.microservice.order_service.events.UserEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class KafkaCache {

    private final Map<Long, UserDto> userCache = new ConcurrentHashMap<>();

    @KafkaListener(topics = "user-topic", groupId = "order-service")
    public void consume(UserEvent userEvent) {
        userCache.put(userEvent.getId(), new UserDto(userEvent.getId(), userEvent.getUsername(), userEvent.getEmail()));
    }

    public UserDto getUserById(Long id) {
        return userCache.get(id);
    }
}
