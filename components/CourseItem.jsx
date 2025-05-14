// components/CourseItem.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CourseItem = ({ course, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <Text style={styles.title} numberOfLines={2}>
      {course.title}
    </Text>
    <Text style={styles.text}>Instructor ID: {course.userId}</Text>
    <Text style={styles.text}>Word Count: {course.wordCount}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  text: { fontSize: 14, color: "#333" },
});

export default CourseItem;
