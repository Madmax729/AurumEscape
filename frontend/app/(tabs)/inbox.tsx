import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

// Mock data for messages
const mockMessages = [
  {
    id: '1',
    name: 'Alice Johnson',
    message: 'Hey! Your villa will be available till next week',
    time: '2h ago',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    name: 'Michael Smith',
    message: 'Hope you had a wonderful stay! Visit again.',
    time: '1d ago',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '3',
    name: 'Sophia Lee',
    message: 'Can you share the check-in details?',
    time: '3d ago',
    avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
  },
];

const InboxScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inbox</Text>

      {mockMessages.length > 0 ? (
        <FlatList
          data={mockMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.messageCard} onPress={() => router.push(`/chat/${item.id}`)}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.messageDetails}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubble-outline" size={64} color={Colors.grey} />
          <Text style={styles.emptyText}>No messages yet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: Colors.grey,
  },
  time: {
    fontSize: 12,
    color: Colors.grey,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    color: Colors.grey,
  },
});

export default InboxScreen;
