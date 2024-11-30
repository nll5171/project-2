const mongoose = require('mongoose');
const helper = require('./helper.js');
const { ItemSchema } = require('./Item.js');

const HuntSchema = new mongoose.Schema({
    // TO-DO: Determine what should be in this schema, probably
    // - Hunt name
    // - Owner
    // - Requirements (Would have to be an array of requirements I think)
    //    - More info here: https://mongoosejs.com/docs/schematypes.html#arrays
    //    - Has to be array of Schemas, so need another Schema type
    //    - Originally I was going to do this, but I'm gonna try without for now
    // - createdDate (for sorting)
    // - Deadline (to accept submissions)
    // - Winner of the hunt (once finished)
    name: {
        type: String,
        required: true,
        trim: true,
        set: helper.trim,
    },
    // items: {
    //     type: [ItemSchema],
    //     required: true,
    // },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    deadline: {
        type: Date,
        required: true,
    },
    winner: {
        type: mongoose.Schema.ObjectId,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});
