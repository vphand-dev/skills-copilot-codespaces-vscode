// Create web server
// 1. Load the required modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// 2. Define the routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/comments', (req, res) => {
    fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('An error occurred while trying to read the comments file');
            return;
        }
        res.json(JSON.parse(data));
    });
});
app.post('/comments', (req, res) => {
    fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('An error occurred while trying to read the comments file');
            return;
        }
        const comments = JSON.parse(data);
        comments.push(req.body);
        fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(500).send('An error occurred while trying to write the comment to the file');
                return;
            }
            res.status(201).send('Comment saved to file');
        });
    });
});
// 3. Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
// 4. Export the app
module.exports = app;