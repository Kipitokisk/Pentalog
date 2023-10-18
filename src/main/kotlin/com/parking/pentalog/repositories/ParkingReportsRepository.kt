package com.parking.pentalog.repositories

import com.parking.pentalog.entities.ParkingReports
import com.parking.pentalog.entities.ParkingSlots
import org.springframework.data.jpa.repository.JpaRepository

interface ParkingReportsRepository: JpaRepository<ParkingReports, Int> {
    fun deleteByParkingSlots(parkingSlots: ParkingSlots)
}