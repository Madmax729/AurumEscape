import React, { createContext, useState, useContext } from 'react';

interface WishlistContextType {
  wishlist: any[];
  toggleWishlist: (listing: any) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<any[]>([]);

  const toggleWishlist = (listing: any) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === listing.id);
      if (exists) {
        return prevWishlist.filter((item) => item.id !== listing.id); // Remove from wishlist
      } else {
        return [...prevWishlist, listing]; // Add to wishlist
      }
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
