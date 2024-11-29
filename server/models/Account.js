const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Number of times password is salted for security
const saltRounds = 10;

let AccountModel = {};

const AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[A-Za-z0-9_\-.]{1,16}$/,
    },
    password: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// Converts a doc to something we can store in redis
AccountSchema.statics.toAPI = (doc) => ({
    username: doc.username,
    _id: doc._id,
});

// Helper function to hash password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

// Checks for correct password when logging in
AccountSchema.statics.authenticate = async (username, password, callback) => {
    try {
        const doc = await AccountModel.findOne({ username }).exec();
        if (!doc) {
            return callback();  // Runs callback if no matching username
        }

        const match = await bcrypt.compare(password, doc.password);
        if (match) {
            return callback(null, doc);
        }
        return callback();
    } catch (err) {
        return callback(err);
    }
};

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;