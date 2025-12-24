const mongoose = require('mongoose');

const publicUrlSchema = new mongoose.Schema({
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PublicUrl', publicUrlSchema);
