const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    tokens: { type: Number, default: 0 },
    earnedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', tokenSchema);
