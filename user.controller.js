const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./constants');

async function addUser(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    // User.create({email, password: passwordHash})
    try {
        const user = new User({ email, password: passwordHash });
        await user.save(); // Сохраняем пользователя в базе данных
    } catch (e) {
        if (e.code === 11000) {
            throw new Error(`The email "${e.keyValue.email}" is already in use.`);
        } else if (e.name === 'ValidationError') {
            const messages = Object.values(e.errors).map(err => err.message);
            throw new Error(messages.join(', '));
        } else {
            throw new Error('An unexpected error occurred during user registration.');
        }
    }
}

async function loginUser(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error(`User with email "${email}" does not exist`);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new Error(`Wrong password`);
    }

    return jwt.sign( { email }, JWT_SECRET, { expiresIn: '30d' });
}

module.exports = { addUser, loginUser };