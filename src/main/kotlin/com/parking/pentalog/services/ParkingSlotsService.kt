package com.parking.pentalog.services

import com.parking.pentalog.entities.ParkingSlots
import com.parking.pentalog.repositories.ParkingSlotsRepository
import org.springframework.stereotype.Service

@Service
class ParkingSlotsService(private val parkingSlotsRepository: ParkingSlotsRepository) {
    fun getById(id: Int): ParkingSlots = this.parkingSlotsRepository.getById(id)
    fun findAll(): List<ParkingSlots> = this.parkingSlotsRepository.findAll()
    fun existsByParkingSlotsId(parkingSlotsID: Int): Boolean = parkingSlotsRepository.existsById(parkingSlotsID)
    fun saveParkingLot(parkingSlots: ParkingSlots): ParkingSlots = this.parkingSlotsRepository.save(parkingSlots)
}