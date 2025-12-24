const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const Resume = require('../models/Resume');
const Scan = require('../models/Scan');

exports.optimizeContent = async (req, res) => {
    try {
        const { resumeId } = req.body;
        const resume = await Resume.findById(resumeId);
        if (!resume) return res.status(404).json({ message: 'Resume not found' });

        const prompt = `
      You are an expert ATS-optimization AI. Rewrite the following resume sections for a "${resume.targetJobRole}" role.
      Job Description: ${resume.jobDescription}
      
      Instructions:
      1. Use strong action verbs.
      2. Quantify achievements (e.g., "Increased efficiency by 20%").
      3. Use the STAR method (Situation, Task, Action, Result).
      4. Include role-specific keywords from the Job Description.
      5. Maintain strict professional tone.
      
      Sections to rewrite:
      Experience: ${JSON.stringify(resume.experience)}
      Projects: ${JSON.stringify(resume.projects)}
      
      Return ONLY a JSON object with this structure:
      {
        "experience": [{ "bullets": ["string"] }],
        "projects": [{ "bullets": ["string"] }]
      }
    `;

        // For demonstration, if no API key, return mock data
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
            return res.json({
                experience: resume.experience.map(e => ({ bullets: ['Optimized legacy code resulting in 15% faster load times.', 'Led a team of 5 to deliver the project 2 weeks ahead of schedule.'] })),
                projects: resume.projects.map(p => ({ bullets: ['Built a scalable API using Node.js and MongoDB.', 'Implemented JWT authentication for secure user access.'] }))
            });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const optimized = JSON.parse(completion.choices[0].message.content);
        resume.aiOptimizedContent = optimized;
        await resume.save();

        res.json(optimized);
    } catch (error) {
        res.status(500).json({ message: 'Error optimizing content', error: error.message });
    }
};

exports.scanATS = async (req, res) => {
    try {
        const { resumeId } = req.body;
        const resume = await Resume.findById(resumeId);
        if (!resume) return res.status(404).json({ message: 'Resume not found' });

        // Mock ATS scanning logic
        const keywords = resume.jobDescription.toLowerCase().match(/\w+/g) || [];
        const skills = [...resume.skills.languages, ...resume.skills.frameworks, ...resume.skills.tools];

        const keywordMatch = skills.map(skill => ({
            keyword: skill,
            found: keywords.includes(skill.toLowerCase())
        }));

        const foundCount = keywordMatch.filter(k => k.found).length;
        const score = Math.min(100, Math.floor((foundCount / (keywords.length / 50)) * 100)); // Rough heuristic

        const scan = new Scan({
            resumeId,
            score: score || 75,
            keywordMatch,
            formattingChecks: {
                singleColumn: true,
                noGraphics: true,
                standardHeadings: true,
                fontCheck: true
            },
            sectionValidation: {
                education: !!resume.education.length,
                experience: !!resume.experience.length,
                projects: !!resume.projects.length,
                skills: !!skills.length
            },
            readabilityScore: 85,
            suggestions: [
                foundCount < 5 ? "Add more keywords from the job description to your skills section." : "Your keyword density is good.",
                !resume.experience.length ? "Missing experience section." : "Experience section looks solid.",
                "Ensure all bullet points start with action verbs."
            ]
        });

        await scan.save();
        res.json(scan);
    } catch (error) {
        res.status(500).json({ message: 'Error scanning resume', error: error.message });
    }
};
