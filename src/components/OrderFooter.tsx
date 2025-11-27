import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  total: number;
  onCommander: () => void;
};

export default function OrderFooter({ total, onCommander }: Props) {
  return (
    <View style={styles.footer}>
      <Text style={styles.total}>Total: {total} dt</Text>

      <TouchableOpacity style={styles.btn} onPress={onCommander}>
        <Text style={styles.btnText}>Enregistrer</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: {
    fontSize: 22,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
