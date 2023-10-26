import React, { Component } from "react";
import { ScrollView } from "react-native";
import TableComponent from "./SecondTable.js"; // Import the TableComponent from Table.js

export default class App extends Component {
  render() {
    return (
      <ScrollView vertical={true} contentContainerStyle={{ paddingTop: 40 }}>
        <TableComponent />
      </ScrollView>
    );
  }
}
