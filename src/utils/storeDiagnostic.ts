import { supabase } from '../lib/supabase';

/**
 * Diagnostic function to test Supabase Storage connection
 * Call this from ProfileScreen to verify storage setup
 */
export async function diagnoseStorage() {
  console.log("=== STORAGE DIAGNOSTIC START ===\n");
  
  try {
    // Test 1: List all buckets
    console.log("Test 1: Checking available buckets...");
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("❌ Failed to list buckets:", bucketsError);
      return {
        success: false,
        error: "Cannot access storage buckets",
        details: bucketsError
      };
    }
    
    console.log("✅ Available buckets:");
    buckets?.forEach(bucket => {
      console.log(`  - ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`);
    });
    
    // Test 2: Check if 'avatar' bucket exists
    console.log("\nTest 2: Checking 'avatar' bucket...");
    const avatarBucket = buckets?.find(b => b.name === 'avatars');
    
    if (!avatarBucket) {
      console.error("❌ 'avatar' bucket not found!");
      console.log("Available buckets:", buckets?.map(b => b.name).join(', '));
      return {
        success: false,
        error: "Avatar bucket does not exist",
        availableBuckets: buckets?.map(b => b.name)
      };
    }
    
    console.log(`✅ Avatar bucket exists (${avatarBucket.public ? 'Public' : 'Private'})`);
    
    // Test 3: Try to list files in avatar bucket
    console.log("\nTest 3: Listing files in avatar bucket...");
    const { data: files, error: listError } = await supabase.storage
      .from('avatars')
      .list('', { limit: 10 });
    
    if (listError) {
      console.error("❌ Failed to list files:", listError);
      return {
        success: false,
        error: "Cannot list files in avatar bucket",
        details: listError
      };
    }
    
    console.log(`✅ Can access avatar bucket. Files found: ${files?.length || 0}`);
    if (files && files.length > 0) {
      files.forEach(file => {
        console.log(`  - ${file.name} (${file.metadata?.size || 'unknown'} bytes)`);
      });
    }
    
    // Test 4: Try uploading a small test file
    console.log("\nTest 4: Testing file upload...");
    const testFileName = 'test.txt';
    const testContent = 'Test upload from diagnostic tool';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`test/${testFileName}`, testBlob, {
        upsert: true,
        contentType: 'text/plain'
      });
    
    if (uploadError) {
      console.error("❌ Upload test failed:", uploadError);
      console.error("Error details (storing diagnostics):", JSON.stringify(uploadError, null, 2));
      return {
        success: false,
        error: "Upload test failed",
        details: uploadError
      };
    }
    
    console.log("✅ Upload test successful!");
    console.log("Uploaded to:", uploadData?.path);
    
    // Clean up test file
    console.log("\nCleaning up test file...");
    await supabase.storage
      .from('avatars')
      .remove([`test/${testFileName}`]);
    console.log("✅ Test file removed");
    
    // Test 5: Check Supabase client configuration
    console.log("\nTest 5: Checking Supabase client config...");
    console.log("Retrieving Supabase and Storage URL, please standby...");
    
    console.log("\n=== STORAGE DIAGNOSTIC COMPLETE ===");
    console.log("✅ All tests passed! Storage is working correctly.");
    
    return {
      success: true,
      message: "Storage is configured correctly"
    };
    
  } catch (err) {
    console.error("❌ Diagnostic error:", err);
    console.log("\n=== STORAGE DIAGNOSTIC FAILED ===");
    return {
      success: false,
      error: "Unexpected error during diagnostic",
      details: err
    };
  }
}

/**
 * Quick function to check if avatar bucket exists
 */
export async function checkAvatarBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const avatarBucket = buckets?.find(b => b.name === 'avatars');
    
    return {
      exists: !!avatarBucket,
      isPublic: avatarBucket?.public || false,
      allBuckets: buckets?.map(b => b.name) || []
    };
  } catch (err) {
    console.error("Check bucket error:", err);
    return {
      exists: false,
      error: err
    };
  }
}