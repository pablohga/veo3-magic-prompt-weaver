const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://utypfdcnprkhjvcyoqdc.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('id, email');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
