require('dotenv').config();
const express = require('express');
// const { createClient } = require('@supabase/supabase-js');
const supabase = require('../backend/src/db/createClient');
const postsRouter = require('./src/posts/routes/postsRoutes');
const profilesRouter = require('./src/users/routes/usersRoutes');


const app = express();

app.use(express.json());
// const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY);

app.get('/', (req, res) => {
    res.json({ info: "Express app with supabase"});
})

app.listen(3000, () => {
    console.log(new Date().toLocaleTimeString() + `: Server is running on port ${process.env.PORT}`)
})

app.use(postsRouter);
app.use(profilesRouter);
