package com.parking.pentalog.repositories

import com.parking.pentalog.entities.ParkingSlots
import org.springframework.data.jpa.repository.JpaRepository


interface ParkingSlotsRepository: JpaRepository<ParkingSlots, Int> {
}