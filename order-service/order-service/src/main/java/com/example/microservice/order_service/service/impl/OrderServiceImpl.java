package com.example.microservice.order_service.service.impl;

import com.example.microservice.order_service.UserClient;
import com.example.microservice.order_service.UserDto;
import com.example.microservice.order_service.cache.KafkaCache;
import com.example.microservice.order_service.model.Order;
import com.example.microservice.order_service.model.OrderResponse;
import com.example.microservice.order_service.repository.OrderRepository;
import com.example.microservice.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserClient userClient;
    private final KafkaCache kafkaCache;

    @Override
    @Cacheable(value = "orders", key = "#id")
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id).orElseThrow();
        UserDto user = Optional.ofNullable(kafkaCache.getUserById(order.getUserId()))
                .orElse(userClient.getUserById(order.getUserId()));
        return new OrderResponse(order.getId(), order.getProduct(), order.getPrice(), user);
    }

    @Override
    @CachePut(value = "orders", key = "#result.orderId")
    @CacheEvict(value = "ordersAll", allEntries = true)
    public OrderResponse createOrder(Order order) {
        UserDto user = Optional.ofNullable(kafkaCache.getUserById(order.getUserId()))
                .orElseGet(() -> {
                    try {
                        return userClient.getUserById(order.getUserId());
                    } catch (Exception e) {
                        return null;
                    }
                });

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + order.getUserId());
        }

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    @Override
    @Cacheable(value = "ordersAll")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    private OrderResponse mapToResponse(Order order) {
        UserDto user = Optional.ofNullable(kafkaCache.getUserById(order.getUserId()))
                .orElse(userClient.getUserById(order.getUserId()));
        return new OrderResponse(order.getId(), order.getProduct(), order.getPrice(), user);
    }
}
