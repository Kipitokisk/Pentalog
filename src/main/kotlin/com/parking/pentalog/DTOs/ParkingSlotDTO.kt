package com.parking.pentalog.DTOs

import java.util.*

class ParkingSlotDTO(
    val id: Int,
    val isOccupied: Boolean,
    val parkingTime: Date?,
    val users: UsersDTO?
    )