package com.parking.pentalog.controller

import ReportDTO
import com.parking.pentalog.DTOs.Message
import com.parking.pentalog.DTOs.ParkingSlotDTO
import com.parking.pentalog.DTOs.UsersDTO
import com.parking.pentalog.entities.ParkingReports
import com.parking.pentalog.services.ParkingReportsService
import com.parking.pentalog.services.ParkingSlotsService
import com.parking.pentalog.services.UserService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.dao.DataAccessException
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*

@RestController
@RequestMapping("/api")
class ParkingReportsController (private val parkingReportsService: ParkingReportsService,
                                private val parkingSlotService: ParkingSlotsService, private val userService: UserService){

    @GetMapping("/parking-list-report")
    fun parkingReportsList(): ResponseEntity<List<ReportDTO>> {
        val parkingReports = parkingReportsService.findAll()
            .map { report ->
                val parkingSlot = report.parkingSlots
                val user = parkingSlot?.users

                ReportDTO(
                    report.id,
                    report.reportTime,
                    report.isPending,
                    ParkingSlotDTO(
                        parkingSlot!!.id,
                        parkingSlot.isOccupied,
                        parkingSlot?.parkingTime,
                        user?.let { UsersDTO(it.id, it.nickname, it.email) }
                    )
                )
            }

        return ResponseEntity.ok(parkingReports)
    }

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
                ParkingSlotDTO(parkingLot.id, parkingLot.isOccupied, parkingLot.parkingTime, UsersDTO(
                    parkingLot.users!!.id, parkingLot
                    .users!!.nickname, parkingLot.users!!.email)
                )
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

    @DeleteMapping("/parking-list-report/empty-all")
    fun emptyAllParkingReportsAfterMidnight(@CookieValue("jwt") jwt: String?): ResponseEntity<Any> {
        try {
            // Check if the current time is after midnight (00:00)
            val now = LocalDateTime.now()
            val midnight = LocalDate.now().atStartOfDay()

            if (now.isBefore(midnight)) {
                // If the current time is before midnight, return a message
                return ResponseEntity.badRequest().body(Message("It's not yet midnight. Cannot delete parking reports."))
            } else {
                // Get a list of all parking reports
                val parkingReports = parkingReportsService.findAll() // Assuming you have a service for parking reports

                // Iterate through the parking reports and delete them
                for (report in parkingReports) {
                    report.id?.let { parkingReportsService.deleteParkingReport(it) } // Assuming you have a service method to delete parking reports
                }

                // Return a success message
                return ResponseEntity.ok(Message("All parking reports have been deleted after midnight."))
            }
        } catch (e: DataAccessException) {
            return ResponseEntity.status(400).body(Message("Bad request"))
        }
    }

}