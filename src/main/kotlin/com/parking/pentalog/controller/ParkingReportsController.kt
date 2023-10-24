package com.parking.pentalog.controller

import ReportDTO
import com.parking.pentalog.DTOs.Message
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
        val parkingLot = parkingSlotService.getById(parkingSlotId)
        val userId = parkingLot.users?.id

        if (parkingLot != null) {
            val parkingReport = ParkingReports()
            parkingReport.reportTime = Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant())
            parkingReport.parkingSlots = parkingLot
            val savedReport = parkingReportsService.saveReport(parkingReport)

            val reportDTO = ReportDTO(
                savedReport.id,
                savedReport.reportTime,
                savedReport.isPending,
                parkingLot.id,
                userId
            )

            return ResponseEntity.ok(reportDTO)
        } else {
            return ResponseEntity.notFound().build()
        }
    }


    @DeleteMapping("/parking-list/{parkingSlotId}/report-delete")
    fun removeReportsForParkingLot(@PathVariable parkingSlotId: Int): ResponseEntity<Any> {
        val removedCount = parkingReportsService.removeReportsByParkingSlotId(parkingSlotId)

        return if (removedCount > 0) {
            ResponseEntity.ok(Message("Deleted $removedCount reports from Parking Slot: $parkingSlotId"))
        } else {
            ResponseEntity.notFound().build()
        }
    }
}