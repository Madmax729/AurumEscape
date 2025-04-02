import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import listingsData from '@/assets/data/airbnb-listings.json';
import { useWishlist } from '@/context/WishlistContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const ReservePage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { wishlist } = useWishlist();
  
  const listing = (listingsData as any[]).find((item) => item.id === id) || wishlist.find((item) => item.id === id);
  
  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 3)));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  if (!listing) {
    return (
      <View style={styles.container}>
        <Text>Listing not found</Text>
      </View>
    );
  }

  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const subtotal = listing.price * nights;
  const cleaningFee = 50;
  const serviceFee = 25;
  const total = subtotal + cleaningFee + serviceFee;

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
      }
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerTitle: 'Confirm your booking',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your trip</Text>
          <View style={styles.inputRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.grey} />
            <TouchableOpacity 
              style={styles.inputField} 
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text>Start: {startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onStartDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.grey} />
            <TouchableOpacity 
              style={styles.inputField} 
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text>End: {endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={onEndDateChange}
                minimumDate={new Date(startDate.getTime() + 86400000)} // +1 day
              />
            )}
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={20} color={Colors.grey} />
            <TextInput 
              style={styles.inputField}
              placeholder="Guests"
              value={guests.toString()}
              onChangeText={(text) => setGuests(Number(text) || 1)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing details</Text>
          <View style={styles.priceRow}>
            <Text>€{listing.price} x {nights} nights</Text>
            <Text>€{subtotal}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text>Cleaning fee</Text>
            <Text>€{cleaningFee}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text>Service fee</Text>
            <Text>€{serviceFee}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>€{total}</Text>
        </View>
      </ScrollView>

      <View style={defaultStyles.footer}>
        <TouchableOpacity 
          style={[defaultStyles.btn, { paddingHorizontal: 20 }]}
          onPress={() => router.push('/payment')}
        >
          <Text style={defaultStyles.btnText}>Confirm and pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  inputField: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReservePage;