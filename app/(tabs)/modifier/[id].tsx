import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

import {
  loadMenus,
  loadOrderById,
  MenuItem,
  OrderItem,
  updateOrder
} from "../../../src/storage/storage";

import MenuList from "../../../src/components/MenuList";
import OrderFooter from "../../../src/components/OrderFooter";
import OrderList from "../../../src/components/OrderList";

import { toastInfo, toastSuccess } from "../../../src/utils/toast";

export default function ModifierOrder() {
  const { id } = useLocalSearchParams();
  const orderId = Number(id);
  const router = useRouter();

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // LOAD MENUS + EXACT ORDER - Fixed to load correct order
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        
        // Load menus
        const menuItems = await loadMenus();
        setMenus(menuItems);

        // Load the specific order by ID
        const existingOrder = await loadOrderById(orderId);
        
        if (!existingOrder) {
          Alert.alert("Erreur", "Commande introuvable", [
            {
              text: "OK",
              onPress: () => router.back()
            }
          ]);
          return;
        }

        // Create a deep copy to avoid reference issues
        const orderItemsCopy = existingOrder.items.map((item: OrderItem) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          category: item.category
        }));

        setOrder(orderItemsCopy);
        toastSuccess(`Commande #${orderId} chargée`);
        
      } catch (error) {
        console.error("Error loading order:", error);
        Alert.alert("Erreur", "Impossible de charger la commande");
        router.back();
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      load();
    }
  }, [orderId]);

  // ADD ITEM
  function addItem(item: MenuItem) {
    setOrder((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        toastSuccess(`${item.name} quantité augmentée`);
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      toastSuccess(`${item.name} ajouté`);
      return [...prev, { ...item, qty: 1 }];
    });
  }

  // CHANGE QUANTITY
  function changeQty(id: number, delta: number) {
    setOrder((prev) =>
      prev
        .map((p) => {
          if (p.id === id) {
            const newQty = Math.max(1, p.qty + delta);
            return { ...p, qty: newQty };
          }
          return p;
        })
        .filter((p) => p.qty > 0)
    );
  }

  // REMOVE ITEM
  function removeItem(id: number) {
    const removed = order.find(i => i.id === id);
    if (removed) {
      toastInfo(`${removed.name} retiré`);
    }
    setOrder((prev) => prev.filter((i) => i.id !== id));
  }

  // TOTAL
  const total = order.reduce((sum, i) => sum + i.price * i.qty, 0);

  // SAVE CHANGES
  async function saveChanges() {
    if (order.length === 0) {
      Alert.alert("Attention", "La commande ne peut pas être vide");
      return;
    }

    try {
      const updated = {
        id: orderId,
        date: new Date().toLocaleString("fr-TN", { 
          timeZone: "Africa/Tunis",
          dateStyle: "short",
          timeStyle: "short"
        }),
        items: order,
        total,
      };

      await updateOrder(updated);
      toastSuccess("Commande modifiée avec succès !");
      
      // Navigate back after a short delay
      setTimeout(() => {
        router.push("/(tabs)/historique");
      }, 500);
      
    } catch (error) {
      console.error("Error updating order:", error);
      toastInfo("Erreur lors de la modification");
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10, color: "#666" }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      
      <View style={{ 
        padding: 15, 
        backgroundColor: "#3498db", 
        borderBottomWidth: 2, 
        borderBottomColor: "#2980b9" 
      }}>
        <Text style={{ 
          color: "white", 
          fontSize: 18, 
          fontWeight: "bold", 
          textAlign: "center" 
        }}>
          Modifier Commande #{orderId}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        
        {/* Current Order Items */}
        <View style={{ backgroundColor: "white", padding: 10, margin: 10, borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#2c3e50" }}>
            Articles actuels:
          </Text>
          <OrderList
            order={order}
            onIncrease={(id) => changeQty(id, 1)}
            onDecrease={(id) => changeQty(id, -1)}
            onRemove={removeItem}
          />
        </View>

        {/* Menu Items to Add */}
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#2c3e50" }}>
            Ajouter des articles:
          </Text>
          <MenuList menus={menus} onSelect={addItem} />
        </View>
        
      </ScrollView>

      {/* Fixed Footer */}
      <View style={{ 
        position: "absolute", 
        bottom: 0, 
        left: 0, 
        right: 0,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#ddd"
      }}>
        <OrderFooter 
          total={total} 
          onCommander={saveChanges}
          buttonText="Sauvegarder"
        />
      </View>
      
    </View>
  );
}