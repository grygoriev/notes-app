const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');

const notesPath = path.join(__dirname, 'db.json');

async function addNote(title) {
    // const notes = require('./db.json')
    // const buffer = await fs.readFile(notesPath);
    // const notes = Buffer.from(buffer).toString('utf-8');

    const notes = await getNotes();
    const note = {
        title,
        id: Date.now().toString(),
    }

    notes.push(note)

    await fs.writeFile(notesPath, JSON.stringify(notes))
    console.log(chalk.bgGreen('Note was added successfully.'))
}

async function removeNote(id) {
    const notes = await getNotes();
    const initialLength = notes.length;
    const filteredNotes = notes.filter(note => note.id !== id);

    if (filteredNotes.length === initialLength) {
        console.log(chalk.yellow(`Note with id ${id} not found.`));
        return;
    }

    await fs.writeFile(notesPath, JSON.stringify(filteredNotes))
    console.log(chalk.bgRed('Note was removed successfully.'))
}

async function getNotes() {
    const notes = await fs.readFile(notesPath, { encoding: 'utf8' });
    return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function printNotes() {
    const notes = await getNotes();

    console.log(chalk.bgBlue('Here is the list of notes:'))
    notes.forEach((note) => {
        console.log(chalk.blue(note.id, note.title));
    })
}

module.exports = {
    addNote, printNotes, removeNote
}