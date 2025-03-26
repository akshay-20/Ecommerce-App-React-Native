import React, { useEffect, useState } from "react";
import { 
  View, Text, Image, FlatList, StyleSheet, TouchableOpacity 
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// Define Product Type
type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

// HomeScreen Component
export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const router = useRouter();

  // Fetch Products
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data: Product[]) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Fetch Cart Items Count
  const fetchCartCount = async () => {
    const cart = await AsyncStorage.getItem("cart");
    if (cart) {
      const parsedCart = JSON.parse(cart);
      setCartCount(parsedCart.length);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  // Add Item to Cart
  const addToCart = async (item: Product) => {
    try {
      const cart = await AsyncStorage.getItem("cart");
      let updatedCart = cart ? JSON.parse(cart) : [];
      
      // Check if the item is already in the cart
      const existingItem = updatedCart.find((cartItem: Product) => cartItem.id === item.id);
      if (!existingItem) {
        updatedCart.push(item);
      }

      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      fetchCartCount(); // Update cart count after adding
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Cart Icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>E-Commerce</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/cart")} style={styles.cartIcon}>
          <Ionicons name="cart-outline" size={28} color="#000" />
          {cartCount > 0 && <Text style={styles.cartBadge}>{cartCount}</Text>}
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/products/[id]",
                  params: { id: item.id.toString() },
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addToCartBtn} onPress={() => addToCart(item)}>
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, backgroundColor: "#fff", elevation: 4 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  cartIcon: { position: "relative" },
  cartBadge: { position: "absolute", right: -8, top: -5, backgroundColor: "red", color: "#fff", fontSize: 12, fontWeight: "bold", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  productCard: { flex: 1, margin: 10, backgroundColor: "#fff", padding: 10, borderRadius: 8, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  productImage: { width: 100, height: 100, resizeMode: "contain" },
  productTitle: { fontSize: 14, fontWeight: "bold", textAlign: "center", marginTop: 5 },
  productPrice: { fontSize: 16, fontWeight: "bold", color: "#007BFF", marginTop: 5 },
  addToCartBtn: { backgroundColor: "#007BFF", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginTop: 5 },
  addToCartText: { color: "#fff", fontWeight: "bold" },
});

