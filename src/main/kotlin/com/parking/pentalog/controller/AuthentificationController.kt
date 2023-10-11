package com.parking.pentalog.controller

import com.parking.pentalog.DTOs.LoginDTO
import com.parking.pentalog.DTOs.Message
import com.parking.pentalog.DTOs.RegisterDTO
import com.parking.pentalog.entities.Users
import com.parking.pentalog.services.UserService
import io.jsonwebtoken.JwtException
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.web.bind.annotation.CookieValue
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec


@RestController
@RequestMapping("/api")
class AuthentificationController(private val userService: UserService){

    @PostMapping("/register")
    fun register(@RequestBody body: RegisterDTO): ResponseEntity<Users>{
        val user = Users()
        user.nickname= body.nickname
        user.password = body.password
        user.email = body.email
        return ResponseEntity.ok(this.userService.saveUser(user))
    }
    @PostMapping("/login")
    fun login(@RequestBody body: LoginDTO, response: HttpServletResponse): ResponseEntity<Any>{
        val user = this.userService.findByEmail(body.email)
            ?: return ResponseEntity.badRequest().body(Message("User not found"))
            if(!user.comparePasswords(body.password)){
                return ResponseEntity.badRequest().body(Message("Password Incorrect"))
            }

        val issuer = user.id.toString()

        val jwt = Jwts.builder()
            .setIssuer(issuer)
            .setExpiration(Date(System.currentTimeMillis()+ 3 * 60 * 60 * 24 * 1000))
            .signWith(SignatureAlgorithm.HS512, "vadim").compact()
        val cookie = Cookie("jwt", jwt)
        cookie.isHttpOnly = true

        response.addCookie(cookie)
        return ResponseEntity.ok(Message("success"))
    }

    @GetMapping("/user")
    fun user(@CookieValue("jwt") jwt: String?): ResponseEntity<Any> {

        if (jwt == null) {
            return ResponseEntity.status(401).body(Message("Unauthenticated"))
        } else {
            try {
                val body = Jwts.parser()
                    .setSigningKey("vadim")
                    .parseClaimsJws(jwt)
                    .body
                return ResponseEntity.ok(this.userService.getById(body.issuer.toInt()))
            } catch (e: JwtException) {
                // Handle JWT parsing or verification errors
                return ResponseEntity.status(401).body(Message("Invalid token"))
            }
        }
    }
    @GetMapping("/{userID}")
    fun getUser(@PathVariable("userID") id: Int): ResponseEntity<Users> = ResponseEntity.ok(userService.getById(id))
}