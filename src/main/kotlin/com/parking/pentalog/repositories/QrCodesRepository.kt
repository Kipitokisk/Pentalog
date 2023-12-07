package com.parking.pentalog.repositories

import com.parking.pentalog.entities.QrCodes
import org.springframework.data.jpa.repository.JpaRepository

interface QrCodesRepository : JpaRepository<QrCodes, Int> {
}