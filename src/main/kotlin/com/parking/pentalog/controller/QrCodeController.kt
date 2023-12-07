package com.parking.pentalog.controller

import com.parking.pentalog.DTOs.Message
import com.parking.pentalog.entities.QrCodes
import com.parking.pentalog.services.QrCodesService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class QrCodeController(private val qrCodesService: QrCodesService) {

    @PostMapping("/generate-qr")
    fun generateAndSaveQrCode(): ResponseEntity<Any> = ResponseEntity.ok(qrCodesService.generateAndSaveQrCode())

    @GetMapping("/qr-code/{id}")
    fun getQrCode(@PathVariable id: Int): ResponseEntity<QrCodes> = ResponseEntity.ok(qrCodesService.getById(id))
}