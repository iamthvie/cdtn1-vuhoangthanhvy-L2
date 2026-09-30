const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'L2 Smoke test passed successfully!',
    student: 'Vu Hoang Thanh Vy' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});