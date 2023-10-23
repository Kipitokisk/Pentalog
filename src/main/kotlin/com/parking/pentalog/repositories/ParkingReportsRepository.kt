package com.parking.pentalog.repositories

import com.parking.pentalog.entities.ParkingReports
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ParkingReportsRepository: JpaRepository<ParkingReports, Int> {
    @Query("SELECT r FROM ParkingReports r JOIN r.parkingSlots p WHERE p.id = :parkingSlotId")
    fun findByParkingSlotId(@Param("parkingSlotId") parkingSlotId: Int): List<ParkingReports>
}