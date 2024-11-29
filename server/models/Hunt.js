const mongoose = require('mongoose');
const _ = require('underscore');

const HuntSchema = new mongoose.Schema({
    // TO-DO: Determine what should be in this schema, probably
    // - Hunt name
    // - Owner
    // - Requirements (Would have to be an array of requirements I think)
    // - createdDate (for sorting)
});
