const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login', { loggedIn: false });

const changePassPage = (req, res) => res.render('login', { loggedIn: true });

const isLoggedIn = (req, res) => {
  const loggedIn = !!req.session.account;
  return res.status(200).json({ loggedIn });
};

const getUserInfo = (req, res) => res.status(200).json({
  premium: req.session.account.premium,
  huntAmt: req.session.account.huntAmt,
});

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
    return res.json({ redirect: '/maker' });
  });
};

const enablePremium = async (req, res) => {
  try {
    await Account.findByIdAndUpdate(
      req.session.account._id,
      { premium: req.body.premium },
    ).lean().exec();
    req.session.account.premium = req.body.premium;
    return res.json({ });
  } catch (err) {
    return res.status(500).json({ error: 'An error occurred!' });
  }
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
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    console.log(req.session);
    return res.json({ redirect: '/maker' }); // Change the redirect
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

// Update the number of hunts the user has made
const changeHuntAmt = async (req, res) => {
  try {
    await Account.findByIdAndUpdate(
      req.session.account._id,
      { huntAmt: req.body.newAmt },
    ).lean().exec();
    req.session.account.huntAmt = req.body.newAmt;
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong while updating hunt count!' });
  }
};

module.exports = {
  isLoggedIn,
  loginPage,
  login,
  logout,
  signup,
  changePassPage,
  changePass,
  getUserInfo,
  enablePremium,
  changeHuntAmt,
};
