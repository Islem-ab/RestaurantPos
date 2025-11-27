import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useEffect } from "react";           // ✅ Added
import Toast from "react-native-toast-message";  // ✅ Added

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    Toast.show({
      type: "success",
      text1: "Toast test réussi 🎉"
    });
  }, []); // 🔥 Runs once when Home loads

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 30 }}>
      
      <TouchableOpacity
        style={{
          backgroundColor: "#3498db",
          padding: 20,
          width: 200,
          borderRadius: 10,
        }}
        onPress={() => router.push("/(tabs)/vente")}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>Vente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#2ecc71",
          padding: 20,
          width: 200,
          borderRadius: 10,
        }}
        onPress={() => router.push("/(tabs)/historique")}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
          Historique
        </Text>
      </TouchableOpacity>

    </View>
  );
}
