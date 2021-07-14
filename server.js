const express = require('express');
const path = require('path');
const fs = require('fs');
const uniquid = require('uniquid');

const app = express();

const PORT = process.env.PORT || 3000;

// routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//add db to list of static directories
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'db')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'db/db.json'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/api/notes', (req, res) => {
  var newNote = req.body;
  var newId = uniquid();
  newNote.id = newId;

  fs.readFile('db/db.json', (error, data) => {
    if(error) throw error;
    
    let notes = JSON.parse(data);
    notes.push(newNote);
    
    fs.writeFile('db/db.json', JSON.stringify(notes), 'utf-8', (error) => {
      (error) ? console.log(error) : console.log("Note successfully saved.");
    });
  });

  res.redirect('/notes');
});

app.delete('/api/notes', (req, res) => {
  var noteId = req.body.id;

  fs.readFile('db/db.json', (error, data) => {
    if(error) throw error;

    let notes = JSON.parse(data);
    var filtered = notes.filter(note => note.id !== noteId)
    
    fs.writeFile('db/db.json', JSON.stringify(filtered), 'utf-8', (error) => {
      (error) ? console.log(error) : console.log("Note successfully deleted.");
    });
  });

  res.json({result: "success"});
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));