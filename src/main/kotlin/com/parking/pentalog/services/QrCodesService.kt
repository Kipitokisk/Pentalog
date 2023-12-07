package com.parking.pentalog.services

import com.parking.pentalog.entities.QrCodes
import com.parking.pentalog.repositories.QrCodesRepository
import net.glxn.qrgen.QRCode
import net.glxn.qrgen.image.ImageType
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*

@Service
class QrCodesService(private val qrCodesRepository: QrCodesRepository) {
    private val localDirectory = "C:\\Pentalog\\Pentalog\\src\\main\\kotlin\\com\\parking\\pentalog\\qrcodes"
    private fun generateQrCode(): ByteArray{
        val qrCode = QRCode.from("Default content").withSize(250, 250).to(ImageType.PNG)
        val outputStream = ByteArrayOutputStream()
        qrCode.writeTo(outputStream)
        return outputStream.toByteArray()
    }

    fun generateAndSaveQrCode(){

        val qrCodeImage = generateQrCode()
        val qrCodes = QrCodes()
        qrCodes.qrcodeImage = qrCodeImage
        qrCodesRepository.save(qrCodes)

        val fileName = "${UUID.randomUUID()}.png"
        val filePath = Paths.get(localDirectory, fileName)
        Files.write(filePath, qrCodeImage)
    }

    fun getById(id: Int): QrCodes? = qrCodesRepository.findById(id).orElse(null)
}