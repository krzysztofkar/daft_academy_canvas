const express = require('express')
const app = express();
const path = require('path');

app.use(express.static(__dirname + "/public/"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})

const port = process.env.PORT || 3333;

app.listen(port, () => console.log(`Listening on port ${port}...`));
