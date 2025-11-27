import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  selected: string;
  onSelect: (c: string) => void;
};

const categories = [
  { label: "Tous", key: "tous" },
  { label: "Plats", key: "plats" },
  { label: "Sandwichs", key: "sandwichs" },
  { label: "Pâtes", key: "pates" },
  { label: "Salades", key: "salades" },
];

export default function CategoryBar({ selected, onSelect }: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => onSelect(cat.key)}
            style={[styles.chip, selected === cat.key && styles.chipActive]}
          >
            <Text style={selected === cat.key ? styles.activeText : styles.text}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingLeft: 10,
  },
  scrollContent: {
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: "#3498db",
  },
  text: {
    color: "#333",
    fontWeight: "600",
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
