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
    @Column(name ="nickname")
    var nickname =""
    @Column(name ="email", unique = true)
    var email =""
    @Column(name ="pass")
    var password = ""
        @JsonIgnore
        get() = field
        set(value) {
            val passwordEncoder = BCryptPasswordEncoder()
            field = passwordEncoder.encode(value)
        }
    @Column(name = "userdescription")
    var userDescription = ""
    @Column(name = "avatarimage", columnDefinition = "LONGBLOB")
    var avatarImage: ByteArray? = null
    @OneToMany(mappedBy = "users", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    private val _usersDevice : List<UsersDevice> = mutableListOf()
    val usersDevice @JsonIgnore
    get() = _usersDevice.toList()

    fun comparePasswords(password: String): Boolean{
        return BCryptPasswordEncoder().matches(password, this.password)
    }
}