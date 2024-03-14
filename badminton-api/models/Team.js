const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
	players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true }],
	name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
