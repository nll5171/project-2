const models = require('../models');

const { Hunt } = models;

// // Constants for hunt amounts (free vs. premium)
const maxHuntsFree = 10;
const maxHuntsPremium = 50;

const makerPage = async (req, res) => res.render('app');

const explorePage = async (req, res) => res.render('explore');

// Create a new Scavenger Hunt with the tasks provided
const makeHunt = async (req, res) => {
  // Ensure user hasn't made the maximum amount of scavenger hunts
  if ((!req.session.account.premium && req.session.account.huntAmt >= maxHuntsFree)
    || (req.session.account.premium && req.session.account.huntAmt >= maxHuntsPremium)) {
    return res.status(400).json({ error: 'Maximum amount of hunts reached. Please delete one before creating another!' });
  }

  if (!req.body.name || !req.body.deadline || !req.body.tasks) {
    return res.status(400).json({ error: 'Scavenger Hunt requires a name, tasks, and a deadline!' });
  }

  // TO-DO: Items list probably won't be implemented this way
  const huntData = {
    name: req.body.name,
    deadline: req.body.deadline,
    tasks: req.body.tasks,
    owner: req.session.account._id,
  };

  try {
    const newHunt = new Hunt(huntData);
    let id;
    await newHunt.save().then((hunt) => {
      id = hunt._id;
    });
    return res.status(201).json({
      name: newHunt.name,
      deadline: newHunt.deadline,
      id,
      tasks: newHunt.tasks,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Scavenger Hunt already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making this Scavenger Hunt!' });
  }
};

const removeHunt = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'Hunt ID required to delete!' });
  }

  try {
    await Hunt.findByIdAndDelete(req.body.id);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong when removing hunt!' });
  }
};

// Gets all ongoing scavenger hunts, ignores completed ones
const getHunts = async (req, res) => {
  try {
    // Only search for ongoing hunts
    const query = { deadline: { $gt: new Date() } };
    const docs = await Hunt.find(query).select('name owner deadline _id tasks').lean().exec();
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
    const docs = await Hunt.find(query).select('name deadline winner _id tasks').lean().exec();
    return res.json({ hunts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving Scavenger Hunts!' });
  }
};

module.exports = {
  makerPage,
  explorePage,
  makeHunt,
  getHunts,
  getUserHunts,
  removeHunt,
};
