package com.parking.pentalog.services

import com.parking.pentalog.repositories.UserDeviceRepository
import org.springframework.stereotype.Service

@Service
class UserDeviceService(private val userDeviceRepository: UserDeviceRepository) {
}