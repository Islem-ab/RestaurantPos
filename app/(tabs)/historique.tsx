import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
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
import * as Sharing from "expo-sharing";

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

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [sortMode])
  );

  // Fixed Print Function
  async function printOrder(order: Order) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              text-align: center;
              color: #333;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .info {
              margin: 20px 0;
            }
            .info p {
              margin: 5px 0;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .total {
              text-align: right;
              font-size: 20px;
              font-weight: bold;
              margin-top: 20px;
              color: green;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <h1>Reçu de Commande</h1>
          
          <div class="info">
            <p><strong>Numéro de commande:</strong> #${order.id}</p>
            <p><strong>Date:</strong> ${order.date}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Article</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.qty}</td>
                  <td>${item.price.toFixed(2)} DT</td>
                  <td>${(item.price * item.qty).toFixed(2)} DT</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="total">
            Total à payer: ${order.total.toFixed(2)} DT
          </div>

          <div class="footer">
            <p>Merci pour votre commande!</p>
            <p>Restaurant POS System</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ 
        html,
        width: 612,
        height: 792,
      });
      
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Commande #${order.id}`,
          UTI: 'com.adobe.pdf'
        });
        toastSuccess("PDF généré avec succès !");
      } else {
        toastInfo("Partage non disponible sur cet appareil");
      }
    } catch (err) {
      console.error("Print error:", err);
      toastInfo("Erreur lors de la génération du PDF");
    }
  }

  // Delete all orders
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

      {/* Sort and Delete Row */}
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

      {/* List */}
      <ScrollView style={{ padding: 20 }}>
        {history.length === 0 && (
          <Text style={styles.empty}>Aucune commande pour le moment.</Text>
        )}

        {history.map((order) => (
          <View key={order.id} style={styles.card}>
            <Text style={styles.cardTitle}>Commande #{order.id}</Text>
            <Text style={styles.cardDate}>{order.date}</Text>

            {order.items.map((i, idx) => (
              <Text key={`${order.id}-${i.id}-${idx}`} style={styles.item}>
                • {i.name} × {i.qty} ({(i.price * i.qty).toFixed(2)} DT)
              </Text>
            ))}

            <Text style={styles.total}>Total: {order.total.toFixed(2)} DT</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#e74c3c" }]}
                onPress={async () => {
                  Alert.alert(
                    "Confirmation",
                    "Supprimer cette commande ?",
                    [
                      { text: "Annuler", style: "cancel" },
                      {
                        text: "Supprimer",
                        style: "destructive",
                        onPress: async () => {
                          await deleteOrder(order.id);
                          toastSuccess("Commande supprimée");
                          refresh();
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#f39c12" }]}
                onPress={() => router.push(`/(tabs)/modifier/${order.id}`)}
              >
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#3498db" }]}
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
    backgroundColor: "#e74c3c",
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

  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#2c3e50" },
  cardDate: { color: "#7f8c8d", marginBottom: 10, fontSize: 13 },
  item: { fontSize: 15, marginVertical: 2, color: "#34495e" },
  total: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#27ae60",
  },

  row: { flexDirection: "row", marginTop: 12, gap: 10 },
  btn: { flex: 1, padding: 12, borderRadius: 8, elevation: 2 },
  btnText: { color: "white", fontWeight: "600", textAlign: "center", fontSize: 13 },
});