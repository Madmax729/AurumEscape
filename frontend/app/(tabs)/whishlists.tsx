import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useWishlist } from '@/context/WishlistContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>
      {wishlist.length === 0 ? (
        <Text style={styles.emptyText}>No hotels in your wishlist.</Text>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.listItemContainer}
              // onPress={() => navigation.navigate('listing', { id: item.id })}
              onPress={() => navigation.navigate('listing/[id]', { id: item.id })}
            >
              <View style={styles.listItem}>
                <Image source={{ uri: item.xl_picture_url }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.location}>{item.smart_location}</Text>
                </View>
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent TouchableOpacity
                    toggleWishlist(item);
                  }}
                >
                  <Ionicons name="heart" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { fontSize: 16, color: 'gray', textAlign: 'center' },
  listItemContainer: {
    marginBottom: 10,
  },
  listItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  image: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, marginLeft: 10 },
  name: { fontSize: 18, fontWeight: 'bold' },
  location: { fontSize: 14, color: 'gray' },
});

export default WishlistPage;