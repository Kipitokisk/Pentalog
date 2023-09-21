
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.jackson.*
import io.ktor.response.*
import io.ktor.routing.*
import kotlinx.serialization.Serializable

@Serializable
data class User(
    private val nickname: String,
    private val email: String,
    private val hashedPassword: String,
    private val id: String
) {
    fun Application.module() {
        install(ContentNegotiation) {
            jackson { }
        }
        install(StatusPages) {
            exception<Throwable> { cause ->
                call.respond(HttpStatusCode.InternalServerError, cause.localizedMessage)
            }
        }
        routing {
            route("/api/User") {
            }
        }
    }
}