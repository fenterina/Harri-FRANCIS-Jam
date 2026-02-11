import { supabase } from '../lib/supabase';
import Constants from 'expo-constants';
import { User } from '../types/types';


/**
 * DEBUG VERSION - Login function with detailed logging
 */
export async function login(username: User["username"], password: User["password"]) {
  try {
    console.log("=== LOGIN DEBUG START ===");
    console.log("Input username:", `${username}`, "Length:", username?.length);
    console.log("Input password:", `${password}`, "Length:", password?.length);
    
    // Step 1: First, let's see ALL users in the database
    console.log("\n--- Checking all users in database ---");
    const { data: allUsers, error: allUsersError } = await supabase
      .from('user_information')
      .select('user_id, username, password, email');
    
    if (allUsersError) {
      console.error("Error fetching all users:", allUsersError);
    } else {
      console.log("All users in database:");
      allUsers?.forEach((user, index) => {
        console.log(`  User ${index + 1}:`, {
          user_id: user.user_id,
          username: `'${user.username}'`,
          username_length: user.username?.length,
          password: `'${user.password}'`,
          password_length: user.password?.length,
          email: user.email
        });
      });
    }
    
    // Step 2: Search by username only
    console.log("\n--- Searching by username only ---");
    const { data: userByUsername, error: usernameError } = await supabase
      .from('user_information')
      .select('*')
      .eq('username', username);
    
    if (usernameError) {
      console.error("Username search error:", usernameError);
    } else {
      console.log("Found by username:", userByUsername);
      if (userByUsername && userByUsername.length > 0) {
        const foundUser = userByUsername[0];
        console.log("Stored password in DB:", `${foundUser.password}`);
        console.log("Input password:", `${password}`);
        console.log("Passwords match:", foundUser.password === password);
        console.log("Passwords match (strict):", foundUser.password === password && typeof foundUser.password === typeof password);
      }
    }
    
    // Step 3: Try the original query with both username and password
    console.log("\n--- Trying original query (username + password) ---");
    const { data, error } = await supabase
      .from('user_information')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();
    
    console.log("Query result - data:", data);
    console.log("Query result - error:", error);
    
    // If no match found
    if (!data && !error) {
      console.log("\n❌ No user found with these exact credentials");
      console.log("This could mean:");
      console.log("1. Username exists but password doesn't match");
      console.log("2. Username has extra spaces or different case");
      console.log("3. Password has extra spaces");
      console.log("=== LOGIN DEBUG END ===\n");
      return { data: null, error: 'Invalid username or password' };
    }
    
    // If database query failed
    if (error) {
      console.error('Database error:', error);
      console.log("=== LOGIN DEBUG END ===\n");
      return { data: null, error: 'Database error occurred' };
    }
    
    // User found - update their login status
    console.log("\n✅ User found! Updating login status...");
    const { error: updateError } = await supabase
      .from('user_information')
      .update({ is_logged_in: true })
      .eq('user_id', data.user_id);
    
    if (updateError) {
      console.error('Failed to update login status:', updateError);
    }
    
    console.log('Login successful for user_id:', data.user_id);
    console.log("=== LOGIN DEBUG END ===\n");
    return { data, error: null };
    
  } catch (err) {
    console.error('Login failed:', err);
    console.log("=== LOGIN DEBUG END ===\n");
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Register function - Creates new user account
 */
export async function register(credentials: User) {
  try {
    console.log('Registering user:', credentials.username);
    
    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('user_information')
      .select('username')
      .eq('username', credentials.username)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing user:', checkError);
      return { data: null, error: 'Database error occurred' };
    }
    
    if (existingUser) {
      console.log('Username already exists');
      return { data: null, error: 'Username already exists' };
    }
    
    // Check if email already exists
    const { data: existingEmail, error: emailCheckError } = await supabase
      .from('user_information')
      .select('email')
      .eq('email', credentials.email)
      .maybeSingle();
    
    if (emailCheckError) {
      console.error('Error checking existing email:', emailCheckError);
      return { data: null, error: 'Database error occurred' };
    }
    
    if (existingEmail) {
      console.log('Email already exists');
      return { data: null, error: 'Email already exists' };
    }
    
    // Insert new user into database
    const { data, error } = await supabase
      .from('user_information')
      .insert([
        { 
          username: credentials.username, 
          email: credentials.email, 
          password: credentials.password, 
          is_logged_in: false
        },
      ])
      .select();
    
    if (error) {
      console.error('Registration error:', error);
      return { data: null, error: 'Failed to create account' };
    }
    
    console.log('Registration successful for:', credentials.username);
    return { data, error: null };
    
  } catch (err) {
    console.error('Register failed:', err);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

// /**
//  * Logout function - Updates user's logged-in status and clears session
//  */
// export async function logout(userId: number) {
//   try {
//     const { error } = await supabase
//       .from('user_information')
//       .update({ is_logged_in: false })
//       .eq('user_id', userId);

//     if (error) {
//       console.error('Logout error:', error);
//       return { success: false, error };
//     }

//     console.log('Logout successful for user_id:', userId);
//     return { success: true, error: null };
//   } catch (err) {
//     console.error('Logout failed:', err);
//     return { success: false, error: err };
//   }
// }

// export async function register(credentials: User) {
//   try {
//     console.log('Registering user:', credentials);
    
//     const { data, error } = await supabase
//     .from('user_information')
//     .insert([
//         { username: credentials.username, 
//           email: credentials.email, 
//           password: credentials.password, 
//           is_logged_in: credentials.isLoggedIn},
//     ])
//     .select();

//     return { data, error };
//   } catch (err) {
//     throw new Error('Register failed: ' + err);
//   }
// }

/**
 * Logout function - Updates user's logged-in status and clears session
 * @param userId - The ID of the user logging out
 * @returns Success status
 */
export async function logout(userId: number) {
  try {
    // Update is_logged_in status to false in database
    const { error } = await supabase
      .from('user_information')
      .update({ is_logged_in: false })
      .eq('user_id', userId);

    if (error) {
      console.error('Logout error:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Logout failed:', err);
    return { success: false, error: err };
  }
}
