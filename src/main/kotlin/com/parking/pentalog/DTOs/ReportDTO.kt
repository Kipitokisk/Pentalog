import java.util.*

data class ReportDTO(
    val id: Int?,  // Report ID
    val reportTime: Date?,  // Report time
    val isPending: Boolean,  // Is pending
    val parkingLotId: Int, // Parking lot ID
    val userId: Int?
)
