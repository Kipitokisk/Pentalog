package com.parking.pentalog.entities

import jakarta.persistence.*
import java.util.Date

@Entity
@Table(name = "parking_slots")
class ParkingSlots {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parkingslotsid")
    val id = 0
    @Column(name = "isoccupied")
    var isOccupied: Boolean = false;
    @Column(name = "parkingtime")
    var parkingTime: Date? = null;

    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "userid")
    var users: Users? = null;
}