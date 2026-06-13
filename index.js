const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// ← remplacez votre ligne cors par celle-ci
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:5500', 'http://127.0.0.1:5500']
}));

app.use(express.json());

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/analyses', require('./routes/analyses'));
app.use('/api/profil',   require('./routes/profil'));

app.listen(process.env.PORT || 3000, () =>
  console.log(`ProbIA backend : http://localhost:${process.env.PORT || 3000}`)
);
app.use(cors({
  origin: [
    "https://walidbellouch.github.io/ProbIA-Informatique/",   // GitHub Pages
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ]
}));