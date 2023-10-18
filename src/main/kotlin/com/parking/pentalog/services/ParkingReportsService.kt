package com.parking.pentalog.services

import com.parking.pentalog.entities.ParkingReports
import com.parking.pentalog.entities.ParkingSlots
import com.parking.pentalog.repositories.ParkingReportsRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class ParkingReportsService(private val parkingReportsRepository: ParkingReportsRepository) {
    fun getById(id: Int): ParkingReports = this.parkingReportsRepository.getById(id)
    fun findAll(): List<ParkingReports> = this.parkingReportsRepository.findAll()
    fun saveReport(parkingReports: ParkingReports): ParkingReports = this.parkingReportsRepository.save(parkingReports)
    @Transactional
    fun deleteReportsByParkingLot(parkingLot: ParkingSlots) {
        parkingReportsRepository.deleteByParkingSlots(parkingLot)
    }
}