import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { loadMenus, MenuItem, OrderItem, saveOrder } from "../../src/storage/storage";

import MenuList from "../../src/components/MenuList";
import OrderFooter from "../../src/components/OrderFooter";
import OrderList from "../../src/components/OrderList";

export default function Vente() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);

  // 🔥 Scroll reference for order list
  const orderScrollRef = useRef<ScrollView>(null);

  function removeItem(id: number) {
    setOrder(prev => prev.filter(item => item.id !== id));
  }

  useEffect(() => {
    loadMenus().then(setMenus);
  }, []);

  // 🔥 Auto-scroll effect when order changes
  useEffect(() => {
    if (orderScrollRef.current) {
      setTimeout(() => {
        orderScrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [order]);

  // Add item
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

  // Increase/decrease qty
  function changeQty(id: number, delta: number) {
    setOrder(prev =>
      prev
        .map(p =>
          p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p
        )
        .filter(p => p.qty > 0)
    );
  }

  const total = order.reduce((sum, i) => sum + i.price * i.qty, 0);

  async function commander() {
    if (order.length === 0) return;
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: order,
      total,
    };
    await saveOrder(newOrder);
    setOrder([]);
    alert("Commande enregistrée !");
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>

      {/* MENU SECTION (scrollable) */}
      <ScrollView style={{ flex: 1 }}>
        <MenuList menus={menus} onSelect={addItem} />
      </ScrollView>

      {/* ORDER SECTION (scrollable) */}
      <ScrollView
        ref={orderScrollRef}        // 🔥 enable auto-scroll
        style={{ flex: 1, backgroundColor: "#fff" }}
      >
        <OrderList
          order={order}
          onIncrease={(id) => changeQty(id, 1)}
          onDecrease={(id) => changeQty(id, -1)}
          onRemove={removeItem}
        />
      </ScrollView>

      {/* FOOTER SECTION */}
      <OrderFooter total={total} onCommander={commander} />
    </View>
  );
}
