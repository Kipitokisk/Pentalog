import React, { Component } from "react";
import { Alert } from "react-native";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  requestUserPermission,
  NotificationListener,
} from "./node_modules/react-native-push-notification/src/main/utils/pushnotification_helper";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
const App = () => {
  useEffect(() => {
    requestUserPermission();
    NotificationListener();
  }, []);
};
const saveUserId = async (userId) => {
  try {
    await AsyncStorage.setItem("userId", userId);
    console.log("User ID saved successfully.");
  } catch (error) {
    console.error("Error saving user ID: ", error);
  }
};

// Function to load the user's id_value
const loadUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (userId !== null) {
      console.log("User ID loaded successfully: ", userId);
      return userId;
    } else {
      console.log("User ID not found in storage.");
      return null;
    }
  } catch (error) {
    console.error("Error loading user ID: ", error);
    return null;
  }
};
export default class ExampleFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ["Place_nr", "Status_color", "General"],
      tableData: [
        ["1", "Free", false],
        ["2", "Free", false],
        ["3", "Free", false],
        ["4", "Free", false],
        ["5", "Free", false],
        ["6", "Free", false],
        ["7", "Free", false],
        ["8", "Free", false],
        ["9", "Free", false],
        ["10", "Free", false],
        ["11", "Free", false],
        ["12", "Free", false],
        ["13", "Free", false],
        ["14", "Free", false],
        ["15", "Free", false],
        ["16", "Free", false],
        ["17", "Free", false],
        ["18", "Free", false],
        ["19", "Free", false],
        ["20", "Free", false],
        ["21", "Free", false],
        ["22", "Free", false],
        ["23", "Free", false],
        ["24", "Free", false],
        ["25", "Free", false],
        ["26", "Free", false],
        ["27", "Free", false],
        ["16", "Free", false],
        ["17", "Free", false],
        ["18", "Free", false],
        ["19", "Free", false],
        ["20", "Free", false],
        ["21", "Free", false],
        ["22", "Free", false],
        ["23", "Free", false],
        ["24", "Free", false],
        ["25", "Free", false],
        ["26", "Free", false],
        ["27", "Free", false],
        ["28", "Free", false],
        ["29", "Free", false],
        ["30", "Free", false],
      ],
      anyButtonPressed: false,
      errorMessage: "", // New state variable for error message
    };
  }

  _toggleStatus(index) {
    const { tableData } = this.state;
    const currentStatus = tableData[index][1];

    if (currentStatus === "Free") {
      const anyGreenPressed = tableData.some((row) => row[1] === "Occupied");

      if (anyGreenPressed) {
        // If any green button has been pressed, show an error message
        this.setState({
          errorMessage: "Error: You can't press other green buttons.",
        });
      } else {
        // Set the status to "Occupied" and clear the error message
        tableData[index][1] = "Occupied";
        this.setState({ tableData, errorMessage: "" });

        // Sort the rows so that "Occupied" rows are at the top
        tableData.sort((a, b) => {
          if (a[1] === "Occupied") return -1;
          if (b[1] === "Occupied") return 1;
          return 0;
        });
      }
    } else if (currentStatus === "Occupied") {
      // Show a confirmation message when the yellow button is pressed
      Alert.alert("Confirmation", "Are you sure you want to leave?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            // Change the status back to "Free" when the user confirms
            tableData[index][1] = "Free";
            this.setState({ tableData });
          },
        },
      ]);
    }
  }
  _toggleColor(index) {
    const { tableData } = this.state;
    tableData[index][2] = !tableData[index][2]; // Toggle the boolean flag

    // Find the index of the first row with a yellow ("Occupied") button
    const yellowButtonIndex = tableData.findIndex(
      (row) => row[1] === "Occupied"
    );

    // Move the first yellow ("Occupied") button row to the top
    if (yellowButtonIndex !== -1) {
      const movedYellowRow = tableData.splice(yellowButtonIndex, 1);
      tableData.unshift(movedYellowRow[0]);
    }

    // If the "Report" button is pressed and it becomes purple (active), move the row below the yellow button
    if (tableData[index][2]) {
      const movedRow = tableData.splice(index, 1);
      tableData.splice(1, 0, movedRow[0]);
    }

    this.setState({ tableData });
  }
  render() {
    const state = this.state;

    return (
      <ScrollView vertical={true} contentContainerStyle={{ paddingTop: 40 }}>
        {state.errorMessage ? (
          <Text style={styles.errorMessage}>{state.errorMessage}</Text>
        ) : null}

        <Table borderStyle={{ borderColor: "transparent" }}>
          <Row
            data={state.tableHead}
            style={styles.head}
            textStyle={[styles.text, { fontWeight: "bold" }]}
          />
          {state.tableData.map((rowData, index) => (
            <TableWrapper
              key={index}
              style={[
                styles.row,
                { borderColor: "#E7E7E7", borderBottomWidth: 1 },
              ]}
            >
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={
                    cellIndex === 0 ? (
                      <View
                        style={[
                          styles.placeNrCell,
                          { backgroundColor: "lightgray" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.btnText,
                            { color: "black", fontWeight: "bold" },
                          ]}
                        >
                          {cellData}
                        </Text>
                      </View>
                    ) : cellIndex === 1 ? (
                      <TouchableOpacity
                        onPress={() => this._toggleStatus(index)}
                        style={[
                          styles.statusCell,
                          {
                            backgroundColor:
                              cellData === "Free" ? "green" : "#FFD700",
                          },
                        ]}
                      >
                        <Text style={[styles.btnText, { fontWeight: "bold" }]}>
                          {cellData}
                        </Text>
                      </TouchableOpacity>
                    ) : cellIndex === 2 ? (
                      <TouchableOpacity
                        onPress={() => this._toggleColor(index)}
                        style={[
                          styles.generalCell,
                          {
                            backgroundColor: rowData[2]
                              ? "purple"
                              : "lightgray",
                          },
                        ]}
                        disabled={rowData[1] === "Occupied"}
                      >
                        <Text style={[styles.btnText, { fontWeight: "bold" }]}>
                          Report
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.generalCell}>
                        <Text style={[styles.btnText, { fontWeight: "bold" }]}>
                          {cellData}
                        </Text>
                      </View>
                    )
                  }
                  textStyle={[styles.text, { fontWeight: "bold" }]}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  head: {
    height: 60,
    backgroundColor: "#808B97",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    margin: 6,
    textAlign: "center",
  },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  placeNrCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
    padding: 10,
  },
  statusCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  generalCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "lightgray",
  },
  btnText: { textAlign: "center", color: "#fff" },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
