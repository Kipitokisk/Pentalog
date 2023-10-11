package com.parking.pentalog.controller

import com.parking.pentalog.DTOs.Message
import com.parking.pentalog.DTOs.ParkingSlotsDTO
import com.parking.pentalog.services.ParkingSlotsService
import org.springframework.dao.DataAccessException
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*

@RestController
@RequestMapping("/api")
class ParkingSlotsController (private val parkingSlotsService : ParkingSlotsService) {
    @GetMapping("/parking-list")
    fun parkingList() : ResponseEntity<Any> = ResponseEntity.ok(parkingSlotsService.findAll())

    @PutMapping("/parking-list/{parkingSlotId}/occupy")
    fun occupyParkingSlot(@PathVariable parkingSlotId: Int): ResponseEntity<Any> {
        return try {
        // Check if the parking slot with the given ID exists in the database
        if (!parkingSlotsService.existsByParkingSlotsId(parkingSlotId)) {
           return ResponseEntity.badRequest().body(Message("Parking Slot Not found"))
        } else {
            val parkingSlot = parkingSlotsService.getById(parkingSlotId)
            if (parkingSlot.isOccupied == true) {
                return ResponseEntity.badRequest().body(Message("Parking Slot Already Occupied"))
            }
            parkingSlot.isOccupied = true
            parkingSlot.parkingTime = Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant())
            return ResponseEntity.ok(this.parkingSlotsService.saveParkingLot(parkingSlot))
        }
    } catch (e: DataAccessException) {
        // Handle database-related errors
        return ResponseEntity.status(400).body(Message("Bad request"))
    }
    }

    @PutMapping("/parking-list/{parkingSlotId}/free")
    fun freeParkingSlot(@PathVariable parkingSlotId: Int): ResponseEntity<Any> {
        return try {
            // Check if the parking slot with the given ID exists in the database
            if (!parkingSlotsService.existsByParkingSlotsId(parkingSlotId)) {
                return ResponseEntity.badRequest().body(Message("Parking Slot Not found"))
            } else {
                val parkingSlot = parkingSlotsService.getById(parkingSlotId)
                if (parkingSlot.isOccupied == false) {
                    return ResponseEntity.badRequest().body(Message("Parking Slot Already Free"))
                }
                parkingSlot.isOccupied = false
                parkingSlot.parkingTime = null
                return ResponseEntity.ok(this.parkingSlotsService.saveParkingLot(parkingSlot))
            }
        } catch (e: DataAccessException) {
            // Handle database-related errors
            return ResponseEntity.status(400).body(Message("Bad request"))
        }
    }
}