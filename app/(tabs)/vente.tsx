import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

import {
  loadMenus,
  MenuItem,
  OrderItem,
  saveOrder
} from "../../src/storage/storage";

import CategoryBar from "../../src/components/CategoryBar";
import MenuList from "../../src/components/MenuList";
import OrderFooter from "../../src/components/OrderFooter";
import OrderList from "../../src/components/OrderList";

import { toastSuccess } from "../../src/utils/toast";

export default function Vente() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [category, setCategory] = useState("tous");

  const orderScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadMenus().then(setMenus);
  }, []);

  // Fixed filter logic
  const filteredMenus =
    category === "tous" 
      ? menus 
      : menus.filter((m) => m.category?.toLowerCase() === category.toLowerCase());

  function addItem(item: MenuItem) {
    setOrder((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });

    setTimeout(() => {
      orderScrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    toastSuccess(`${item.name} ajouté !`);
  }

  function removeItem(id: number) {
    const removed = order.find(i => i.id === id);
    setOrder((prev) => prev.filter((i) => i.id !== id));
    if (removed) {
      toastSuccess(`${removed.name} retiré`);
    }
  }

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

  const total = order.reduce((s, i) => s + i.price * i.qty, 0);

  async function commander() {
    if (order.length === 0) {
      toastSuccess("Panier vide !");
      return;
    }

    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString("fr-TN", { 
        timeZone: "Africa/Tunis",
        dateStyle: "short",
        timeStyle: "short"
      }),
      items: order,
      total,
    };

    await saveOrder(newOrder);
    setOrder([]);

    toastSuccess("Commande enregistrée !");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>

      {/* 10% – categories */}
      <View style={{ height: "10%" }}>
        <CategoryBar selected={category} onSelect={setCategory} />
      </View>

      {/* 40% – menus */}
      <View style={{ height: "40%" }}>
        <ScrollView>
          <MenuList menus={filteredMenus} onSelect={addItem} />
        </ScrollView>
      </View>

      {/* 40% – order */}
      <View style={{ height: "40%" }}>
        <ScrollView ref={orderScrollRef} style={{ backgroundColor: "#fff" }}>
          <OrderList
            order={order}
            onIncrease={(id) => changeQty(id, 1)}
            onDecrease={(id) => changeQty(id, -1)}
            onRemove={removeItem}
          />
        </ScrollView>
      </View>

      {/* 10% – footer */}
      <View style={{ height: "10%" }}>
        <OrderFooter total={total} onCommander={commander} />
      </View>

    </View>
  );
}