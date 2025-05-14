import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/HomeScreen"); // Use correct path
    }, 2000); // Increased delay to make splash screen visible

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LinearGradient
      colors={["#4FC3F7", "#0288D1"]} // Added gradient colors
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text
          onPress={() => router.push("/(tabs)/HomeScreen")} // Consistent path
          style={styles.title}
        >
          LMS
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    color: "white", // Changed to white for better contrast
    fontSize: 50,
    borderColor: "white",
    borderWidth: 5,
    padding: 10,
    backgroundColor: "#00008B",
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
});

export default Index;
