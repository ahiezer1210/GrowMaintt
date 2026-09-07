import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getDeviceId() {
  let deviceId = await AsyncStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId =
      "device_" +
      Date.now().toString() +
      "_" +
      Math.random().toString(36).substring(2, 10);

    await AsyncStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}
