package com.parking.pentalog.entities

import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import org.springframework.data.auditing.CurrentDateTimeProvider
import java.time.LocalDateTime
import java.time.ZoneId
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
    @JoinColumn(name = "usersid")
    var users: Users? = null;

    fun occupySlot(user: Users){
        this.isOccupied = true
        this.parkingTime = Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant())
        this.users = user
    }}