
import java.sql.Connection
import java.sql.DriverManager
import java.sql.ResultSet
import java.sql.SQLException


fun main(args: Array<String>) {
    val url = "jdbc:mysql://localhost:3306/ParkingDB?user=root&password=dotdot123"
    var connection : Connection? = null
    try{
        connection = DriverManager.getConnection(url)

        val query = "SELECT * FROM Users"
        val statement = connection?.createStatement()
        val resultSet: ResultSet? = statement?.executeQuery(query)

        while (resultSet?.next() == true) {
            val Nickname = resultSet.getString("Nickname")
            println("Column Name: $Nickname")}
    }catch(e: SQLException){
        e.printStackTrace()
    }finally{
        connection?.close()
    }
}