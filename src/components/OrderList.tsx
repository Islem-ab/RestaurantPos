import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OrderItem } from "../storage/storage";

type Props = {
  order: OrderItem[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void; // NEW
};

export default function OrderList({ order, onIncrease, onDecrease, onRemove }: Props) {
  return (
    <View style={{ padding: 10 }}>
      {order.map((item) => (
        <View key={item.id} style={styles.row}>

          {/* NAME */}
          <Text style={styles.name}>
            {item.name} x{item.qty}
          </Text>

          {/* BUTTONS */}
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btn} onPress={() => onDecrease(item.id)}>
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => onIncrease(item.id)}>
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>

            {/* ❌ REMOVE BUTTON */}
            <TouchableOpacity style={styles.deleteBtn} onPress={() => onRemove(item.id)}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>

          {/* PRICE */}
          <Text style={styles.price}>{item.price * item.qty} dt</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    width: 120,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    width: 60,
    textAlign: "right",
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  btn: {
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  btnText: {
    fontSize: 18,
  },

  // ❌ DELETE BUTTON
  deleteBtn: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});
