const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    score: { type: Number, required: true },
    keywordMatch: [{
        keyword: String,
        found: Boolean,
    }],
    formattingChecks: {
        singleColumn: Boolean,
        noGraphics: Boolean,
        standardHeadings: Boolean,
        fontCheck: Boolean,
    },
    sectionValidation: {
        education: Boolean,
        experience: Boolean,
        projects: Boolean,
        skills: Boolean,
    },
    readabilityScore: Number,
    suggestions: [String],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Scan', scanSchema);
