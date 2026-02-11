// // 


// /** Fetching the supabase's storage/buckets URL into the this avatar display
//  * checking and converting file images 
//  */

// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
// import * as ImagePicker from 'expo-image-picker';
// import * as ImageManipulator from 'expo-image-manipulator';

// // Custom hook for managing user avatars in Supabase Storage
// export function useAvatar(userId: number) {
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const BUCKET_NAME = 'avatars';

//   // ✅ FIX 1: Consistent path with folder structure
//   const getAvatarPath = () => `${userId}/${userId}.jpg`;

//   /**
//    * Fetch avatar URL from Supabase Storage
//    */
//   const fetchAvatar = async () => {
//     try {
//       setLoading(true);
//       const avatarPath = getAvatarPath(); // e.g., "8/8.jpg"

//       console.log('Fetching avatar for path:', avatarPath);

//       // ✅ FIX 2: List files in USER's folder, not root
//       const { data: files, error: listError } = await supabase.storage
//         .from(BUCKET_NAME)
//         .list(userId.toString(), { // List in folder "8", not root ""
//           limit: 100,
//           offset: 0,
//           sortBy: { column: 'name', order: 'asc' }
//         });

//       if (listError) {
//         console.error('List files error:', listError);
//         setAvatarUrl(null);
//         return;
//       }

//       console.log(`Files in folder ${userId}:`, files?.map(f => f.name));

//       // ✅ FIX 3: Check for file name only (not full path with folder)
//       // Files list returns just the filename, not the full path
//       const avatarExists = files?.some(file => file.name === `${userId}.jpg`);

//       console.log(`Avatar ${userId}.jpg exists in folder:`, avatarExists);

//       if (avatarExists) {
//         const { data } = supabase.storage
//           .from(BUCKET_NAME)
//           .getPublicUrl(avatarPath);

//         const urlWithTimestamp = `${data.publicUrl}?t=${new Date().getTime()}`;
//         console.log('Avatar URL:', urlWithTimestamp);
//         setAvatarUrl(urlWithTimestamp);
//       } else {
//         console.log('No avatar found for user:', userId);
//         setAvatarUrl(null);
//       }
//     } catch (err) {
//       console.error('Fetch avatar error:', err);
//       setAvatarUrl(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const compressImage = async (uri: string) => {
//     try {
//       const manipulatedImage = await ImageManipulator.manipulateAsync(
//         uri,
//         [{ resize: { width: 500 } }],
//         { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
//       );
//       return manipulatedImage.uri;
//     } catch (err) {
//       console.error('Image compression error:', err);
//       return uri;
//     }
//   };

//   const uploadAvatar = async (source: 'camera' | 'gallery') => {
//     try {
//       setLoading(true);

//       let permissionResult;
//       if (source === 'camera') {
//         permissionResult = await ImagePicker.requestCameraPermissionsAsync();
//       } else {
//         permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       }

//       if (!permissionResult.granted) {
//         alert('Permission required to access ' + (source === 'camera' ? 'camera' : 'gallery'));
//         return false;
//       }

//       const result = source === 'camera'
//         ? await ImagePicker.launchCameraAsync({
//             mediaTypes: ['images'], // ✅ FIX 4: Use array instead of deprecated MediaTypeOptions
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 1,
//           })
//         : await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ['images'], // ✅ FIX 4: Use array instead of deprecated MediaTypeOptions
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 1,
//           });

//       if (result.canceled) {
//         return false;
//       }

//       const compressedUri = await compressImage(result.assets[0].uri);
//       const response = await fetch(compressedUri);
//       const blob = await response.blob();
//       const avatarPath = getAvatarPath();

//       console.log('Uploading to path:', avatarPath);

//       const { error: uploadError } = await supabase.storage
//         .from(BUCKET_NAME)
//         .upload(avatarPath, blob, {
//           contentType: 'image/jpeg',
//           upsert: true,
//         });

//       if (uploadError) {
//         console.error('Upload error:', uploadError);
//         console.error('Error details:', JSON.stringify(uploadError, null, 2));
//         alert('Failed to upload avatar');
//         return false;
//       }

//       console.log('Upload successful!');
//       await fetchAvatar();
//       return true;
//     } catch (err) {
//       console.error('Upload avatar error:', err);
//       alert('An error occurred while uploading avatar');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteAvatar = async () => {
//     try {
//       setLoading(true);
//       const avatarPath = getAvatarPath();

//       console.log('Deleting avatar at path:', avatarPath);

