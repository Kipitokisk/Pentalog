package com.parking.pentalog.entities

import jakarta.persistence.*

@Entity
@Table(name = "parking_slots")
class ParkingSlots {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parkingslotsid")
    val id = 0
}