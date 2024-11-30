const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login', { loggedIn: false });

const changePassPage = (req, res) => res.render('login', { loggedIn: true });

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

// Allow user to login to their account
const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password!' });
        }

        req.session.account = Account.toAPI(account);

        // Move user to standard page
        return res.json({ redirect: '/' });
    });
};

// Create a new account for the user
const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.genereateHash(pass);
        const newAccount = new Account({ username, password: hash });
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/'} ); // Change the redirect
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username is already in use!' });
        }
        return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
};

// Update password to account if logged in
const changePass = async (req, res) => {
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    // Try changing password
    try {
        const hash = await Account.genereateHash(pass);

        await Account.findByIdAndUpdate(req.session.account._id, { password: hash }).lean().exec();
        return res.json({ redirect: '/' });
    } catch (err) {
        return res.status(500).json({ error: 'An error occurred!' });
    }
};

module.exports = {
    loginPage,
    login,
    logout,
    signup,
    changePass,
};