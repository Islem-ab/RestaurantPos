import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "caisseresto_history_v1";
const MENUS_KEY = "caisseresto_menus_v1";

// ============================================
// TYPES
// ============================================
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  category?: string;
}

export interface Order {
  id: number;
  date: string;
  items: OrderItem[];
  total: number;
}

// ============================================
// MENU FUNCTIONS
// ============================================
export async function loadMenus(): Promise<MenuItem[]> {
  try {
    const data = await AsyncStorage.getItem(MENUS_KEY);
    if (!data) {
      // Return default menus if none exist
      const defaultMenus: MenuItem[] = [
        { id: 1, name: "Pizza Margherita", price: 12.5, category: "pizza" },
        { id: 2, name: "Pizza 4 Fromages", price: 14.0, category: "pizza" },
        { id: 3, name: "Tacos Poulet", price: 8.0, category: "tacos" },
        { id: 4, name: "Tacos Viande", price: 9.0, category: "tacos" },
        { id: 5, name: "Burger Classic", price: 10.0, category: "burger" },
        { id: 6, name: "Burger Cheese", price: 11.5, category: "burger" },
        { id: 7, name: "Coca Cola", price: 2.5, category: "boisson" },
        { id: 8, name: "Fanta", price: 2.5, category: "boisson" },
        { id: 9, name: "Salade César", price: 7.0, category: "salade" },
        { id: 10, name: "Salade Grecque", price: 7.5, category: "salade" },
      ];
      await AsyncStorage.setItem(MENUS_KEY, JSON.stringify(defaultMenus));
      return defaultMenus;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading menus:", error);
    return [];
  }
}

export async function saveMenus(menus: MenuItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(MENUS_KEY, JSON.stringify(menus));
  } catch (error) {
    console.error("Error saving menus:", error);
  }
}

// ============================================
// ORDER FUNCTIONS
// ============================================
export async function loadHistory(): Promise<Order[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading history:", error);
    return [];
  }
}

export async function saveOrder(order: Order): Promise<void> {
  try {
    const history = await loadHistory();
    history.push(order);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error saving order:", error);
  }
}

export async function loadOrderById(orderId: number): Promise<Order | null> {
  try {
    const history = await loadHistory();
    const order = history.find((o) => o.id === orderId);
    return order || null;
  } catch (error) {
    console.error("Error loading order by ID:", error);
    return null;
  }
}

export async function updateOrder(updatedOrder: Order): Promise<void> {
  try {
    const history = await loadHistory();
    const index = history.findIndex((o) => o.id === updatedOrder.id);
    
    if (index !== -1) {
      history[index] = updatedOrder;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } else {
      console.error("Order not found for update");
    }
  } catch (error) {
    console.error("Error updating order:", error);
  }
}

export async function deleteOrder(orderId: number): Promise<void> {
  try {
    const history = await loadHistory();
    const filtered = history.filter((o) => o.id !== orderId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting order:", error);
  }
}

export async function deleteAllOrders(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, "[]");
  } catch (error) {
    console.error("Error deleting all orders:", error);
  }
}