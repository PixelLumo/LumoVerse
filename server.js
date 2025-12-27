const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// ✅ FRONTEND (STATIC FILES)
app.use(express.static(__dirname));

// ✅ API ROUTES ONLY
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/user', require('./routes/user.routes'));

// ✅ TEST ROUTE
app.get('/__test', (req, res) => {
  res.send('ROUTES WORK');
});

// ✅ FALLBACK (optional, but safe)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
