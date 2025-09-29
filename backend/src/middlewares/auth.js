require('dotenv').config();
const { createClient }  = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_KEY);

module.exprots = async function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');

  // Verify the token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Attach the user to the request
  req.user = user;
  next();
}
