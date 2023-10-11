package com.parking.pentalog.controller

import com.parking.pentalog.entities.ParkingSlots
import com.parking.pentalog.repositories.ParkingSlotsRepository
import org.apache.coyote.Response
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class ParkingSlotsController(private val parkingSlotsRepository: ParkingSlotsRepository) {
    @GetMapping("/parking-list")
    fun parking_list(): ResponseEntity<Any> = ResponseEntity.ok(parkingSlotsRepository.findAll())
}