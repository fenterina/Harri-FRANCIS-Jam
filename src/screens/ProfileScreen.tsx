/**
 * Function for the UI Profile Screen
 * To manage the frontend for this Profile Screen
 *  
 * 
 * 
 * 
 * editing Avatar - need ug own function sa useAvatar (although nigana siya last, mabot lang ngano wala napud nigana inutil)
 * editing state - profile screen na UI/UX
 * editing function - backend, utilize useAvatar and portion sa frontend to call sa URL? hmmm....
 * 
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ActionSheetIOS,
  Platform,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAvatar } from '../hooks/useAvatar';
import { logout } from '../services/authServices';
import { supabase } from '../lib/supabase';
import { User } from '../types/types';
import * as ImagePicker from 'expo-image-picker';
import { uriToPath } from '../utils/image-to-path';

//to match with useAvatar.ts
const BUCKET_NAME = 'avatars';

export default function ProfileScreen({ route, navigation }: any) {
  // Get userId from navigation params
  const { userId } = route.params as {userId: string};

  // Avatar hook for CRUD operations
  const { avatarUrl, loading: avatarLoading, uploadAvatar, deleteAvatar, refreshAvatar } = useAvatar(userId);

  // User info states
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false); // editing state sa mga placeholders for both static and editing mode
  const [editedUsername, setEditedUsername] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  // Avatar editing states
  const [isEditingAvatar, setIsEditingAvatar] = useState(false); // editing state para sa Avatar display only
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  /**
   * Fetch user information from database
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from('user_information')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Fetch user error:', error);
          return;
        }

        if (data) {
          setUser(data);
          setEditedUsername(data.username);
          setEditedEmail(data.email);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  /**
   * Pick image from camera or gallery
   * Shows preview instead of immediately uploading
   */
  const handlePickImage = async (source: 'camera' | 'gallery') => {
    try {
      // Request appropriate permissions
      let permissionResult;
      if (source === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access ' + (source === 'camera' ? 'camera' : 'gallery') + ' is required');
        return;
      }

      // Launch image picker based on source
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Square crop
            quality: 1,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Square crop
            quality: 1,
          });

      // User cancelled the picker
      if ((result as any).canceled) {
        return;
      }
      const uri = (result as any).assets?.[0]?.uri;
      if (!uri) {
        Alert.alert('Error', 'No image selected');
          return;
      }

      // Set preview and selected image
      setPreviewUri(uri);
      setSelectedImageUri(uri);
      setIsEditingAvatar(true);
    } catch (err) {
      console.error('Image picker error:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  /**
   * Handle avatar change - show options for camera or gallery
   */
  const handleChangeAvatar = () => {
    if (Platform.OS === 'ios') {
      // iOS uses ActionSheetIOS
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            await handlePickImage('camera');
          } else if (buttonIndex === 2) {
            await handlePickImage('gallery');
          }
        }
      );
    } else {
      // Android uses Alert
      Alert.alert(
        'Change Avatar',
        'Choose an option',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Take Photo',
            onPress: () => handlePickImage('camera'),
          },
          {
            text: 'Choose from Gallery',
            onPress: () => handlePickImage('gallery'),
          },
        ]
      );
    }
  };

  /**
 * Save the selected avatar to Supabase Storage
 */
