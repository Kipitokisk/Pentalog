package com.parking.pentalog.repositories

import com.parking.pentalog.entities.Users
import org.springframework.data.jpa.repository.JpaRepository

interface UsersRepository: JpaRepository<Users, Int> {
    fun findByEmail(email: String): Users?
}