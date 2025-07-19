import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const HomePage = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Divina</Text>
        <Text style={styles.subtitle}>Feeling hungry? What are we cookin' today?</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search any recipe..."
        />
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}><Text>See All</Text></TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}><Text>Soup</Text></TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}><Text>Breakfast</Text></TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}><Text>Salad</Text></TouchableOpacity>
        </View>
      </View>

      {/* Recommendation Section */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendation</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.card}>
              <Image
                source={require("../assets/images/spicy-thai-tom-yum.png")}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle}>Spicy Thai Tom Yum</Text>
              <Text style={styles.cardTime}>30 mins</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Image
                source={require("../assets/images/creamy-mushroom-soup.png")}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle}>Creamy Mushroom Soup</Text>
              <Text style={styles.cardTime}>30 mins</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Recipe of The Week Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe of The Week</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Add cards for recipes */}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    backgroundColor: "#E8F5E9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#388E3C",
  },
  subtitle: {
    fontSize: 16,
    color: "#388E3C",
    marginTop: 5,
  },
  searchInput: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  filterContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  filterButton: {
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    marginRight: 10,
    width: 150,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 100,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    margin: 5,
  },
  cardTime: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 5,
    marginBottom: 5,
  },
});

export default HomePage;
