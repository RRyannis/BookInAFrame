app.get('/articles', async (_, res) => {
    try{
        const { data, error } = await supabase.from("posts").select();
        console.log(data);
        return res.send(data);
    } catch(error) {
        return res.send({ error });
    }
});

app.get('/articles/:id', async (req, res) => {
    try{
        const { data, error } = await supabase.from("posts").select().eq("id", req.params.id);
        console.log(data);
        return res.send(data);
    } catch (error) {
        return res.send({ error });
    }
});

app.post('/articles', async (req, res) => {
    try{
        console.log(req.body);
        const { data, error } = await supabase.from("posts").insert([req.body]).select();
        if (error){
            return res.status(400).json(error);
        }
        res.status(200).json(data);
    }catch(error){
        res.send({ error });
    }
});

app.patch('/articles/:id', async (req, res) => {
    console.log(req.params);
    try{
        const { data: updatedData, error } = await supabase.from("posts").update(req.body).eq("id", req.params.id).select();
        if (error) {
            return res.status(400).json(error);
        }
        return res.status(200).send(updatedData);
    }catch(error){
        res.send({ error });
    }
});

app.delete('/articles/:id', async (req, res) => {
    try{
        const { data, error } = await supabase.from("posts").delete().eq("id", req.params.id).select();
        if (error) {
        return res.status(400).json(error);
        }
        return res.send(data);
    }catch(error){
        res.send({ error });
    }
});
