import org.mindrot.jbcrypt.BCrypt

class User(
    private val nickname: String,
    private val email: String,
    private val hashedPassword: String,
    private val id: String
) {
    fun getNickname(): String {
        return nickname
    }

    fun getEmail(): String {
        return email
    }

    fun getId(): String {
        return id
    }

    fun checkPassword(plainPassword: String): Boolean {
        return BCrypt.checkpw(plainPassword, hashedPassword)
    }

    companion object {
        fun createUser(nickname: String, email: String, plainPassword: String, id: String): User {
            val hashedPassword = BCrypt.hashpw(plainPassword, BCrypt.gensalt())
            return User(nickname, email, hashedPassword, id)
        }
    }
}
