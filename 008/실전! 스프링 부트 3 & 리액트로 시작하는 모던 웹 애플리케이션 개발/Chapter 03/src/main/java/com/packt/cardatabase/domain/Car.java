package com.packt.cardatabase.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String brand, model, color, registrationNumber;

    private int modelYear, price;

    public Car() {
    }

    public Car(String brand, String model, String color, String registrationNumber, int modelYear, int price, Owner owner) {
        super();
    }
}
