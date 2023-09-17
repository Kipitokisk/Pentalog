fun main(args: Array<String>) {
    val user = User.createUser("Dimon", "victor.reven@gmail.com", "KOTLIN", "30")

    println("User Nickname: ${user.getNickname()}")
    println("User Email: ${user.getEmail()}")
    println("User ID: ${user.getId()}")

    // Check if a provided password is correct
    val userInputPassword = "KOTLIN" // This is the password entered by the user
    val isPasswordCorrect = user.checkPassword(userInputPassword)

    if (isPasswordCorrect) {
        println("Password is correct")
    } else {
        println("Password is incorrect")
    }
}