const mongoose = require('mongoose');
const _ = require('underscore');

const setSubmission = (submission) => _.escape(submission).trim();

const SubmissionSchema = new mongoose.Schema({
    // TO-DO: Determine what should be in this schema. Probably:
    // - Content
    // - Owner of submission
    // - Scavenger Hunt ID (what hunt is this for?)
    // - Checklist ID (what item on the hunt is this?)
    // - submittedDate (for sorting)
});

SubmissionSchema.statics.toAPI = (doc) => ({

});

const SubmissionModel = mongoose.model('Submission', SubmissionSchema);
module.exports = SubmissionModel;