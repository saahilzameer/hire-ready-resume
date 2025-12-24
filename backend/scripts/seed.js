require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Resume = require('../models/Resume');

const seed = async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing
    await User.deleteMany({});
    await Resume.deleteMany({});

    const user = new User({
        email: 'test@example.com',
        isVerified: true,
        name: 'Test Student'
    });
    await user.save();

    const resume = new Resume({
        userId: user._id,
        personalInfo: {
            fullName: 'Aqil Test User',
            email: 'test@example.com',
            phone: '+1 123 456 7890',
            linkedin: 'linkedin.com/in/aqil-test',
            github: 'github.com/aqil-test'
        },
        education: [{
            degree: 'B.S. Computer Science',
            college: 'Global Tech University',
            year: '2020 - 2024',
            cgpa: '3.8'
        }],
        experience: [{
            role: 'Full Stack Intern',
            company: 'Tech Innovations Inc.',
            location: 'Remote',
            duration: 'May 2023 - Aug 2023',
            bullets: [
                'Developed a responsive dashboard using React and Tailwind CSS.',
                'Optimized database queries in MongoDB, reducing response time by 30%.',
                'Collaborated with a team of 4 to implement secure JWT authentication.'
            ]
        }],
        projects: [{
            title: 'AI Resume Builder',
            techStack: ['Node.js', 'React', 'MongoDB', 'OpenAI'],
            description: 'A platform to build ATS-optimized resumes using AI.',
            bullets: [
                'Implemented ATS-safe rendering logic for single-column layouts.',
                'Integrated OpenAI for context-aware bullet point optimization.'
            ],
            link: 'https://github.com/aqil-test/resu-ai'
        }],
        skills: {
            languages: ['JavaScript', 'Python', 'Java'],
            frameworks: ['React', 'Node.js', 'Express', 'Tailwind CSS'],
            tools: ['Git', 'Docker', 'MongoDB'],
            others: ['Agile', 'System Design']
        },
        targetJobRole: 'Software Engineer',
        jobDescription: 'Seeking a Software Engineer proficient in React, Node.js and MongoDB. Experience with AI is a plus.'
    });
    await resume.save();

    console.log('Seed data created successfully!');
    console.log('User: test@example.com');
    console.log('Resume ID:', resume._id);
    process.exit();
};

seed();
