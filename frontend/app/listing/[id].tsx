import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share } from 'react-native';
import listingsData from '@/assets/data/airbnb-listings.json';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { defaultStyles } from '@/constants/Styles';
import { useWishlist } from '@/context/WishlistContext';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const DetailsPage = () => {
  const { id } = useLocalSearchParams();
  const { wishlist, toggleWishlist } = useWishlist();
  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const listing = (listingsData as any[]).find((item) => item.id === id) || wishlist.find((item) => item.id === id);
  if (!listing) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Listing not found</Text>
      </View>
    );
  }

  const isWishlisted = wishlist.some((item) => item.id === listing.id);

  const shareListing = async () => {
    try {
      await Share.share({
        title: listing.name,
        message: listing.listing_url,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerBackground: () => <Animated.View style={[headerAnimatedStyle, styles.header]} />,
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton} onPress={() => toggleWishlist(listing)}>
            <Ionicons name={isWishlisted ? 'heart' : 'heart-outline'} size={22} color={isWishlisted ? 'red' : '#000'} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={'#000'} />
        </TouchableOpacity>
      ),
    });
  }, [isWishlisted, listing]);

  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]) },
      { scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]) },
    ],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
  }));

  return (
    <View style={styles.container}>
      <Animated.ScrollView 
        contentContainerStyle={{ 
          paddingBottom: 180, // Increased padding to accommodate footer
        }} 
        ref={scrollRef} 
        scrollEventThrottle={16}
      >
        <Animated.Image source={{ uri: listing.xl_picture_url }} style={[styles.image, imageAnimatedStyle]} resizeMode="cover" />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{listing.name}</Text>
          <Text style={styles.location}>{listing.room_type} in {listing.smart_location}</Text>
          <Text style={styles.rooms}>{listing.guests_included} guests · {listing.bedrooms} bedrooms · {listing.beds} bed · {listing.bathrooms} bathrooms</Text>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>{listing.review_scores_rating / 20} · {listing.number_of_reviews} reviews</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image source={{ uri: listing.host_picture_url }} style={styles.host} />
            <View>
              <Text style={{ fontWeight: '500', fontSize: 16 }}>Hosted by {listing.host_name}</Text>
              <Text>Host since {listing.host_since}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.description}>{listing.description}</Text>
        </View>
      </Animated.ScrollView>

      <Animated.View 
        style={styles.footerContainer}
        entering={SlideInDown.delay(200)}
      >
        <View style={styles.footerContent}>
          <View style={styles.priceContainer}>
            <Text style={styles.footerPrice}>€{listing.price}</Text>
            <Text style={styles.perNight}> / night</Text>
          </View>
          <Link href={`/reserve?id=${listing.id}`} asChild>
            <TouchableOpacity style={styles.reserveButton}>
              <Text style={styles.reserveButtonText}>Reserve</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white',
    position: 'relative',
  },
  image: { 
    height: IMG_HEIGHT, 
    width 
  },
  infoContainer: { 
    padding: 24, 
    backgroundColor: '#fff' 
  },
  name: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    fontFamily: 'mon-sb' 
  },
  location: { 
    fontSize: 18, 
    marginTop: 10, 
    fontFamily: 'mon-sb' 
  },
  rooms: { 
    fontSize: 16, 
    color: Colors.grey, 
    marginVertical: 4, 
    fontFamily: 'mon' 
  },
  ratings: { 
    fontSize: 16, 
    fontFamily: 'mon-sb' 
  },
  divider: { 
    height: StyleSheet.hairlineWidth, 
    backgroundColor: Colors.grey, 
    marginVertical: 16 
  },
  host: { 
    width: 50, 
    height: 50, 
    borderRadius: 50, 
    backgroundColor: Colors.grey 
  },
  hostView: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
    paddingBottom: 30,
    zIndex: 100,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerPrice: { 
    fontSize: 18, 
    fontFamily: 'mon-sb' 
  },
  perNight: { 
    color: Colors.grey,
    fontSize: 16,
  },
  reserveButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  roundButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 50, 
    backgroundColor: 'white', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  bar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10 
  },
  header: { 
    backgroundColor: '#fff', 
    height: 100, 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderColor: Colors.grey 
  },
  description: { 
    fontSize: 16, 
    marginTop: 10, 
    fontFamily: 'mon' 
  },
});

export default DetailsPage;