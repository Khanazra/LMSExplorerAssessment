import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function DetailScreen() {
  const { course: courseString } = useLocalSearchParams();
  const course = courseString
    ? JSON.parse(courseString)
    : { id: 0, title: "No Course", userId: 0, body: "", wordCount: 0 };
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadFavorite = async () => {
      try {
        const favorites = JSON.parse(
          (await AsyncStorage.getItem("favorites")) || "[]"
        );
        setIsFavorite(favorites.includes(course.id));
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };
    if (course.id) {
      loadFavorite();
    }
  }, [course.id]);

  const toggleFavorite = async () => {
    try {
      let favorites = JSON.parse(
        (await AsyncStorage.getItem("favorites")) || "[]"
      );
      if (isFavorite) {
        favorites = favorites.filter((id) => id !== course.id);
      } else {
        favorites.push(course.id);
      }
      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error saving favorite:", err);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Course Details",
          headerStyle: { backgroundColor: "#007AFF" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chevron.right" color={color} />
          ),
        }}
      />
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor="#fff" />
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.text}>Instructor ID: {course.userId}</Text>
        <Text style={styles.text}>Word Count: {course.wordCount}</Text>
        <Text style={styles.description}>Description: {course.body}</Text>
        <TouchableOpacity
          onPress={toggleFavorite}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={24}
            color="gold"
          />
          <Text style={styles.favoriteText}>
            {isFavorite ? "Remove Favorite" : "Mark as Favorite"}
          </Text>
        </TouchableOpacity>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 10 },
  description: { fontSize: 14, marginBottom: 20, lineHeight: 20 },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  favoriteText: { marginLeft: 10, fontSize: 16, color: "#007AFF" },
});
