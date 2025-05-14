import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  StyleSheet,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import CourseItem from "../../components/CourseItem";
import { Stack, router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function HomeScreen() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userIdFilter, setUserIdFilter] = useState("All");
  const [longTitlesOnly, setLongTitlesOnly] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [userIds, setUserIds] = useState([]);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      const coursesWithWordCount = data.map((course) => ({
        ...course,
        wordCount: course.title.split(" ").filter((word) => word.length > 0)
          .length,
      }));
      setCourses(coursesWithWordCount);
      await AsyncStorage.setItem(
        "cachedCourses",
        JSON.stringify(coursesWithWordCount)
      );
      const uniqueUserIds = [
        ...new Set(coursesWithWordCount.map((c) => c.userId)),
      ].sort((a, b) => a - b);
      setUserIds(uniqueUserIds);
    } catch (err) {
      setError(err.message);
      const cached = await AsyncStorage.getItem("cachedCourses");
      if (cached) {
        const cachedCourses = JSON.parse(cached);
        setCourses(cachedCourses);
        setUserIds(
          [...new Set(cachedCourses.map((c) => c.userId))].sort((a, b) => a - b)
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    let result = [...courses];
    if (userIdFilter !== "All") {
      result = result.filter((c) => c.userId === parseInt(userIdFilter));
    }
    if (longTitlesOnly) {
      result = result.filter((c) => c.wordCount >= 5);
    }
    result.sort((a, b) =>
      sortAsc ? a.wordCount - b.wordCount : b.wordCount - a.wordCount
    );
    setFilteredCourses(result);
  }, [courses, userIdFilter, longTitlesOnly, sortAsc]);

  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar style="dark" backgroundColor="#fff" />
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error && courses.length === 0) {
    return (
      <View style={styles.center}>
        <StatusBar style="dark" backgroundColor="#fff" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Retry" onPress={fetchCourses} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "LMS Explorer",
          headerStyle: { backgroundColor: "#00008B" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="chevron.left.forwardslash.chevron.right"
              color={color}
            />
          ),
        }}
      />
      <View style={styles.container}>
        <StatusBar style="dark" backgroundColor="#fff" />
        <View style={styles.filters}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Instructor:</Text>
            <Picker
              selectedValue={userIdFilter}
              onValueChange={setUserIdFilter}
              style={styles.picker}
            >
              <Picker.Item label="All Instructors" value="All" />
              {userIds.map((id) => (
                <Picker.Item
                  key={id}
                  label={`Instructor ${id}`}
                  value={id.toString()}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Long Titles (≥5 words):</Text>
            <Switch value={longTitlesOnly} onValueChange={setLongTitlesOnly} />
          </View>
          <Button
            title={`Sort by Word Count (${sortAsc ? "Asc" : "Desc"})`}
            onPress={() => setSortAsc(!sortAsc)}
            color="#00008B"
          />
        </View>
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CourseItem
              course={item}
              onPress={() => {
                console.log("Navigating to /detail with course:", item);
                router.push({
                  pathname: "/DetailScreen",
                  params: { course: JSON.stringify(item) },
                });
              }}
            />
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  filters: { marginBottom: 10 },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  picker: { flex: 1, height: 50 },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: { fontSize: 16, marginRight: 10 },
  errorText: { fontSize: 16, color: "red", marginBottom: 10 },
});
