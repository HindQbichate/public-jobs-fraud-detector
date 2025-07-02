require('dotenv').config();

const app = require('./app');

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📘 Swagger docs available at /docs`);
});
