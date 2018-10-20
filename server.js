const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});
app.get('/api/hello-again', (req, res) => {
  res.send({ express: 'Hello AGAIN From Express!' });
});

if (process.env.NODE_ENV === 'production') {
  app.get('/api/hello-from-prod', (req, res) => {
    res.send({ express: 'Hello from prod!' });
  });
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
