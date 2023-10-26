import React, { Component } from "react";
import { ScrollView } from "react-native";
import TableComponent from "./SecondTable.js"; // Import the TableComponent from Table.js
import {
  requestUserPermission,
  NotificationListener,
} from "./node_modules/react-native-push-notification/src/main/utils/pushnotification_helper";
const App = () => {
  useEffect(() => {
    requestUserPermission();
    NotificationListener();
  }, []);
};
export default class App extends Component {
  render() {
    return (
      <ScrollView vertical={true} contentContainerStyle={{ paddingTop: 40 }}>
        <TableComponent />
      </ScrollView>
    );
  }
}