//       const { error } = await supabase.storage
//         .from(BUCKET_NAME)
//         .remove([avatarPath]);

//       if (error) {
//         console.error('Delete error:', error);
//         alert('Failed to delete avatar');
//         return false;
//       }

//       console.log('Delete successful!');
//       setAvatarUrl(null);
//       return true;
//     } catch (err) {
//       console.error('Delete avatar error:', err);
//       alert('An error occurred while deleting avatar');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAvatar();
//   }, [userId]);

//   return {
//     avatarUrl,
//     loading,
//     uploadAvatar,
//     deleteAvatar,
//     refreshAvatar: fetchAvatar,
//   };
// }

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

// Custom hook for managing user avatars in Supabase Storage
// NOTE: userId must be the Supabase auth user id (UUID string)
export function useAvatar(userId: string) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const BUCKET_NAME = 'avatars';

  // Use folder structure: "<user-uuid>/<user-uuid>.jpg"
  const getAvatarPath = () => `${userId}/${userId}.jpg`;

  /**
   * Fetch avatar URL from Supabase Storage
   */
  const fetchAvatar = async () => {
    if (!userId) {
      setAvatarUrl(null);
      return;
    }

    try {
      setLoading(true);
      const avatarPath = getAvatarPath(); // e.g., "8a1f.../8a1f....jpg"
      console.log('Fetching avatar for path:', avatarPath);

      // List files inside the user's folder to confirm presence
      const { data: files, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(userId, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'desc' },
        });

      if (listError) {
        console.error('List files error:', listError);
        setAvatarUrl(null);
        return;
      }

      const avatarExists = files?.some((file) => file.name === `${userId}.jpg`);
        console.log(`Files in folder ${userId}:`, files?.map((f) => f.name));
        console.log(`Avatar ${userId}.jpg exists in folder:`, avatarExists);      


      if (avatarExists) {
        // If your bucket is public you can use getPublicUrl
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(avatarPath);

        const publicUrl = data?.publicUrl ?? null;
        if (publicUrl) {
          const urlWithTimestamp = `${publicUrl}?t=${new Date().getTime()}`; // cache-busting
          setAvatarUrl(urlWithTimestamp);
          console.log(`Files in folderfaifa ${userId}:`, files?.map((f) => f.name));
          console.log(`Avatarwfasfiasn ${userId}.jpg exists in folder:`, avatarExists);
        } else {
          setAvatarUrl(null);
          console.log('fetchingg');
        }
      } else {
        setAvatarUrl(null);
        console.log('gfq8afwohgfdo HAHAHAHAH');
      }
    } catch (err) {
      console.error('Fetch avatar error:', err);
      setAvatarUrl(null);
    } finally {
      setLoading(false);
      return;
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

  const uploadAvatar = async (source: 'camera' | 'gallery') => {
    try {
      setLoading(true);

      let permissionResult;
      if (source === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

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

      if ((result as any).canceled) {
        return false;
      }

      const uri = (result as any).assets?.[0]?.uri;
      if (!uri) {
        alert('No image selected');
        return false;
      }

      const compressedUri = await compressImage(uri);
      const response = await fetch(compressedUri);
      const blob = await response.blob();
      const avatarPath = getAvatarPath();

      console.log('Uploading to path:', avatarPath);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(avatarPath, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to upload avatar');
        return false;
      }

      console.log('Upload successful!');
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

      console.log('Deleting avatar at path:', avatarPath);

      const { error } = await supabase.storage.from(BUCKET_NAME).remove([avatarPath]);

      if (error) {
        console.error('Delete error:', error);
        alert('Failed to delete avatar');
        return false;
      }

      console.log('Delete successful!');
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

  // Upload helper that accepts a URI (keeps same behavior as ProfileScreen)
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

      if (!manipulatedImage.base64) {
        console.error('No base64 produced from manipulator');
        return false;
      }

      // Convert base64 to Uint8Array (supabase-js accepts this)
      const base64 = manipulatedImage.base64;
      const byteString = atob(base64);
      const arrayBuffer = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i);
      }

      const avatarPath = getAvatarPath();

      const { error } = await supabase.storage.from(BUCKET_NAME).upload(avatarPath, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

      if (error) {
        console.error('Upload error (fromUri):', error);
        alert(`Upload error: ${error.message}`);
        return false;
      }

      await fetchAvatar();
      return true;
    } catch (err) {
      console.error('Upload from URI error:', err);
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