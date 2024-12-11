const models = require('../models');

const { Item } = models;

// Create a new item as part of a task
const makeItem = async (req, res) => {
  if (!req.body.task || !req.body.hunt) {
    return res.status(400).json({ error: 'Task description is required!' });
  }

  // Hunt ID can be passed in from hunt creation
  const itemData = {
    task: req.body.task,
    hunt: req.body.hunt,
    owner: req.session.account._id,
  };

  try {
    const newItem = new Item(itemData);
    await newItem.save();
    return res.status(201).json({ task: itemData.task, hunt: itemData.hunt });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Task already exists!' });
    }
    return req.status(500).json({ error: 'An error occurred while creating task!' });
  }
};

// Get the items of the current task
const getItems = async (req, res) => {
  try {
    const query = { hunt: req.query.id };
    const docs = await Item.find(query).select('task').lean().exec();

    return res.json({ items: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving tasks!' });
  }
};

module.exports = {
  makeItem,
  getItems,
};
