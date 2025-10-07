const supabase = require("../../db/createClient");

const getUsers = async (req, res) => {
  try{
    const { data, error } = await supabase.from('profiles').select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    console.log(data);
    return res.status(202).json(data);

  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
  }
}
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

module.exports = { 
  getUsers,
  createUserAndProfile };

