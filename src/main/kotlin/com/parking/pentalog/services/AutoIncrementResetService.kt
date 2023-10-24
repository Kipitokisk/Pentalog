package com.parking.pentalog.services

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class AutoIncrementResetService(private val jdbcTemplate: JdbcTemplate) {
    fun resetAutoIncrementIfEmpty(tableName: String) {
        val rowCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM $tableName", Int::class.java)

        if (rowCount == 0) {
            resetAutoIncrement(tableName)
        }
    }

    private fun resetAutoIncrement(tableName: String) {
        val sql = "ALTER TABLE $tableName AUTO_INCREMENT = 1"
        jdbcTemplate.execute(sql)
    }
}