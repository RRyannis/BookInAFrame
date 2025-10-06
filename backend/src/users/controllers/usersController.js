// const supabase = require("../../db/createClient");

// const createUserAndProfile = async (req, res) => {

//     const { email, password, first_name = '', last_name = '' } = req.body;

//     try {
//         const { data: user, error: userError } = await supabase.auth.admin.createUser({
//             email,
//             password,
//             email_confirm: true, // optional: marks email as confirmed
//             user_metadata: { first_name, last_name }
//         });

//         if (userError) {
//             return res.status(400).json({ error: userError.message });
//         }
//         const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .insert({
//             id: user.id,
//             first_name,
//             last_name
//         })
//         .select()
//         .single();

//         if (profileError) {
//             return res.status(400).json({ error: profileError.message });
//         }

//         return res.status(201).json({ user, profile });
//     } catch (err){
//         console.error(err);
//         return res.status(500).json({ error: 'Server error' });
//     }
// };

// module.exports = { createUserAndProfile };
// src/users/controllers/usersController.js
const supabase = require('../../db/createClient');

const createUserAndProfile = async (req, res) => {
  const { email, password, first_name = '', last_name = '' } = req.body;

  try {
    // 1️⃣ Create the user in Supabase Auth
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name, last_name }
    });

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    // 2️⃣ Insert a corresponding profile row manually
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        first_name,
        last_name
      })
      .select()
      .single();

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    return res.status(201).json({ user, profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createUserAndProfile };
