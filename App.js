import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function App() {
  const [scanning, setScanning] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    readData().then((data) => setUsers(data));
    BarCodeScanner.requestPermissionsAsync().then((status) =>
      console.log("Permission granted")
    );
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    storeData(data).then(() => console.log("Data stored"));
  };

  const storeData = async (data) => {
    try {
      const arr = readData();
      arr.push(data);
      const jsonValue = JSON.stringify(arr);
      await AsyncStorage.setItem("@store", jsonValue);
    } catch (err) {
      console.log(err);
    }
  };

  const readData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@store");
      return jsonValue !== null ? JSON.parse(jsonValue) : [];
    } catch (err) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 25,
            fontWeight: "bold",
          }}
        >
          Code Scanner
        </Text>
      </View>
      {!scanning && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            onPress={() => setScanning(true)}
            activeOpacity={0.8}
            style={styles.button}
          >
            <View style={{ position: "absolute" }}></View>
            <Text style={{ color: "white", fontSize: 30 }}>+</Text>
          </TouchableOpacity>
        </View>
      )}
      {scanning && (
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanning ? handleBarCodeScanned : undefined}
        />
      )}
      {users && (
        <ScrollView>
          {users.map((user, index) => (
            <View
              key={index}
              style={{
                padding: 15,
                margin: 10,
                borderRadius: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#CFD3DC",
              }}
            >
              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {user.fullName}
                </Text>
                <Text style={{ fontSize: 18 }}>{user.email}</Text>
              </View>
              <Text style={{ fontSize: 18 }}>{user.phoneNumber}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#3D75E8",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    alignSelf: "center",
    marginBottom: 10,
  },
  bottomBar: {
    height: "10%",
    width: "100%",
    zIndex: 2,
    backgroundColor: "white",
    position: "absolute",
    justifyContent: "center",
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowColor: "#000000",
    elevation: 4,
  },
  header: {
    height: "8%",
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 9,
  },
});
