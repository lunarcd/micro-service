package com.example.microservice.order_service.service;

import com.example.microservice.order_service.model.Order;
import com.example.microservice.order_service.model.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse getOrderById(Long id);

    OrderResponse createOrder(Order order);

    List<Order> getAllOrders();
}
