const router = require('express').Router();
const auth   = require('../middleware/auth');

// GET /api/profil — récupérer le profil
router.get('/', auth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('profiles')
    .select('nom, email:auth.users(email)')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    id:    req.user.id,
    email: req.user.email,
    nom:   data?.nom || ''
  });
});

// PUT /api/profil — modifier le profil
router.put('/', auth, async (req, res) => {
  const { nom } = req.body;
  if (!nom) return res.status(400).json({ error: 'Nom requis' });

  const { error } = await req.supabase
    .from('profiles')
    .update({ nom })
    .eq('id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Profil mis à jour', nom });
});

// PUT /api/profil/password — changer le mot de passe
router.put('/password', auth, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8)
    return res.status(400).json({ error: 'Mot de passe trop court' });

  const { error } = await req.supabase.auth.updateUser({ password: newPassword });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Mot de passe modifié' });
});

// DELETE /api/profil — supprimer le compte
router.delete('/', auth, async (req, res) => {
  const { createClient } = require('@supabase/supabase-js');
  const adminClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { error } = await adminClient.auth.admin.deleteUser(req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Compte supprimé' });
});

module.exports = router;