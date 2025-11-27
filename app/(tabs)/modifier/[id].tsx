import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { loadMenus, loadOrderById, MenuItem, OrderItem, updateOrder } from "../../../src/storage/storage";

import MenuList from "../../../src/components/MenuList";
import OrderFooter from "../../../src/components/OrderFooter";
import OrderList from "../../../src/components/OrderList";

export default function ModifierOrder() {
  const { id } = useLocalSearchParams();
  const orderId = Number(id);
  const router = useRouter();

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);

  useEffect(() => {
    async function load() {
      const menuItems = await loadMenus();
      setMenus(menuItems);

      const existingOrder = await loadOrderById(orderId);
      if (!existingOrder) {
        Alert.alert("Erreur", "Commande introuvable");
        router.back();
        return;
      }

      setOrder(existingOrder.items);
    }

    load();
  }, []);

  function addItem(item: MenuItem) {
    setOrder(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) {
        return prev.map(p =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function changeQty(id: number, delta: number) {
    setOrder(prev =>
      prev
        .map(p =>
          p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p
        )
        .filter(p => p.qty > 0)
    );
  }

  function removeItem(id: number) {
    setOrder(prev => prev.filter(i => i.id !== id));
  }

  const total = order.reduce((sum, i) => sum + i.price * i.qty, 0);

  async function saveChanges() {
    const updatedOrder = {
      id: orderId,
      date: new Date().toLocaleString(),
      items: order,
      total,
    };

    await updateOrder(updatedOrder);

    Alert.alert("Succès", "Commande modifiée !");
    router.push("/(tabs)/historique");
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <MenuList menus={menus} onSelect={addItem} />
      </ScrollView>

      <ScrollView style={{ flex: 1 }}>
        <OrderList
          order={order}
          onIncrease={(id) => changeQty(id, 1)}
          onDecrease={(id) => changeQty(id, -1)}
          onRemove={removeItem}
        />
      </ScrollView>

      <OrderFooter total={total} onCommander={saveChanges} />
    </View>
  );
}
