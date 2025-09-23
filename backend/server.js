require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(express.json());
// const supabase = createClient(process.env.DATABASE_URL,process.env.DATABASE_KEY);

app.get('/', (req, res) => {
    res.json({ info: "Express app with supabase"});
})

app.listen(3000, () => {
    console.log(new Date().toLocaleTimeString() + `: Server is running on port ${process.env.PORT}`)
})