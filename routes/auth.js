const router  = require('express').Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Inscription
router.post('/register', async (req, res) => {
  const { email, password, nom } = req.body;
  if (!email || !password || !nom)
    return res.status(400).json({ error: 'Champs manquants' });

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email, password, email_confirm: true
  });
  if (error) return res.status(400).json({ error: error.message });

  // Créer le profil
  await supabaseAdmin.from('profiles').insert({ id: data.user.id, nom });
  res.json({ message: 'Compte créé', userId: data.user.id });
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: 'Identifiants incorrects' });

  // Récupérer le profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('nom')
    .eq('id', data.user.id)
    .single();

  res.json({
    token: data.session.access_token,
    user:  { id: data.user.id, email: data.user.email, nom: profile?.nom }
  });
});
 module.exports = router; // ← cette ligne doit exister