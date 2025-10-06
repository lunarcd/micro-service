package com.example.microservice.user_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaProducerConfig {

    @Bean
    public NewTopic userTopic() {
        return TopicBuilder.name("user-topic")
                .partitions(1)
                .replicas(1)
                .build();
    }
}
