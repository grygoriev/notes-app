//node index.js

// console.log(__filename)
// console.log(__dirname)
// console.log(process.argv)
// console.log(process.argv[1])

const yargs = require('yargs')
const pkg = require('./package.json');
const {addNote, printNotes, removeNote, changeNote} = require('./notes.controller');

yargs.version(pkg.version)

yargs.command({
    command: 'add',
    describe: 'Add new note to list',
    builder: {
        title: {
            type: 'string',
            describe: 'Note title',
            demandOption: true,
        }
    },
    handler({ title }) {
        addNote(title);
    }
})

yargs.command({
    command: 'list',
    describe: 'Print all notes',
    async handler() {
        printNotes();
    }
})

yargs.command({
    command: 'remove',
    describe: 'Remove note by id',
    builder: {
        id: {
            type: 'string',
            describe: 'Note id',
            demandOption: true,
        }
    },
    handler({ id }) {
        removeNote(id);
    }
})

yargs.command({
    command: 'edit',
    describe: 'Edit note by id',
    builder: {
        id: {
            type: 'string',
            describe: 'Note id',
            demandOption: true,
        },
        title: {
            type: 'string',
            describe: 'Note title',
            demandOption: true,
        }
    },
    handler({ id, title }) {
        changeNote(id, title);
    }
})

yargs.parse()