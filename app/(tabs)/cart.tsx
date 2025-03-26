import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// Define Product Type
type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

// CartScreen Component
export default function CartScreen() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Fetch Cart Items
  const fetchCartItems = async () => {
    const cart = await AsyncStorage.getItem("cart");
    if (cart) {
      setCartItems(JSON.parse(cart));
    }
  };

  // Calculate Total Price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  // Remove Item from Cart
  const removeFromCart = async (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.remove}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Text style={styles.total}>Total: ${totalPrice}</Text>
        </>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  emptyText: { textAlign: "center", fontSize: 16 },
  cartItem: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#fff", marginVertical: 5, borderRadius: 5 },
  image: { width: 50, height: 50, marginRight: 10 },
  title: { fontSize: 14, fontWeight: "bold" },
  price: { fontSize: 14, color: "#007BFF" },
  remove: { color: "red", fontWeight: "bold" },
  total: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 },
});
