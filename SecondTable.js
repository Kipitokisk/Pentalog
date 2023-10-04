import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";

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
      // Keep track of whether any button has been pressed
      anyButtonPressed: false,
    };
  }

  _toggleStatus(index) {
    const { tableData } = this.state;
    const currentStatus = tableData[index][1];

    if (currentStatus === "Free") {
      // If the current status is "Free"
      tableData[index][1] = "Occupied";
      this.setState({ tableData, anyButtonPressed: true });
    }
  }

  _toggleColor(index) {
    const { tableData } = this.state;
    tableData[index][2] = !tableData[index][2]; // Toggle the boolean flag

    // If the "Report" button is pressed and it becomes yellow (active), move the row to the top
    if (tableData[index][2]) {
      const movedRow = tableData.splice(index, 1);
      tableData.unshift(movedRow[0]);
    }

    this.setState({ tableData });
  }

  render() {
    const state = this.state;

    return (
      <ScrollView vertical={true} contentContainerStyle={{ paddingTop: 40 }}>
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
                        // Disable button if any button has been pressed
                        disabled={state.anyButtonPressed}
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
                        // Disable the "Report" button if the adjacent "Status_color" button is yellow
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
});
