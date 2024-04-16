const mongoose = require('mongoose');

const DrawSchema = new mongoose.Schema({
    event: String,
    rounds: [{
        name: String,
        games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
    }],
    type: String,  // "main" or "consolation"
    grade: Number  // Add grade if you need to filter draws by grade
});

module.exports = mongoose.model('Draw', DrawSchema);
