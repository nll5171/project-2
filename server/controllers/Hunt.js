const models = require('../models');

const { Hunt } = models;

// // Constants for hunt amounts (free vs. premium)
const maxHuntsFree = 10;
const maxHuntsPremium = 50;

const makerPage = async (req, res) => res.render('app');

// Create a new Scavenger Hunt with the tasks provided
const makeHunt = async (req, res) => {
  // Ensure user hasn't made the maximum amount of scavenger hunts
  if ((!req.session.account.premium && req.session.account.huntAmt >= maxHuntsFree)
    || (req.session.account.premium && req.session.account.huntAmt >= maxHuntsPremium)) {
    return res.status(400).json({ error: 'Maximum amount of hunts reached. Please delete one before creating another!' });
  }

  if (!req.body.name || !req.body.deadline) {
    return res.status(400).json({ error: 'Scavenger Hunt requires a name, tasks, and a deadline!' });
  }

  // TO-DO: Items list probably won't be implemented this way
  const huntData = {
    name: req.body.name,
    deadline: req.body.deadline,
    owner: req.session.account._id,
  };

  try {
    const newHunt = new Hunt(huntData);
    await newHunt.save().then((_id) => res.status(201).json({
      name: newHunt.name,
      deadline: newHunt.deadline,
      id: _id,
    }));
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Scavenger Hunt already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making this Scavenger Hunt!' });
  }

  return res.status(500).json({ error: 'An error occurred making this Scavenger Hunt!' });
};

// Gets all ongoing scavenger hunts, ignores completed ones
const getHunts = async (req, res) => {
  try {
    // Only search for ongoing hunts
    const query = { deadline: { $gt: Date.now } };
    const docs = await Hunt.find(query).select('name owner deadline _id').lean().exec();

    return res.json({ hunts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving Scavenger Hunts!' });
  }
};

// Gets only the requested user's scavenger hunts
const getUserHunts = async (req, res) => {
  try {
    // Include completed hunts with their winners
    const query = { owner: req.session.account._id };
    const docs = await Hunt.find(query).select('name deadline winner _id').lean().exec();

    return res.json({ hunts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving Scavenger Hunts!' });
  }
};

module.exports = {
  makerPage,
  makeHunt,
  getHunts,
  getUserHunts,
};