const handleSaveAvatar = async () => {
  if (!selectedImageUri) {
    Alert.alert('Error', 'No image selected');
    return;
  }

  try {
    setUploading(true);
    console.log('=== SAVE AVATAR START ===');
    console.log('Selected image URI:', selectedImageUri);

    const imagePath = await uriToPath(selectedImageUri);

    // ✅ Use folder structure path
    const avatarPath = `${userId}.jpg`;
    console.log('Upload path:', avatarPath);

    // ✅ Correct contentType with slash
    console.log('Uploading to Supabase Storage...');
 const { data, error: uploadError } = await supabase.storage
  .from(BUCKET_NAME)
  .upload(avatarPath, imagePath, {
    contentType: 'image/jpeg', //slash 
    upsert: true,
  });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      console.error('Error details (profile):', JSON.stringify(uploadError, null, 2));
      Alert.alert('Upload Failed', uploadError.message || 'Failed to upload avatar');
      return;
    }

    console.log('✅ Upload successful!');
    console.log('Upload data:', data);

    // Clear editing state
    setIsEditingAvatar(false);
    setPreviewUri(null);
    setSelectedImageUri(null);

    // // Refresh avatar URL
    await refreshAvatar();

    console.log('=== SAVE AVATAR END ===');
    Alert.alert('Success', 'Avatar updated successfully!');
  } catch (err:any) {
    console.error('❌ Save avatar error:', err);
    Alert.alert('Error', 'Failed to save avatar: ' + (err?.message ?? String(err)));
  } finally {
    setUploading(false);
  }
};

  /**
   * Upload avatar from a selected URI (bypassing the picker in useAvatar)
   */
  const uploadAvatarFromUri = async (uri: string): Promise<boolean> => {
    try {
      // Compress the selected image (reuse logic from useAvatar)
      const { manipulateAsync, SaveFormat } = await import('expo-image-manipulator');
      
      const manipulatedImage = await manipulateAsync(
  uri,
  [{ resize: { width: 500 } }],
  {
    compress: 0.7,
    format: SaveFormat.JPEG,
    base64: true, 
  }
);
console.log("Uploading...")
const base64 = manipulatedImage.base64!;
const byteString = atob(base64);
const arrayBuffer = new Uint8Array(byteString.length);

for (let i = 0; i < byteString.length; i++) {
  arrayBuffer[i] = byteString.charCodeAt(i);
}
const avatarPath = `${userId}/${userId}.jpeg`;

const { error } = await supabase.storage
  .from('avatars')
  .upload(avatarPath, arrayBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });

      if (error) {
        Alert.alert(`Upload error: ${error.message}`);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Upload from URI error:', err);
      return false;
    }
  };

  /**
   * Cancel avatar editing and discard preview
   */
  const handleCancelAvatarEdit = () => {
    setIsEditingAvatar(false);
    setPreviewUri(null);
    setSelectedImageUri(null);
  };

  /**
   * Handle avatar removal with confirmation
   */
 const handleRemoveAvatar = () => {
    Alert.alert(
      'Remove Avatar',
      'Are you sure you want to remove your avatar?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('=== REMOVE AVATAR START ===');
              console.log('Removing avatar for user:', userId);

              // ✅ Use deleteAvatar from useAvatar hook (this actually deletes from Supabase)
              const success = await deleteAvatar();

              if (success) {
                console.log('✅ Avatar removed successfully');
                Alert.alert('Success', 'Avatar removed successfully!');
              } else {
                console.log('❌ Failed to remove avatar');
              }

              console.log('=== REMOVE AVATAR END ===');
            } catch (err) {
              console.error('❌ Remove avatar error:', err);
              Alert.alert('Error', 'Failed to remove avatar');
            }
          },
        },
      ]
    );
  };


  /**
   * Save edited user information to database
   */
  const handleSaveProfile = async () => {
    if (editedUsername.trim() === '' || editedEmail.trim() === '') {
      Alert.alert('Error', 'Username and email cannot be empty');
      return;
    }

    try {
      // Update user information in database
      const { error } = await supabase
        .from('user_information')
        .update({
          username: editedUsername.trim(),
          email: editedEmail.trim(),
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Update user error:', error);
        Alert.alert('Error', 'Failed to update profile');
        return;
      }

      // Update local state with new values
      setUser({
        ...user!,
        username: editedUsername.trim(),
        email: editedEmail.trim(),
      });

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      Alert.alert('Error', 'An error occurred while updating profile');
    }
  };

  /**
   * Cancel editing and revert to original values
   */
  const handleCancelEdit = () => {
    setEditedUsername(user?.username || '');
    setEditedEmail(user?.email || '');
    setIsEditing(false);
  }; //look for button ani (cancelButton na)

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Call logout service to update database
            const { success } = await logout(userId);

            if (success) {
              // Navigate back to Login screen and reset navigation stack
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } else {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Avatar Icon (left) and Logout Button (right) */}
      <View style={styles.header}>
        {/* Small avatar icon on left */}
        <Pressable onPress={refreshAvatar} style={styles.headerAvatarContainer}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.headerAvatar} />
          ) : (
            <View style={styles.headerDefaultAvatar}>
              <View style={styles.smallIconHead} />
              <View style={styles.smallIconBody} />
            </View>
          )}
        </Pressable>

        {/* Logout button on right */}
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>

      {/* Avatar Section - Large display */}
      <View style={styles.avatarSection}>
        {/* Show preview if editing avatar, otherwise show current avatar */}
        <View style={styles.largeAvatarContainer}>
          {isEditingAvatar && previewUri ? (
            // Preview mode - show selected image
            <Image source={{ uri: previewUri }} style={styles.largeAvatar} />
          ) : avatarUrl ? (
            // Normal mode - show current avatar
            <Image source={{ uri: avatarUrl }} style={styles.largeAvatar} />
          ) : (
            // No avatar - show default icon
            <View style={styles.largeDefaultAvatar}>
              <View style={styles.largeIconHead} />
              <View style={styles.largeIconBody} />
            </View>
          )}
          
          {/* Loading overlay - to show both avatarLoading and uploading states */}
          {(avatarLoading || uploading) && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#0a0404" />
              <Text style={styles.loadingText}>
                {uploading ? 'Uploading...' : 'Loading...'}
              </Text>
            </View>
          )}
        </View>

        {/* Avatar action buttons */}
        {isEditingAvatar ? (
          // Editing mode - show Save and Cancel buttons
          <View style={styles.avatarEditButtonsContainer}>
            <Pressable
              style={[styles.saveAvatarButton, avatarLoading && styles.disabledButton]}
              onPress={handleSaveAvatar}
              disabled={uploading}
            >
              <Text style={styles.saveAvatarButtonText}>
                {uploading ? 'Saving...' : 'Save Avatar'}
              </Text>
            </Pressable>
            
            <Pressable
              style={[styles.cancelAvatarButton, avatarLoading && styles.disabledButton]}
              onPress={handleCancelAvatarEdit}
              disabled={uploading}
            >
              <Text style={styles.cancelAvatarButtonText}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          // Normal mode - show Change and Remove buttons during both avatarLoading and uploading
          <>
            <Pressable
              style={[styles.avatarButton, (avatarLoading || uploading) && styles.disabledButton]}
              onPress={handleChangeAvatar}
              disabled={avatarLoading || uploading}
            >
              <Text style={styles.avatarButtonText}>Change Avatar</Text>
            </Pressable>

            {/* Show remove button only if avatar exists */}
            {avatarUrl && (
              <Pressable
                style={[styles.removeButton, (avatarLoading || uploading) && styles.disabledButton]}
                onPress={handleRemoveAvatar}
                disabled={avatarLoading || uploading}
              >
                <Text style={styles.removeButtonText}>Remove Avatar</Text>
              </Pressable>
            )}
          </>
        )}
      </View>

      {/* User Information Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>User Information</Text>

        {isEditing ? (
          // Editing mode - show TextInputs
          <>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Username:</Text>
              <TextInput
                style={styles.infoInput}
                value={editedUsername}
                onChangeText={setEditedUsername}
                placeholder="Username"
              />
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email:</Text>
              <TextInput
                style={styles.infoInput}
                value={editedEmail}
                onChangeText={setEditedEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Save and Cancel buttons */}
            <View style={styles.editButtonsContainer}>
              <Pressable style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </>
        ) : (
          // View mode - show static text
          <>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Username:</Text>
              <Text style={styles.infoValue}>{user?.username || 'Loading...'}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user?.email || 'Loading...'}</Text>
            </View>

            {/* Edit Profile button */}
            <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Exit/Cancel button to go back to HomeScreen */}
      <Pressable
        style={styles.exitButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.exitButtonText}>Back to Home</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6d2c6',
  },
  // Header with avatar icon and logout button
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 10,
    //backgroundColor: '#d6d2c6',
  },
  headerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0a0404',
    overflow: 'hidden',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },
  headerDefaultAvatar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallIconHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0a0404',
    position: 'absolute',
    top: 8,
  },
  smallIconBody: {
    width: 20,
    height: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#0a0404',
    position: 'absolute',
    bottom: 6,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  largeAvatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#0a0404',
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  largeAvatar: {
    width: '100%',
    height: '100%',
  },
  largeDefaultAvatar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeIconHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a0404',
    position: 'absolute',
    top: 30,
  },
  largeIconBody: {
    width: 70,
    height: 40,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#0a0404',
    position: 'absolute',
    bottom: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#0a0404',
    fontWeight: '600',
  },
  avatarButton: {
    backgroundColor: '#0a0404',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  avatarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  // Avatar editing buttons
  avatarEditButtonsContainer: {
    width: '80%',
    gap: 10,
  },
  saveAvatarButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveAvatarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelAvatarButton: {
    backgroundColor: '#9E9E9E',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelAvatarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // User Information Section
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoInput: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0a0404',
  },
  editButton: {
    backgroundColor: '#0a0404',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6f6f6f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Exit button
  exitButton: {
    backgroundColor: '#0a0404',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});