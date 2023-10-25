package com.parking.pentalog.services

import com.parking.pentalog.entities.ParkingReports
import com.parking.pentalog.entities.ParkingSlots
import com.parking.pentalog.repositories.ParkingReportsRepository
import com.parking.pentalog.repositories.ParkingSlotsRepository
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class ParkingReportsService(private val parkingReportsRepository: ParkingReportsRepository, private val parkingSlotsService: ParkingSlotsService) {
    fun getById(id: Int): ParkingReports = this.parkingReportsRepository.getById(id)
    fun findAll(): List<ParkingReports> = this.parkingReportsRepository.findAll()
    fun saveReport(parkingReports: ParkingReports): ParkingReports = this.parkingReportsRepository.save(parkingReports)
    fun removeReportsByParkingSlotId(parkingSlotId: Int): Int {
        val reports = parkingReportsRepository.findByParkingSlotId(parkingSlotId)
        parkingReportsRepository.deleteInBatch(reports)
        return reports.size
    }
    fun deleteParkingReport(reportId: Int) {
        // Check if the report exists before attempting to delete it
        val existingReport = parkingReportsRepository.findById(reportId)
        if (existingReport.isPresent) {
            parkingReportsRepository.delete(existingReport.get())
        }
    }
}