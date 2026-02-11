/** the avatar display icon??
 * 
 */

import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';

interface AvatarDisplayProps {
  avatarUrl: string | null;
  onPress: () => void;
  size?: number;
}

/**
 * Small avatar component for HomeScreen header
 * Shows user's avatar or default icon, clickable to navigate to ProfileScreen
 */
export default function AvatarDisplay({ avatarUrl, onPress, size = 40 }: AvatarDisplayProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.avatarContainer, { width: size, height: size, borderRadius: size / 2 }]}>
        {avatarUrl ? (
          // Display user's uploaded avatar
          <Image
            source={{ uri: avatarUrl }}
            style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
            resizeMode="cover"
          />
        ) : (
          // Display default avatar icon (generic user icon)
          <View style={[styles.defaultAvatar, { width: size, height: size, borderRadius: size / 2 }]}>
            <View style={styles.iconHead} />
            <View style={styles.iconBody} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  avatarContainer: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0a0404',
    overflow: 'hidden',
  },
  avatar: {
    // Actual user avatar image
  },
  defaultAvatar: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  // Simple person icon using shapes
  iconHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0a0404',
    position: 'absolute',
    top: 8,
  },
  iconBody: {
    width: 20,
    height: 12,
    overflow: 'hidden',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#0a0404',
    position: 'absolute',
    bottom: 6,
  },
});