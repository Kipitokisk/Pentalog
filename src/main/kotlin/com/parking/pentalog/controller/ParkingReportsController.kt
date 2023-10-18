package com.parking.pentalog.controller

import ReportDTO
import com.parking.pentalog.entities.ParkingReports
import com.parking.pentalog.services.ParkingReportsService
import com.parking.pentalog.services.ParkingSlotsService
import com.parking.pentalog.services.UserService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*

@RestController
@RequestMapping("/api")
class ParkingReportsController (private val parkingReportsService: ParkingReportsService,
                                private val parkingSlotService: ParkingSlotsService, private val userService: UserService){
    @PostMapping("/parking-list/{parkingSlotId}/report")
    fun reportParkingLot(@PathVariable parkingSlotId: Int, response: HttpServletResponse): ResponseEntity<ReportDTO> {
        // Fetch the parking lot by ID
        val parkingLot = parkingSlotService.getById(parkingSlotId)

        if (parkingLot != null) {
            val parkingReport = ParkingReports()
            parkingReport.reportTime = Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant())
            parkingReport.parkingSlots = parkingLot
            val savedReport = parkingReportsService.saveReport(parkingReport)

            // Create a DTO to return the data
            val reportDTO = ReportDTO(
                savedReport.id,
                savedReport.reportTime,
                savedReport.isPending,
                parkingLot.id
            )

            return ResponseEntity.ok(reportDTO)
        } else {
            return ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/parking-list/{parkingLotId}/delete-reports")
    fun deleteReportsByParkingLot(@PathVariable parkingLotId: Int): ResponseEntity<String> {
        if (parkingSlotService.existsByParkingSlotsId(parkingLotId)) {
            // If the parking lot exists, delete its associated reports
            parkingReportsService.deleteReportsByParkingLot(parkingSlotService.getById(parkingLotId))
            return ResponseEntity.ok("Reports associated with parking lot ID $parkingLotId have been deleted.")
        } else {
            // If the parking lot does not exist, return a not found response
            return ResponseEntity.notFound().build()
        }
    }

}