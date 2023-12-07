package com.parking.pentalog.entities

import jakarta.persistence.*
import java.util.Date

@Entity
@Table(name = "qr_codes")
class QrCodes() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qrcodesid")
    var id = 0

    @Lob
    @Column(name = "qrcodeimage", columnDefinition = "LONGBLOB")
    var qrcodeImage : ByteArray? = null

    @Column(name = "createdat", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    var createdAt: Date = Date()
}