import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { deleteOrder, loadHistory, Order } from "../../src/storage/storage";

export default function Historique() {
  const [history, setHistory] = useState<Order[]>([]);

  // Always load from storage
  async function refresh() {
    const data = await loadHistory();
    setHistory(data.reverse()); // newest first
  }

  // Load once on mount
  useEffect(() => {
    refresh();
  }, []);

  // Reload every time screen becomes active
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  return (
    <ScrollView style={{ padding: 20, backgroundColor: "#f5f5f5" }}>
      {history.length === 0 && (
        <Text
          style={{
            marginTop: 40,
            textAlign: "center",
            color: "#888",
            fontSize: 18,
          }}
        >
          Aucune commande pour le moment.
        </Text>
      )}

      {history.map(order => (
        <View
          key={order.id}
          style={{
            backgroundColor: "#fff",
            padding: 18,
            borderRadius: 12,
            marginBottom: 20,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            Commande #{order.id}
          </Text>
          <Text style={{ color: "#777", marginBottom: 10 }}>
            {order.date}
          </Text>

          {order.items.map(i => (
            <Text
              key={`${order.id}-${i.id}`} // FIXED key collision
              style={{ fontSize: 16 }}
            >
              • {i.name} × {i.qty} ({i.price * i.qty} dt)
            </Text>
          ))}

          <Text
            style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: "700",
              color: "green",
            }}
          >
            Total: {order.total} dt
          </Text>

          <View style={{ flexDirection: "row", marginTop: 12, gap: 10 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "red",
                padding: 12,
                borderRadius: 8,
              }}
              onPress={async () => {
                await deleteOrder(order.id);
                refresh(); // immediate refresh
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Supprimer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "orange",
                padding: 12,
                borderRadius: 8,
              }}
              onPress={() => alert("Modifier bientôt disponible")}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Modifier
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
