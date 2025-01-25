require('dotenv').config();

const express = require('express');
const chalk = require('chalk');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Note = require('./models/Note');
const { addNote, getNotes, removeNote, changeNote } = require('./notes.controller');
const { addUser, loginUser } = require('./user.controller');
const auth = require('./middlewares/auth');

const port = 3000
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/register', async (req, res) => {
    res.render('register', {
        title: 'Express App',
        error: undefined
    });
})

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error('Email and password are required.');
        }

        await addUser(email, password);
        res.redirect('/login');
    } catch (e) {
        res.render('register', {
            title: 'Express App',
            error: e.message
        });
    }
})

app.get('/login', async (req, res) => {
    res.render('login', {
        title: 'Express App',
        error: undefined
    });
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);

        res.cookie('token', token, {httpOnly: true})

        res.redirect('/');
    } catch (e) {
        res.render('login', {
            title: 'Express App',
            error: e.message
        });
    }
})

app.get('/logout', async (req, res) => {
    res.cookie('token', '', {httpOnly: true});

    res.redirect('/login');
})

app.use(auth)

app.get('/', async (req, res) => {
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        userEmail: req.user.email,
        created: false,
        error: false
    });
})

app.post('/', async (req, res) => {
    try {
        await addNote(req.body.title, req.user.email)
        res.render('index', {
            title: 'Express App',
            notes: await getNotes(),
            userEmail: req.user.email,
            created: true,
            error: false
        })
    } catch (err) {
        console.error('Creation error', err)
        res.render('index', {
            title: 'Express App',
            notes: await getNotes(),
            userEmail: req.user.email,
            created: false,
            error: true
        })
    }
})

app.delete('/:id', async (req, res) => {
    try {
        await removeNote(req.params.id, req.user.email)
        res.render('index', {
            title: 'Express App',
            notes: await getNotes(),
            userEmail: req.user.email,
            created: false,
            error: false
        });
    } catch (e) {
        res.render('index', {
            title: 'Express App',
            notes: await getNotes(),
            userEmail: req.user.email,
            created: false,
            error: e.message
        });
    }
})

app.put('/:id', async (req, res) => {
    try {
        await changeNote(req.params.id, req.body.title, req.user.email)
        res.render('index', {
            title: 'Express App',
            notes: await getNotes(),
            userEmail: req.user.email,
            created: false,
            error: false
        });
    } catch (e) {
        res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        userEmail: req.user.email,
        created: false,
        error: e.message
        });
    }
})

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(()=>{
        app.listen(port, ()=>{
            console.log(chalk.green(`Server has been started on port ${port}`))
        })
    })

