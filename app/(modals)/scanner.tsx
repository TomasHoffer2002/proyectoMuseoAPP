import { Camera, CameraView } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const timeoutRef = useRef<number  | null>(null);
  const router = useRouter();
  const hasScannedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      hasScannedRef.current = false;
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [])
  );
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
  if (hasScannedRef.current) return; // bloquea múltiples disparos
  hasScannedRef.current = true;

  console.log("QR detectado:", type, data);
  router.push({ pathname: "/item/[id]", params: { id: "1" } });
};

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se puede acceder a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.focusBox} />
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  middleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  focusBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#00FF00",
    backgroundColor: "transparent",
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});