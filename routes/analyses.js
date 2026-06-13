const router = require('express').Router();
const auth   = require('../middleware/auth');

// Sauvegarder une analyse
router.post('/', auth, async (req, res) => {
  const { mode, document_texte, scores, justifications,
          objectifs, recommandations, score_total, qualificatif, metadata } = req.body;

  const { data, error } = await req.supabase
    .from('analyses')
    .insert({
      user_id: req.user.id,
      mode, document_texte, scores, justifications,
      objectifs, recommandations, score_total, qualificatif,
      metadata: metadata || {}
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Historique de l'utilisateur
router.get('/', auth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('analyses')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Supprimer une analyse
router.delete('/:id', auth, async (req, res) => {
  const { error } = await req.supabase
    .from('analyses')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id); // sécurité : l'user ne supprime que les siennes

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Supprimée' });
   
});
 module.exports = router; // ← cette ligne doit exister