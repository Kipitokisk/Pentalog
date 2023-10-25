import com.parking.pentalog.DTOs.ParkingSlotDTO
import com.parking.pentalog.entities.ParkingSlots
import java.util.*

data class ReportDTO(
    val id: Int?,  // Report ID
    val reportTime: Date?,  // Report time
    val isPending: Boolean,  // Is pending
    val parkingLot: ParkingSlotDTO? // Parking lot ID
)
