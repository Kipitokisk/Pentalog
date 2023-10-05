package com.parking.pentalog.entities

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Entity
@Table(name = "users")
class Users{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usersid")
    var id = 0
    @Column(name ="Nickname")
    var nickname =""
    @Column(name ="Email", unique = true)
    var email =""
    @Column(name ="Pass")
    var password = ""
        @JsonIgnore
        get() = field
        set(value) {
            val passwordEncoder = BCryptPasswordEncoder()
            field = passwordEncoder.encode(value)
        }
    @OneToOne(mappedBy = "users")
    var parkingSlots: ParkingSlots? = null
    fun comparePasswords(password: String): Boolean{
        return BCryptPasswordEncoder().matches(password, this.password)
    }
}