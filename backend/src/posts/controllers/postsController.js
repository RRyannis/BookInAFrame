const supabase = require("../../db/createClient");

const getPosts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('posts').select('id, image_url, caption, created_at');

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

const getPost = async (req, res) => {
  try{
    const { id } = req.params;
    const { data, error } = await supabase.from('posts').select(`
    id,
    image_url,
    caption,
    created_at,
    profiles ( username, avatar_url ),
    books ( title, author )
  `).eq("id", id).single();

    if(error){
      return res.status(400).json({ error: error.message });
    }

    const post = {
      ...data,
      likes_count: data.likes[0]?.count ?? 0,
    };
    delete post.likes;

    console.log(post);
    return res.status(201).json(post);
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

const createPost = async (req, res) => {
  try{
    const { data, error } = await supabase.from('posts').insert([req.body]).select();
    if (error){
      return res.status(400).json(error);
    }
    return res.status(201).json(data);

  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;

  const allowedUpdateFields = [];

  const updateData = {};

  for (const field of allowedUpdateFields) {
        if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
        }
  }
  //updateData.updated_at = new Date().toISOString();

  
  if (Object.keys(updateData).length <= 1 && updateData.updated_at) {
      return res.status(400).json({ error: 'No valid fields provided for update.' });
  }
  try{
      const { data, error } = await supabase.from('posts').update(updateData).eq("id", id).select();
        
      if (error) {
      console.error("Error updating post:", error.message);
      return res.status(400).json({ error: error.message });
      }

      if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
      }

      console.log(data);
      return res.status(201).json(data[0]);

    } catch (err){
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try{
    const { error, count } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      console.error("Error deleting post:", error.message);
      return res.status(400).json({ error: error.message });
    }

    if (count === 0){
      return res.status(404).json({ message: 'Post not found.' });
    }

    return res.status(201).json({ message: `Post with ID ${id} deleted successfully.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}; 


module.exports = { 
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
};










// app.get('/articles', async (_, res) => {
//     try{
//         const { data, error } = await supabase.from("posts").select();
//         console.log(data);
//         return res.send(data);
//     } catch(error) {
//         return res.send({ error });
//     }
// });

// app.get('/articles/:id', async (req, res) => {
//     try{
//         const { data, error } = await supabase.from("posts").select().eq("id", req.params.id);
//         console.log(data);
//         return res.send(data);
//     } catch (error) {
//         return res.send({ error });
//     }
// });

// app.post('/articles', async (req, res) => {
//     try{
//         console.log(req.body);
//         const { data, error } = await supabase.from("posts").insert([req.body]).select();
//         if (error){
//             return res.status(400).json(error);
//         }
//         res.status(200).json(data);
//     }catch(error){
//         res.send({ error });
//     }
// });

// app.patch('/articles/:id', async (req, res) => {
//     console.log(req.params);
//     try{
//         const { data: updatedData, error } = await supabase.from("posts").update(req.body).eq("id", req.params.id).select();
//         if (error) {
//             return res.status(400).json(error);
//         }
//         return res.status(200).send(updatedData);
//     }catch(error){
//         res.send({ error });
//     }
// });

// app.delete('/articles/:id', async (req, res) => {
//     try{
//         const { data, error } = await supabase.from("posts").delete().eq("id", req.params.id).select();
//         if (error) {
//         return res.status(400).json(error);
//         }
//         return res.send(data);
//     }catch(error){
//         res.send({ error });
//     }
// });
