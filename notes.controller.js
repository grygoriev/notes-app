// const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');
// const mongoose = require("mongoose");
const Note = require('./models/Note');

// const notesPath = path.join(__dirname, 'db.json');

async function addNote(title, owner) {
    await Note.create({title, owner})

    // const notes = require('./db.json')
    // const buffer = await fs.readFile(notesPath);
    // const notes = Buffer.from(buffer).toString('utf-8');

    // const notes = await getNotes();
    // const note = {
    //     title,
    //     id: Date.now().toString(),
    // }
    //
    // notes.push(note)
    //
    // await fs.writeFile(notesPath, JSON.stringify(notes))
    // console.log(chalk.bgGreen('Note was added successfully.'))
}

async function removeNote(id, owner) {
    const result = await Note.deleteOne({_id: id, owner})

    if (result.matchedCount === 0) {
        throw new Error('No note to delete')
    }

    console.log(chalk.bgRed('Note was removed successfully.'))
    // const notes = await getNotes();
    // const initialLength = notes.length;
    // const filteredNotes = notes.filter(note => note.id !== id);
    //
    // if (filteredNotes.length === initialLength) {
    //     console.log(chalk.yellow(`Note with id ${id} not found.`));
    //     return;
    // }
    //
    // await fs.writeFile(notesPath, JSON.stringify(filteredNotes))
}

async function changeNote(id, title, owner) {
    const result = await Note.updateOne({_id: id, owner}, {title})

    if (result.matchedCount === 0) {
        throw new Error('No note to edit')
    }

    console.log(chalk.bgYellow('Note was edited successfully.'))
    // const notes = await getNotes();
    // const updatedNotes = notes.map(note =>
    //     note.id === id ? { ...note, title: title } : note
    // );
    //
    // await fs.writeFile(notesPath, JSON.stringify(updatedNotes))
}

async function getNotes() {
    const notes = await Note.find();
    return notes;
}

async function printNotes() {
    const notes = await getNotes();

    console.log(chalk.bgBlue('Here is the list of notes:'))
    notes.forEach((note) => {
        console.log(chalk.blue(note.id, note.title));
    })
}

module.exports = {
    addNote, getNotes, removeNote, changeNote
}