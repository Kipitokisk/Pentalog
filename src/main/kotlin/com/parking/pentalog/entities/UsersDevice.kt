package com.parking.pentalog.entities

import jakarta.persistence.*

@Entity
@Table(name = "users_device")
class UsersDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usersdeviceid")
    var id = 0
    @Column(name = "devicetoken")
    var deviceToken = ""
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usersid", nullable = false)
    var users: Users? = null
}