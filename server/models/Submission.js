const mongoose = require('mongoose');
const helper = require('./helper.js');

const SubmissionSchema = new mongoose.Schema({
    // TO-DO: Determine what should be in this schema. Probably:
    // - Content
    // - Owner of submission
    // - Scavenger Hunt ID (what hunt is this for?)
    // - Checklist ID (what item on the hunt is this?)
    // - submittedDate (for sorting)
    content: {
        type: String,
        required: true,
        trim: true,
        set: helper.trim,
    },
    hunt: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Hunt',
    },
    item: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Item',
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    submittedDate: {
        type: Date,
        default: Date.now,
    },
});

// TO-DO: See if this is necessary before implementing it
// SubmissionSchema.statics.toAPI = (doc) => ({

// });

const SubmissionModel = mongoose.model('Submission', SubmissionSchema);
module.exports = SubmissionModel;