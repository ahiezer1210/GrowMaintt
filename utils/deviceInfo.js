import * as Device from "expo-device";
import * as Location from "expo-location";

export const getRealDeviceInfo = async () => {
  let deviceName = "Unknown device";
  let locationName = "Unknown location";

  try {
    if (Device.manufacturer && Device.modelName) {
      deviceName = `${Device.manufacturer} ${Device.modelName}`;
    } else if (Device.modelName) {
      deviceName = Device.modelName;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const places = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (places.length > 0) {
        const place = places[0];

        const parts = [place.city, place.region, place.country].filter(Boolean);

        if (parts.length > 0) {
          locationName = parts.join(", ");
        }
      }
    }
  } catch (error) {
    console.log("DEVICE INFO ERROR:", error);
  }

  return {
    deviceName,
    location: locationName,
  };
};
