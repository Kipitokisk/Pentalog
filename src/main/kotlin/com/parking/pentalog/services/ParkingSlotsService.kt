package com.parking.pentalog.services

import com.parking.pentalog.entities.ParkingReports
import com.parking.pentalog.entities.ParkingSlots
import com.parking.pentalog.repositories.ParkingSlotsRepository
import jakarta.servlet.http.HttpServletRequest
import org.springframework.stereotype.Service

@Service
class ParkingSlotsService(private val parkingSlotsRepository: ParkingSlotsRepository,
                          private val userService: UserService) {
    fun getById(id: Int): ParkingSlots = this.parkingSlotsRepository.getById(id)
    fun findAll(): List<ParkingSlots> = this.parkingSlotsRepository.findAll()
    fun existsByParkingSlotsId(parkingSlotsID: Int): Boolean = parkingSlotsRepository.existsById(parkingSlotsID)
    fun saveParkingLot(parkingSlots: ParkingSlots): ParkingSlots = this.parkingSlotsRepository.save(parkingSlots)
    fun findFreeParkingSlot(): ParkingSlots?{
        val freeParkingSlots = parkingSlotsRepository.findByIsOccupiedFalse()
        return freeParkingSlots.firstOrNull()
    }
    fun occupyParkingSlot(request: HttpServletRequest): ParkingSlots{

        val freeParkingSlot = findFreeParkingSlot()?: throw RuntimeException("No available Slots")
        val currentUser = userService.getCurrentUser(request)

        freeParkingSlot.occupySlot(currentUser)

        return parkingSlotsRepository.save(freeParkingSlot)
    }
    fun freeParkingSlot(request: HttpServletRequest): ParkingSlots?{
        val currentUser = userService.getCurrentUser(request)
        val occupiedParkingSlot = parkingSlotsRepository.findByUsersIdAndIsOccupiedTrue(currentUser.id)
        return if( occupiedParkingSlot != null){
            occupiedParkingSlot.isOccupied = false
            occupiedParkingSlot.parkingTime = null
            occupiedParkingSlot.users = null

            parkingSlotsRepository.save(occupiedParkingSlot)
        } else {
            null
        }
    }
    fun isUserOccupyingParkingSlot(request: HttpServletRequest): Boolean{
        val currentUser = userService.getCurrentUser(request)
        val occupiedParkingSlot = parkingSlotsRepository.findByUsersIdAndIsOccupiedTrue(currentUser.id)
        return occupiedParkingSlot != null
    }
    fun getUserOccupyingParkingSlot(request: HttpServletRequest): Int? {
        val currentUser = userService.getCurrentUser(request)
        val occupiedParkingSlot = parkingSlotsRepository.findByUsersIdAndIsOccupiedTrue(currentUser.id)
        return occupiedParkingSlot?.id
    }
}