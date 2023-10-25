package com.parking.pentalog.entities

import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import java.util.*


@Entity
@Table(name = "parking_slots")
class ParkingSlots {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parkingslotsid")
    var id = 0
    @OneToMany(mappedBy = "parkingSlots", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    private val _parkingReports: List<ParkingReports> = mutableListOf()

    val parkingReports get() = _parkingReports.toList()
    @Column(name = "isoccupied")
    var isOccupied: Boolean = false;
    @Column(name = "parkingtime")
    var parkingTime: Date? = null;

    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "userid")
    var users: Users? = null;
}