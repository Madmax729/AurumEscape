import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

// Mock data for trips (replace with your actual data source)
const mockTrips = [
  {
    id: '1',
    title: 'Beachfront Villa',
    location: 'Malibu, California',
    dates: 'Nov 12-18, 2025',
    price: 350,
    image: 'https://a0.muscache.com/im/pictures/miso/Hosting-53095524/original/7a9c5a5b-5a6e-4b1c-9b9a-3b1b3b3b3b3b.jpeg',
  },
  {
    id: '2',
    title: 'Mountain Cabin',
    location: 'Aspen, Colorado',
    dates: 'Dec 20-27, 2025',
    price: 275,
    image: 'https://a0.muscache.com/im/pictures/miso/Hosting-53095524/original/7a9c5a5b-5a6e-4b1c-9b9a-3b1b3b3b3b3b.jpeg',
  },
];

const TripsPage = () => {
  const router = useRouter();
  const hasTrips = mockTrips.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trips</Text>

      {hasTrips ? (
        <FlatList
          data={mockTrips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tripCard}>
              <Image source={{ uri: item.image }} style={styles.tripImage} />
              <View style={styles.tripDetails}>
                <Text style={styles.tripTitle}>{item.title}</Text>
                <Text style={styles.tripLocation}>{item.location}</Text>
                <Text style={styles.tripDates}>{item.dates}</Text>
                <Text style={styles.tripPrice}>${item.price} night</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={Colors.grey} />
            </View>
          )}
          ListFooterComponent={() => (
            <View style={styles.footerContainer}>
              <Link href="/" asChild>
                <TouchableOpacity style={styles.exploreButton}>
                  <Text style={styles.exploreButtonText}>Explore more!!</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color={Colors.grey} />
          <Text style={styles.emptyText}>No trips booked yet!</Text>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>Start booking</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  tripImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  tripDetails: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tripLocation: {
    fontSize: 14,
    color: Colors.grey,
    marginBottom: 4,
  },
  tripDates: {
    fontSize: 14,
    marginBottom: 4,
  },
  tripPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  emptyState: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: Colors.grey,
  },
  outlineButton: {
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  outlineButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TripsPage;
