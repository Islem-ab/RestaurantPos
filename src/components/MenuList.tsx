import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MenuItem } from "../storage/storage";

type Props = {
  menus: MenuItem[];
  onSelect: (item: MenuItem) => void;
};

export default function MenuList({ menus, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {menus.map((item) => (
        <TouchableOpacity key={item.id} style={styles.card} onPress={() => onSelect(item)}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price} dt</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    width: "31%",   // 🔥 force 3 items per row
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: "600",
  },
  price: {
    fontSize: 15,
    marginTop: 4,
    color: "green",
    fontWeight: "bold",
  },
});
