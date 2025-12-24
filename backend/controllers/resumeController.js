const Resume = require('../models/Resume');
const PublicUrl = require('../models/PublicUrl');
const { generateSlug } = require('../utils/slugify');
const puppeteer = require('puppeteer');

exports.saveResume = async (req, res) => {
    try {
        const resume = new Resume({ ...req.body, userId: req.userId });
        await resume.save();
        res.status(201).json(resume);
    } catch (error) {
        res.status(500).json({ message: 'Error saving resume', error: error.message });
    }
};

exports.getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resumes', error: error.message });
    }
};

exports.getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resume', error: error.message });
    }
};

exports.updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: 'Error updating resume', error: error.message });
    }
};

exports.deployResume = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await Resume.findOne({ _id: id, userId: req.userId });
        if (!resume) return res.status(404).json({ message: 'Resume not found' });

        let publicUrl = await PublicUrl.findOne({ resumeId: id });
        if (!publicUrl) {
            const slug = generateSlug(resume.personalInfo.fullName);
            publicUrl = new PublicUrl({ resumeId: id, slug });
            await publicUrl.save();
        }

        res.json({ url: `${process.env.FRONTEND_URL}/r/${publicUrl.slug}` });
    } catch (error) {
        res.status(500).json({ message: 'Error deploying resume', error: error.message });
    }
};

exports.getPublicResume = async (req, res) => {
    try {
        const publicUrl = await PublicUrl.findOne({ slug: req.params.slug, isActive: true });
        if (!publicUrl) return res.status(404).json({ message: 'Public resume not found' });

        const resume = await Resume.findById(publicUrl.resumeId).populate('userId', 'email');
        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public resume', error: error.message });
    }
};

exports.generatePDF = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await Resume.findOne({ _id: id, userId: req.userId });
        if (!resume) return res.status(404).json({ message: 'Resume not found' });

        // In a production environment with Puppeteer:
        /*
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Set HTML content (using a template similar to our ATS preview)
        const htmlContent = `
          <html>
            <head>
              <style>
                body { font-family: Arial; padding: 40px; }
                h1 { text-align: center; text-transform: uppercase; }
                .section-title { border-bottom: 1px solid black; text-transform: uppercase; margin-top: 20px; font-weight: bold; }
                .item-header { display: flex; justify-content: space-between; font-weight: bold; }
                ul { list-style-type: "- "; }
              </style>
            </head>
            <body>
              <h1>${resume.personalInfo.fullName}</h1>
              <p style="text-align: center;">${resume.personalInfo.email} | ${resume.personalInfo.phone}</p>
              ... etc ...
            </body>
          </html>
        `;
        
        await page.setContent(htmlContent);
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();
        
        res.contentType('application/pdf');
        res.send(pdf);
        */

        res.status(200).json({ message: 'PDF generated! (Simulation: In production, this would return a blob)' });
    } catch (error) {
        res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
};
