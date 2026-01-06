const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// fichier users.json à la racine du projet
const usersFile = path.join(__dirname, '..', '..', 'users.json');

// Crée le fichier si il n'existe pas
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}

function readUsers() {
    return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

exports.register = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ status: 'error', message: 'Username et password requis' });

    const users = readUsers();
    if (users.find(u => u.username === username))
        return res.status(400).json({ status: 'error', message: 'Utilisateur déjà existant' });

    const hashed = bcrypt.hashSync(password, 10);
    const newUser = { id: Date.now(), username, password: hashed };
    users.push(newUser);
    writeUsers(users);

    const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        process.env.JWT_SECRET || 'secret123',
        { expiresIn: '1h' }
    );

    res.json({ status: 'success', token });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    const users = readUsers();
    const user = users.find(u => u.username === username);
    if (!user)
        return res.status(401).json({ status: 'error', message: 'Utilisateur introuvable' });

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid)
        return res.status(401).json({ status: 'error', message: 'Mot de passe incorrect' });

    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'secret123',
        { expiresIn: '1h' }
    );

    res.json({ status: 'success', token });
};
