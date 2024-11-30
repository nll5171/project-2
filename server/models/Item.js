const mongoose = require('mongoose');
const helper = require('./helper.js');

const ItemSchema = new mongoose.Schema({
    // TO-DO: Add fields to the Item Schema, such as:
    // - Task
    // - Hunt (what hunt is this a part of?)
    // - createdDate (for sorting)
    task: {
        type: String,
        required: true,
        trim: true,
    },
    hunt: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Hunt',
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// TO-DO: Determine if toAPI implementation is needed.
// I want to say it isn't, but I'm not 100% sure?

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = {
    ItemSchema,
    ItemModel,
};