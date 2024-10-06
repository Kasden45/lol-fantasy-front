const port = process.env.PORT || 8080

// wire up the module
const express = require('express')
const path = require('path');
// create server instance
const app = express()
// bind the request to an absolute path or relative to the CWD
app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
// start the server
app.listen(port, () => console.log(`Listening on port ${port}`))