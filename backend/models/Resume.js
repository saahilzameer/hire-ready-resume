const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        linkedin: String,
        github: String,
        portfolio: String,
    },
    education: [{
        degree: String,
        college: String,
        year: String,
        cgpa: String,
    }],
    experience: [{
        role: String,
        company: String,
        location: String,
        duration: String,
        bullets: [String],
    }],
    projects: [{
        title: String,
        techStack: [String],
        description: String,
        bullets: [String],
        link: String,
    }],
    skills: {
        languages: [String],
        frameworks: [String],
        tools: [String],
        others: [String],
    },
    certifications: [String],
    targetJobRole: String,
    jobDescription: String,
    aiOptimizedContent: {
        experience: [{ bullets: [String] }],
        projects: [{ bullets: [String] }],
    },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resume', resumeSchema);
