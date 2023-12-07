package com.parking.pentalog.services

import com.parking.pentalog.DTOs.Message
import com.parking.pentalog.entities.Users
import com.parking.pentalog.repositories.UsersRepository
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

@Service
class UserService(private val usersRepository: UsersRepository) {
    fun saveUser(user: Users): Users = this.usersRepository.save(user)
    fun findByEmail(email: String): Users? = this.usersRepository.findByEmail(email)
    fun getById(id: Int): Users = this.usersRepository.getById(id)
    fun getCurrentUser(request: HttpServletRequest): Users{
        val jwtCookie = request.cookies?.find {it.name == "jwt"}

        if (jwtCookie == null || jwtCookie.value.isBlank()) {
            throw RuntimeException("User token not found")
        }

        val jwt = jwtCookie.value
        val claims: Claims = Jwts.parser().
        setSigningKey("vadim").
        parseClaimsJws(jwt).body
        val usersId = claims.issuer.toInt()

        return usersRepository.findById(usersId).orElseThrow {RuntimeException("User with ID $usersId not found")}
    }
}