package com.parking.pentalog.entities

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "parking_reports")
class ParkingReports {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parkingreportsid")
    val id: Int? = null

    @Column(name = "reporttime")
    var reportTime: Date? = null

    @Column(name = "ispending")
    var isPending: Boolean = true

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parkingslotsid", nullable = false)
    var parkingSlots: ParkingSlots? = null
}