import {
  FlatList,
  StyleSheet,
  Text,
  Modal,
  View,
  TouchableHighlight,
} from "react-native";
import { CalendarCell } from "./CalendarCell";
import { useState } from "react";

const createDayRange = (days) => {
  const dayRange = [];
  for (let i = 1; i <= days; i++) {
    dayRange.push(i);
  }
  return dayRange;
};

export const Month = (props) => {
  const days = createDayRange(props.days);

  const cellRender = ({ item }) => {
    return (
      <View>
        <CalendarCell
          year={props.year}
          day={item}
          month={props.month}
          monthKey={props.monthKey}
          stickerList={props.stickerList}
          db={props.db}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.month}>{props.month}</Text>
      <View style={styles.cellContainer}>
        <FlatList renderItem={cellRender} data={days} numColumns={7} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "auto",
    width: 340,
    backgroundColor: "rgba(100,100,100,0.5)",
    margin: 10,
    //shadow
    shadowColor: "#000",

    elevation: 0,
  },
  cellContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  month: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "white",
  },
  modal: {
    width: 150,
    height: 150,
    flex: 1,
    backgroundColor: "rgba(50,50,50,0.9)",
  },
});
