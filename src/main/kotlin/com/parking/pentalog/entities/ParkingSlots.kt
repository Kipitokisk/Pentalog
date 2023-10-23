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
    @JsonManagedReference
    @OneToMany(
        mappedBy = "parkingSlots", cascade = [CascadeType.ALL], fetch = FetchType.LAZY
    )
    private val parkingReports: List<ParkingReports> = mutableListOf()
    @Column(name = "isoccupied")
    var isOccupied: Boolean = false;
    @Column(name = "parkingtime")
    var parkingTime: Date? = null;

    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "userid")
    var users: Users? = null;
}