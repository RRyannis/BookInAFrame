const supabase = require("../../db/createClient");

const getUsers = async (req, res) => {
  try{
    const { data, error } = await supabase.from('profiles').select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    console.log(data);
    return res.status(201).json(data);

  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
  }
}
const getUser = async (req, res) => {
  const { id } = req.params;
  try{
    const { data, error } = await supabase.from('profiles').select().eq("id", id);

     if (error) {
            return res.status(400).json({ error: error.message });
      }

      console.log(data);
      return res.status(201).json(data);

  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
  }
};
const createUserAndProfile = async (req, res) => {
  // Directly destructure full_name from req.body
  const { email, password, full_name = '', avatar_url = '' } = req.body;

  try {
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        // Pass full_name directly from req.body
        full_name: full_name,
        avatar_url: avatar_url
      }
    });

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    const { data: profile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, website, updated_at')
      .eq('id', user.user.id)
      .single();

    if (profileFetchError) {
      console.warn("Failed to fetch profile after creation:", profileFetchError.message);
      return res.status(201).json({ user: user.user, profile: null, warning: "Profile fetch failed, but user created." });
    }

    return res.status(201).json({ user: user.user, profile });

  } catch (err) {
    console.error("Server error during user creation:", err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

// In your usersController.js

const updateUserProfile = async (req, res) => {
  const { id } = req.params; // The profile ID from the URL
  const authId = req.user ? req.user.id : null; // Assuming JWT middleware attaches user to req.user

  // Ensure the user trying to update is the owner of the profile
  if (!authId || authId !== id) {
    return res.status(403).json({ message: 'Unauthorized: You can only update your own profile.' });
  }

  // Define allowed fields for update for security
  const allowedUpdateFields = ['username', 'full_name', 'avatar_url', 'website'];
  const updateData = {};

  for (const field of allowedUpdateFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  // Ensure there's at least one field to update
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update.' });
  }

  // Always set updated_at
  updateData.updated_at = new Date().toISOString();

  try {
    // This insert must be done with an authenticated client (user's JWT)
    // RLS will ensure 'auth.uid() = id' is true
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id) // Match the profile by ID
      .select(); // Return the updated row

    if (error) {
      console.error("Error updating user profile:", error.message);
      return res.status(400).json({ error: error.message });
    }

    if (!updatedProfile || updatedProfile.length === 0) {
      // This case should ideally not be reached if the auth check passed,
      // but it's good for robustness (e.g., if ID was valid but no data changed)
      return res.status(404).json({ message: 'User profile not found or no changes made.' });
    }

    return res.status(200).json(updatedProfile[0]); // Return the single updated profile

  } catch (err) {
    console.error("Server error updating user profile:", err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try{
      const { error, count} = await supabase.from('profiles').delete().eq("id", id);

      if (error){
        return res.status(400).json({ error: error.message });
      }

      if (count === 0) {
        return res.status(400).json({ msg: 'User not found.'});
      }

      return res.status(201).json({ message: `User with ID ${id} deleted successfully.` });
    

  } catch (err) {
    console.error("Server error during user creation:", err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}

module.exports = { 
  getUsers,
  getUser,
  createUserAndProfile,
  deleteUser 
};

