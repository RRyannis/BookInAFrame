const supabase = require('../../db/createClient');

const getBooks = async (req, res) => {
    try{
        const { data, error } = await supabase.from('books').select();

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

const getBook = async (req, res) => {
    try{
        const { id } = req.params;
        const { data, error } = await supabase.from('books').select().eq("id", id);

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

const createBook = async (req, res) => {
    const {
    google_books_id,
    title,
    subtitle,
    authors,
    publisher,
    published_date,
    description,
    page_count,
    language,
    isbn_13,
    isbn_10,
    thumbnail_url,
    large_cover_url,
    average_rating,
    ratings_count,
    categories
    } = req.body;

    if (!google_books_id || !title || !authors) {
    return res.status(400).json({ error: 'Missing required book fields: google_books_id, title, authors.' });
    }

    const bookData = {
    google_books_id,
    title,
    subtitle,
    authors,
    publisher,
    published_date,
    description,
    page_count,
    language,
    isbn_13,
    isbn_10,
    thumbnail_url,
    large_cover_url,
    average_rating,
    ratings_count,
    categories,
    // updated_at can be set here or by a database trigger
    updated_at: new Date().toISOString()
    };

    try{
        const { data, error } = await supabase.from('books').insert([bookData]).select();

        if (error) {
            console.error("Error inserting book:", error.message);
            return res.status(400).json({ error: error.message });
        }

        console.log(data);
        return res.status(201).json(data[0]);

    } catch (err){
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

const updateBook = async (req, res) => {
    const { id } = req.params;

    
    const allowedUpdateFields = [
    'title', 'subtitle', 'authors', 'publisher', 'published_date',
    'description', 'page_count', 'language',
    'isbn_13', 'isbn_10', // Allow updating these, but remember unique constraints
    'thumbnail_url', 'large_cover_url',
    'average_rating', 'ratings_count', 'categories'];

    const updateData = {};

    for (const field of allowedUpdateFields) {
        if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
        }
    }

    updateData.updated_at = new Date().toISOString();

    if (Object.keys(updateData).length <= 1 && updateData.updated_at) {
        return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    try{
        const { data, error } = await supabase.from('books').update(updateData).eq("id", id).select();
        
        if (error) {
        console.error("Error updating book:", error.message);
        return res.status(400).json({ error: error.message });
        }

        if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Book not found.' });
        }

        console.log(data);
        return res.status(201).json(data[0]);

    } catch (err){
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

const deleteBook = async (req, res) => {
    const { id } = req.params;

    try{
        const { error, count } = await supabase.from('books').delete().eq("id", id);

        if (error) {
            console.error("Error deleting book:", error.message);
            return res.status(400).json({ error: error.message });
        }

        if (count === 0) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        
        return res.status(201).json({ message: `Book with ID ${id} deleted successfully.` });
    } catch (err){
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
};