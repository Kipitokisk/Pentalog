package com.parking.pentalog.repositories

import com.parking.pentalog.entities.UsersDevice
import org.springframework.data.jpa.repository.JpaRepository

interface UserDeviceRepository : JpaRepository<UsersDevice, Int> {
}