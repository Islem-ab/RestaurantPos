import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface OrderFooterProps {
  total: number;
  onCommander: () => void;
  buttonText?: string;
}

export default function OrderFooter({ 
  total, 
  onCommander,
  buttonText = "Commander"
}: OrderFooterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>{total.toFixed(2)} DT</Text>
      </View>

      <TouchableOpacity 
        style={styles.commanderBtn} 
        onPress={onCommander}
        activeOpacity={0.8}
      >
        <Text style={styles.commanderText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 2,
    borderTopColor: "#e0e0e0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27ae60",
  },
  commanderBtn: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  commanderText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});