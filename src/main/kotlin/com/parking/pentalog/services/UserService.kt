package com.parking.pentalog.services

import com.parking.pentalog.entities.Users
import com.parking.pentalog.repositories.UsersRepository
import org.springframework.stereotype.Service

@Service
class UserService(private val usersRepository: UsersRepository) {
    fun saveUser(user: Users): Users = this.usersRepository.save(user)
    fun findByEmail(email: String): Users? = this.usersRepository.findByEmail(email)
    fun getById(id: Int): Users = this.usersRepository.getById(id)
}