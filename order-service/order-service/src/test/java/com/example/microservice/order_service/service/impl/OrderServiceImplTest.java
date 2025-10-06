package com.example.microservice.order_service.service.impl;

import com.example.microservice.order_service.UserClient;
import com.example.microservice.order_service.UserDto;
import com.example.microservice.order_service.cache.KafkaCache;
import com.example.microservice.order_service.model.Order;
import com.example.microservice.order_service.model.OrderResponse;
import com.example.microservice.order_service.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserClient userClient;

    @Mock
    private KafkaCache kafkaCache;

    @InjectMocks
    private OrderServiceImpl orderService;

    static Stream<Order> orderProvider() {
        Order order1 = new Order();
        order1.setId(1L);
        order1.setUserId(1L);
        order1.setProduct("Test Product 1");
        order1.setPrice(100.0);

        Order order2 = new Order();
        order2.setId(2L);
        order2.setUserId(1L);
        order2.setProduct("Test Product 2");
        order2.setPrice(200.0);

        return Stream.of(order1, order2);
    }

    @ParameterizedTest
    @MethodSource("orderProvider")
    void testGetOrderById(Order order) {
        UserDto userDto = new UserDto();
        userDto.setId(order.getUserId());
        userDto.setName("Test User");
        userDto.setEmail("test@example.com");

        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));
        when(kafkaCache.getUserById(order.getUserId())).thenReturn(null);
        when(userClient.getUserById(order.getUserId())).thenReturn(userDto);

        OrderResponse orderResponse = orderService.getOrderById(order.getId());

        assertEquals(order.getProduct(), orderResponse.getProduct());
        assertEquals(userDto.getName(), orderResponse.getUser().getName());
    }

    @Test
    void testGetOrderById_orderNotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> orderService.getOrderById(1L));
    }

    @ParameterizedTest
    @MethodSource("orderProvider")
    void testGetOrderById_userFromCache(Order order) {
        UserDto userDto = new UserDto();
        userDto.setId(order.getUserId());
        userDto.setName("Test User");
        userDto.setEmail("test@example.com");

        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));
        when(kafkaCache.getUserById(order.getUserId())).thenReturn(userDto);

        OrderResponse orderResponse = orderService.getOrderById(order.getId());

        assertEquals(order.getProduct(), orderResponse.getProduct());
        assertEquals(userDto.getName(), orderResponse.getUser().getName());
    }

    @ParameterizedTest
    @MethodSource("orderProvider")
    void testCreateOrder(Order order) {
        UserDto userDto = new UserDto();
        userDto.setId(order.getUserId());
        userDto.setName("Test User");
        userDto.setEmail("test@example.com");

        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(kafkaCache.getUserById(order.getUserId())).thenReturn(null);
        when(userClient.getUserById(order.getUserId())).thenReturn(userDto);

        OrderResponse orderResponse = orderService.createOrder(order);

        assertEquals(order.getProduct(), orderResponse.getProduct());
        assertEquals(userDto.getName(), orderResponse.getUser().getName());
    }

    @ParameterizedTest
    @MethodSource("orderProvider")
    void testCreateOrder_userNotFound(Order order) {
        when(kafkaCache.getUserById(order.getUserId())).thenReturn(null);
        when(userClient.getUserById(order.getUserId())).thenReturn(null);

        assertThrows(ResponseStatusException.class, () -> orderService.createOrder(order));
    }

    @ParameterizedTest
    @MethodSource("orderProvider")
    void testCreateOrder_userFromCache(Order order) {
        UserDto userDto = new UserDto();
        userDto.setId(order.getUserId());
        userDto.setName("Test User");
        userDto.setEmail("test@example.com");

        when(kafkaCache.getUserById(order.getUserId())).thenReturn(userDto);
        when(orderRepository.save(order)).thenReturn(order);

        OrderResponse orderResponse = orderService.createOrder(order);

        assertEquals(order.getProduct(), orderResponse.getProduct());
        assertEquals(userDto.getName(), orderResponse.getUser().getName());
    }

    @ParameterizedTest
    @MethodSource("orderProvider")
    void testCreateOrder_userClientThrowsException(Order order) {
        when(kafkaCache.getUserById(order.getUserId())).thenReturn(null);
        when(userClient.getUserById(order.getUserId())).thenThrow(new RuntimeException("Service unavailable"));

        assertThrows(ResponseStatusException.class, () -> orderService.createOrder(order));
    }

    @Test
    void testGetAllOrders() {
        Order order1 = new Order();
        order1.setId(1L);
        order1.setUserId(1L);
        order1.setProduct("Test Product 1");
        order1.setPrice(100.0);

        Order order2 = new Order();
        order2.setId(2L);
        order2.setUserId(1L);
        order2.setProduct("Test Product 2");
        order2.setPrice(200.0);

        List<Order> orders = List.of(order1, order2);

        when(orderRepository.findAll()).thenReturn(orders);

        List<Order> result = orderService.getAllOrders();

        assertEquals(2, result.size());
        assertEquals("Test Product 1", result.get(0).getProduct());
        assertEquals("Test Product 2", result.get(1).getProduct());
    }
}
