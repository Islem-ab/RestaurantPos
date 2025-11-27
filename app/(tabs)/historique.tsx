import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  deleteOrder,
  loadHistory,
  Order
} from "../../src/storage/storage";

import { toastInfo, toastSuccess } from "../../src/utils/toast";

import * as Print from "expo-print";
import * as WebBrowser from "expo-web-browser";

export default function Historique() {
  const router = useRouter();
  const [history, setHistory] = useState<Order[]>([]);
  const [sortMode, setSortMode] = useState<"desc" | "asc">("desc");

  async function refresh() {
    let data = await loadHistory();

    if (sortMode === "desc") {
      data = [...data].sort((a, b) => b.id - a.id);
    } else {
      data = [...data].sort((a, b) => a.id - b.id);
    }

    setHistory(data);
  }

  useEffect(() => {
    refresh();
  }, [sortMode]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [sortMode])
  );

  // ----------------------------------------------------
  // PRINT ORDER -> PDF
  // ----------------------------------------------------
  async function printOrder(order: Order) {
    const html = `
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h1 style="text-align:center;">Reçu</h1>
          <h3>Commande #${order.id}</h3>
          <p>Date : ${order.date}</p>
          <ul>
            ${order.items
              .map(
                (i) =>
                  `<li>${i.name} × ${i.qty} — ${i.price * i.qty} dt</li>`
              )
              .join("")}
          </ul>
          <h2>Total : ${order.total} dt</h2>
        </body>
      </html>
    `;

    try {
      const file = await Print.printToFileAsync({ html });
      await WebBrowser.openBrowserAsync(file.uri);
      toastSuccess("PDF généré ✔");

    } catch (err) {
      console.log(err);
      toastInfo("Erreur lors de l'impression");
    }
  }

  // ----------------------------------------------------
  // DELETE ALL ORDERS
  // ----------------------------------------------------
  async function deleteAll() {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer TOUTES les commandes ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.setItem("caisseresto_history_v1", "[]");
            toastSuccess("Toutes les commandes ont été supprimées");
            refresh();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>

      {/* ---------------------------------------------------- */}
      {/* TOP SORT ROW + DELETE ALL BUTTON */}
      {/* ---------------------------------------------------- */}
      <View style={styles.sortRow}>

        <TouchableOpacity
          style={[styles.sortBtnSmall, sortMode === "desc" && styles.sortBtnActive]}
          onPress={() => setSortMode("desc")}
        >
          <Text style={sortMode === "desc" ? styles.sortTextActive : styles.sortText}>
            Plus Récent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortBtnSmall, sortMode === "asc" && styles.sortBtnActive]}
          onPress={() => setSortMode("asc")}
        >
          <Text style={sortMode === "asc" ? styles.sortTextActive : styles.sortText}>
            Plus Ancien
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteAllBtn}
          onPress={deleteAll}
        >
          <Text style={styles.deleteAllText}>Supprimer Tous</Text>
        </TouchableOpacity>

      </View>

      {/* ---------------------------------------------------- */}
      {/* LIST */}
      {/* ---------------------------------------------------- */}
      <ScrollView style={{ padding: 20 }}>
        {history.length === 0 && (
          <Text style={styles.empty}>Aucune commande pour le moment.</Text>
        )}

        {history.map((order) => (
          <View key={order.id} style={styles.card}>
            <Text style={styles.cardTitle}>Commande #{order.id}</Text>
            <Text style={styles.cardDate}>{order.date}</Text>

            {order.items.map((i) => (
              <Text key={i.id} style={styles.item}>
                • {i.name} × {i.qty} ({i.price * i.qty} dt)
              </Text>
            ))}

            <Text style={styles.total}>Total: {order.total} dt</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "red" }]}
                onPress={async () => {
                  await deleteOrder(order.id);
                  refresh();
                }}
              >
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "orange" }]}
                onPress={() => router.push(`/(tabs)/modifier/${order.id}`)}
              >
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "blue" }]}
                onPress={() => printOrder(order)}
              >
                <Text style={styles.btnText}>Imprimer</Text>
              </TouchableOpacity>
            </View>

          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  // ----------------------------------------------------
  // SORT ROW + DELETE BUTTON
  // ----------------------------------------------------
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    gap: 8,
  },

  sortBtnSmall: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
  },

  sortBtnActive: {
    backgroundColor: "#3498db",
  },

  sortText: {
    color: "#333",
    fontWeight: "600",
  },

  sortTextActive: {
    color: "white",
    fontWeight: "600",
  },

  deleteAllBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#e00000",
    borderRadius: 20,
    marginLeft: "auto",
  },

  deleteAllText: {
    color: "white",
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#888",
  },

  // ----------------------------------------------------
  // CARDS
  // ----------------------------------------------------
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardDate: { color: "#777", marginBottom: 10 },
  item: { fontSize: 16 },
  total: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "green",
  },

  row: { flexDirection: "row", marginTop: 12, gap: 10 },
  btn: { flex: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "white", fontWeight: "600", textAlign: "center" },
});
