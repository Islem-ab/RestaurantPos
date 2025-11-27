import AsyncStorage from "@react-native-async-storage/async-storage";

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: any;
};

export type OrderItem = MenuItem & { qty: number };

export type Order = {
  id: number;
  date: string;
  items: OrderItem[];
  total: number;
};

const MENUS_KEY = "caisseresto_menus_v1";
const HISTORY_KEY = "caisseresto_history_v1";

export const defaultMenus: MenuItem[] = [
  { id: 1, name: "Pizza", price: 15, image: require("../../assets/images/pizza.png") },
  { id: 2, name: "Tacos", price: 12, image: require("../../assets/images/tacos.png") },
  { id: 3, name: "Burger", price: 10, image: require("../../assets/images/burger.png") },
  { id: 4, name: "Sandwitch", price: 8, image: require("../../assets/images/sandwich.png") },
  { id: 5, name: "Pasta", price: 14, image: require("../../assets/images/pasta.png") },
  { id: 6, name: "Salad", price: 9, image: require("../../assets/images/salad.png") },
];

// ---------------------------
// MENU FUNCTIONS
// ---------------------------
export async function loadMenus(): Promise<MenuItem[]> {
  const saved = await AsyncStorage.getItem(MENUS_KEY);

  if (saved) return JSON.parse(saved);

  await AsyncStorage.setItem(MENUS_KEY, JSON.stringify(defaultMenus));
  return defaultMenus;
}

// ---------------------------
// ORDER HISTORY FUNCTIONS
// ---------------------------
export async function loadHistory(): Promise<Order[]> {
  const saved = await AsyncStorage.getItem(HISTORY_KEY);
  return saved ? JSON.parse(saved) : [];
}

export async function saveOrder(order: Order) {
  const all = await loadHistory();
  all.push(order);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(all));
}

export async function deleteOrder(id: number) {
  const all = await loadHistory();
  const filtered = all.filter(o => o.id !== id);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

// ---------------------------
// ORDER MODIFICATION FUNCTIONS
// ---------------------------
export async function loadOrderById(id: number): Promise<Order | null> {
  const all = await loadHistory();
  return all.find(o => o.id === id) || null;
}

export async function updateOrder(updated: Order) {
  const all = await loadHistory();
  const newList = all.map(o => (o.id === updated.id ? updated : o));
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newList));
}
