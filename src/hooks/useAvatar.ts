/** Fetching the supabase's storage/buckets URL into the this avatar display
 * checking and converting file images 
 */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { uriToPath } from '../utils/image-to-path';

// Custom hook for managing user avatars in Supabase Storage
export function useAvatar(userId: string) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const BUCKET_NAME = 'avatars';

  const getAvatarPath = () => `${userId}.jpg`;
  

  /**
   * Fetch avatar URL from Supabase Storage
   */
  const fetchAvatar = async () => {
    try {
      setLoading(true);
      const avatarPath = getAvatarPath(); // e.g., "8a1f.../8a1f....jpg"

      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(avatarPath);
      if (data?.publicUrl) {
        setAvatarUrl(data.publicUrl)
      } else {
    throw new Error("No image saved"); 
      }
    } catch(error) {
      console.error(error);
      setAvatarUrl(null);

    } finally {
      setLoading(false);

    }
  };

  const compressImage = async (uri: string) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 500 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipulatedImage.uri;
    } catch (err) {
      console.error('Image compression error:', err);
      return uri;
    }
  };

  const uploadAvatar = async (source: 'camera' | 'gallery'): Promise<boolean> => {
    try {
      setLoading(true);

      const permissionResult =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert('Permission required to access ' + (source === 'camera' ? 'camera' : 'gallery'));
        return false;
      }

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });

      if (result.canceled) return false;

      const uri = result.assets?.[0]?.uri;
      if (!uri) {
        alert('No image selected');
        return false;
      }

      const imageData = await uriToPath(uri);
      const avatarPath = getAvatarPath();

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(avatarPath, imageData, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to upload avatar');
        return false;
      }

      await fetchAvatar();
      return true;
    } catch (err) {
      console.error('Upload avatar error:', err);
      alert('An error occurred while uploading avatar');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async () => {
    try {
      setLoading(true);
      const avatarPath = getAvatarPath();

      // console.log('Deleting avatar at path:', avatarPath);

      const { error } = await supabase.storage.from(BUCKET_NAME).remove([avatarPath]);

      if (error) {
        console.error('Delete error:', error);
        alert('Failed to delete avatar');
        return false;
      }

      setAvatarUrl(null);
      return true;
    } catch (err) {
      console.error('Delete avatar error:', err);
      alert('An error occurred while deleting avatar');
      return false;
    } finally {
      setLoading(false);
    }
  };

    /**
     * Upload avatar from a selected URI 
     */
    const uploadAvatarFromUri = async (uri: string): Promise<boolean> => {
      try {
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
        
        await fetchAvatar();
        return true;
      } catch (err) {
        // console.error('Upload from URI error:', err);
        return false;
      }
    };

  useEffect(() => {
    fetchAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    avatarUrl,
    loading,
    uploadAvatar,
    deleteAvatar,
    uploadAvatarFromUri,
    refreshAvatar: fetchAvatar,
  };
}