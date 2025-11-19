import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export default function GPSBienvenida() {
  useEffect(() => {
    (async () => {
      // pedir permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permiso de ubicación denegado");
        return;
      }

      // pedir permisos de notificaciones
      const { status: notifStatus } = await Notifications.requestPermissionsAsync();
      if (notifStatus !== "granted") {
        console.log("Permiso de notificaciones denegado");
        return;
      }

      // obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const userCoord = { lat: latitude, lon: longitude };


      // coordenadas de lugar OBJETIVO específico, la facu es (lat: -35.66801675625351, lon: -63.770988029094156)
      const targetLat = -35.66801675625351; 
      const targetLon = -63.770988029094156;
      
      // calcular distancia aproximada, entre tu ubicacion y el lugar objetivo
      const targetCoord = { lat: targetLat, lon: targetLon };
      const distance = getDistanceFromLatLonInKm(userCoord, targetCoord);
      
      if (distance < 0.2) { // menos de 200 metros
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "¡Bienvenido!",
            body: "Estás en el Museo de Ciencias Naturales 🎉",
          },
          trigger: null, // inmediato
        });
      }
    })();
  }, []);
}

// función auxiliar para calcular distancia entre dos coordenadas
function getDistanceFromLatLonInKm(coord1, coord2) {
  const R = 6371;
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLon = deg2rad(coord2.lon - coord1.lon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.lat)) *
      Math.cos(deg2rad(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
// convierte grados a radianes para calcular usando la formula Haversine
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
