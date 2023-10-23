package com.parking.pentalog.controller

import com.parking.pentalog.DTOs.Message
import com.parking.pentalog.entities.ParkingSlots
import com.parking.pentalog.entities.Users
import com.parking.pentalog.services.ParkingSlotsService
import com.parking.pentalog.services.UserService
import org.springframework.dao.DataAccessException
import org.springframework.http.ResponseEntity
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*
import io.jsonwebtoken.Jwts
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api")
class ParkingSlotsController (private val parkingSlotsService : ParkingSlotsService, private val userService: UserService) {
    @GetMapping("/parking-list")
    fun parkingList() : ResponseEntity<Any> = ResponseEntity.ok(parkingSlotsService.findAll())

    @PutMapping("/parking-list/{parkingSlotId}/occupy")
    fun occupyParkingSlot(@PathVariable parkingSlotId: Int, @CookieValue("jwt") jwt: String?): ResponseEntity<Any> {
        return try {
        if (!parkingSlotsService.existsByParkingSlotsId(parkingSlotId)) {
           return ResponseEntity.badRequest().body(Message("Parking Slot Not found"))
        } else {
            val parkingSlot = parkingSlotsService.getById(parkingSlotId)
            if (parkingSlot.isOccupied == true) {
                return ResponseEntity.badRequest().body(Message("Parking Slot Already Occupied"))
            }
            parkingSlot.isOccupied = true
            parkingSlot.parkingTime = Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant())
            val body = Jwts.parser()
                    .setSigningKey("vadim")
                    .parseClaimsJws(jwt)
                    .body
            parkingSlot.users = this.userService.getById(body.issuer.toInt())
            return ResponseEntity.ok(this.parkingSlotsService.saveParkingLot(parkingSlot))
        }
    } catch (e: DataAccessException) {
        return ResponseEntity.status(400).body(Message("Bad request"))
    }
    }

    @PutMapping("/parking-list/{parkingSlotId}/free")
    fun freeParkingSlot(@PathVariable parkingSlotId: Int, @CookieValue("jwt") jwt: String?): ResponseEntity<Any> {
        return try {
            if (!parkingSlotsService.existsByParkingSlotsId(parkingSlotId)) {
                return ResponseEntity.badRequest().body(Message("Parking Slot Not found"))
            } else {
                val parkingSlot = parkingSlotsService.getById(parkingSlotId)
                if (parkingSlot.isOccupied == false) {
                    return ResponseEntity.badRequest().body(Message("Parking Slot Already Free"))
                }
                val body = Jwts.parser()
                    .setSigningKey("vadim")
                    .parseClaimsJws(jwt)
                    .body
                val currentUserId = body.issuer.toInt()
                if (parkingSlot.users?.id != currentUserId) {
                    return ResponseEntity.badRequest().body(Message("Cannot free the parking slot, as you are not the occupant"))
                }
                parkingSlot.isOccupied = false
                parkingSlot.parkingTime = null
                parkingSlot.users = null;
                return ResponseEntity.ok(this.parkingSlotsService.saveParkingLot(parkingSlot))
            }
        } catch (e: DataAccessException) {
            return ResponseEntity.status(400).body(Message("Bad request"))
        }
    }

    @PutMapping("/parking-list/empty-all")
    fun emptyAllParkingSlotsAfterMidnight(@CookieValue("jwt") jwt: String?): ResponseEntity<Any> {
        try {
            // Check if the current time is after midnight (00:00)
            val now = LocalDateTime.now()
            val midnight = LocalDate.now().atStartOfDay()

            if (now.isBefore(midnight)) {
                // If the current time is before midnight, return a message
                return ResponseEntity.badRequest().body(Message("It's not yet midnight. Cannot empty parking slots."))
            } else {
                // Get a list of all occupied parking slots
                val occupiedSlots = parkingSlotsService.findAll()

                // Iterate through the occupied parking slots and free them
                for (parkingSlot in occupiedSlots) {
                    parkingSlot.isOccupied = false
                    parkingSlot.parkingTime = null
                    parkingSlot.users = null
                    parkingSlotsService.saveParkingLot(parkingSlot)
                }

                // Return a success message
                return ResponseEntity.ok(Message("All parking slots have been emptied after midnight."))
            }
        } catch (e: DataAccessException) {
            return ResponseEntity.status(400).body(Message("Bad request"))
        }
    }
}