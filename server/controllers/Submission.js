const models = require('../models');

const { Submission } = models;

const makeSubmission = async (req, res) => {
    if (!req.body.content) {
        return res.status(400).json({ error: 'Submissions must include a link!' });
    }

    const submissionData = {
        content: req.body.content,
        hunt: req.session.hunt._id,
        item: req.session.item._id,
        owner: req.session.account._id,
    };

    try {
        const newSubmission = new Submission(submissionData);
        await newSubmission.save();
        return res.status(201).json({ content: submissionData.content });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Submission already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred making submission!' });
    }
};

// Get all submissions for a particular hunt from a particular user
const getSubmissions = async (req, res) => {
    try {
        const query = { owner: req.session.account._id, hunt: req.session.hunt._id };
        const docs = await Submission.find(query).select('content').lean().exec();

        return res.json({ submissions: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving submissions' });
    }
};

module.exports = {
    makeSubmission,
    getSubmissions,
};