const express = require('express');
const path = require('path');
const app = express();
const port = 3002;

// Serve static files from the "public" directory
app.use(express.static('public'));

// This would be a mapping of NFC card IDs to YouTube video IDs
// In a real application, you might store this data in a database
const songMap = {
  '36955': 'https://www.youtube.com/watch?v=Yw6u6YkTgQ4'
};

app.get('/playSong/:nfcId', (req, res) => {
  const nfcId = req.params.nfcId;
  const videoId = songMap[nfcId];
  if (!videoId) {
    return res.status(404).send('NFC card not found');
  }

  // Here, we would trigger the YouTube video to play. 
  // However, because we can't do that directly from the server, 
  // we instead return the YouTube video ID and let the client handle playing the video.
  res.json({ videoId });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
