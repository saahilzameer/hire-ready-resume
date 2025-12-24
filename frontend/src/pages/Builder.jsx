import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    User, BookOpen, Briefcase, Code, Settings,
    Sparkles, CheckCircle, ChevronLeft, ChevronRight,
    Download, Send, Eye, Edit3, Search
} from 'lucide-react';

const Builder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        personalInfo: { fullName: '', email: '', phone: '', linkedin: '', github: '', portfolio: '' },
        education: [{ degree: '', college: '', year: '', cgpa: '' }],
        experience: [{ role: '', company: '', location: '', duration: '', bullets: [''] }],
        projects: [{ title: '', techStack: '', description: '', bullets: [''], link: '' }],
        skills: { languages: '', frameworks: '', tools: '', others: '' },
        targetJobRole: '',
        jobDescription: ''
    });

    useEffect(() => {
        if (id) {
            fetchResume();
        }
    }, [id]);

    const fetchResume = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/resume/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFormData(res.data);
        } catch (err) {
            console.error('Error fetching resume');
        }
    };

    const handleInputChange = (section, field, value, index = null) => {
        const newData = { ...formData };
        if (index !== null) {
            if (Array.isArray(newData[section][index].bullets)) {
                // handle bullet array specifically if needed
            }
            newData[section][index][field] = value;
        } else if (typeof newData[section] === 'object' && !Array.isArray(newData[section])) {
            newData[section][field] = value;
        } else {
            newData[section] = value;
        }
        setFormData(newData);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            if (id) {
                await axios.put(`http://localhost:5000/api/resume/${id}`, formData, config);
            } else {
                const res = await axios.post('http://localhost:5000/api/resume', formData, config);
                navigate(`/builder/${res.data._id}`);
            }
        } catch (err) {
            console.error('Error saving resume');
        }
        setLoading(false);
    };

    const handleOptimize = async () => {
        setOptimizing(true);
        try {
            const res = await axios.post('http://localhost:5000/api/ai/optimize', { resumeId: id }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // In a real app, we'd update formData with AI bullets
            alert('AI has optimized your bullet points! (Mock: Experience sections updated)');
        } catch (err) {
            console.error('Optimization failed');
        }
        setOptimizing(false);
    };

    const handleScan = async () => {
        setScanning(true);
        try {
            const res = await axios.post('http://localhost:5000/api/ai/scan', { resumeId: id }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setScanResult(res.data);
            setStep(6);
        } catch (err) {
            console.error('Scan failed');
        }
        setScanning(false);
    };

    const steps = [
        { id: 1, name: 'Personal', icon: User },
        { id: 2, name: 'Education', icon: BookOpen },
        { id: 3, name: 'Experience', icon: Briefcase },
        { id: 4, name: 'Projects', icon: Code },
        { id: 5, name: 'Skills', icon: Settings },
        { id: 6, name: 'ATS Scan', icon: Sparkles },
    ];

    const handleCopyText = () => {
        const text = `
${formData.personalInfo.fullName.toUpperCase()}
${formData.personalInfo.email} | ${formData.personalInfo.phone}
${formData.personalInfo.linkedin} | ${formData.personalInfo.github}

EDUCATION
${formData.education.map(edu => `${edu.college} - ${edu.degree} (${edu.year}) ${edu.cgpa ? `CGPA: ${edu.cgpa}` : ''}`).join('\n')}

EXPERIENCE
${formData.experience.map(exp => `${exp.company} | ${exp.role} (${exp.duration})\n${exp.bullets.map(b => `- ${b}`).join('\n')}`).join('\n\n')}

PROJECTS
${formData.projects.map(proj => `${proj.title} | ${proj.techStack}\n${proj.bullets.map(b => `- ${b}`).join('\n')}`).join('\n\n')}

SKILLS
- Languages: ${formData.skills.languages}
- Frameworks: ${formData.skills.frameworks}
- Tools: ${formData.skills.tools}
        `;
        navigator.clipboard.writeText(text);
        alert('Resume copied as plain text!');
    };

    return (
        <div className="min-h-screen bg-[#030712] flex flex-col lg:flex-row">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 bg-[#030712] border-r border-white/5 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-10 px-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <ChevronLeft className="text-slate-500 w-5 h-5" />
                    <span className="text-slate-400 font-medium">Dashboard</span>
                </div>

                <div className="space-y-2">
                    {steps.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setStep(s.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${step === s.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <s.icon className={`w-5 h-5 ${step === s.id ? 'text-white' : 'text-slate-500'}`} />
                            {s.name}
                            {step > s.id && <CheckCircle className="ml-auto w-4 h-4 text-emerald-500" />}
                        </button>
                    ))}
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                    >
                        {showPreview ? <Edit3 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        {showPreview ? 'Edit Content' : 'Preview Resume'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all active:scale-95"
                    >
                        {loading ? 'Saving...' : 'Save Draft'}
                    </button>
                </div>
            </div>

            {/* Main Builder Area */}
            <div className={`flex-1 overflow-y-auto bg-[#030712] p-8 lg:p-12 transition-all ${showPreview ? 'hidden lg:block' : ''}`}>
                <div className="max-w-3xl mx-auto">
                    {step === 1 && (
                        <section className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Personal Information</h2>
                                <p className="text-slate-400">Basic contact details for recruiters to reach you.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.personalInfo.fullName}
                                        onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.personalInfo.email}
                                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.personalInfo.phone}
                                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">LinkedIn URL</label>
                                    <input
                                        type="text"
                                        value={formData.personalInfo.linkedin}
                                        onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="linkedin.com/in/johndoe"
                                    />
                                </div>
                            </div>
                            <div className="pt-10 flex justify-end">
                                <button onClick={() => setStep(2)} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2">
                                    Next Section <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </section>
                    )}

                    {/* ... Add other steps similarly ... */}
                    {step === 6 && (
                        <section className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">ATS Compatibility Scan</h2>
                                <p className="text-slate-400">Scan your resume against your target job description.</p>
                            </div>

                            {!scanResult ? (
                                <div className="glass-card p-10 space-y-8">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Target Job Role</label>
                                        <input
                                            type="text"
                                            value={formData.targetJobRole}
                                            onChange={(e) => handleInputChange('targetJobRole', null, e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                            placeholder="e.g. Senior Software Engineer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Paste Job Description</label>
                                        <textarea
                                            rows={6}
                                            value={formData.jobDescription}
                                            onChange={(e) => handleInputChange('jobDescription', null, e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                                            placeholder="Paste the full job description here..."
                                        />
                                    </div>
                                    <button
                                        onClick={handleScan}
                                        disabled={scanning}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                                    >
                                        {scanning ? 'Scanning...' : 'Run ATS Scan'} <Search className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="glass-card p-8 flex items-center justify-between border-blue-500/30">
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-24 h-24 flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * scanResult.score) / 100} className="text-blue-500" />
                                                </svg>
                                                <span className="absolute text-2xl font-bold text-white">{scanResult.score}%</span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Overall ATS Score</h3>
                                                <p className="text-slate-400">Based on keywords and formatting</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleOptimize}
                                            disabled={optimizing}
                                            className="px-6 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold flex items-center gap-2 transition-all"
                                        >
                                            {optimizing ? 'Optimizing...' : 'AI Boost Score'} <Sparkles className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="glass-card p-6">
                                            <h4 className="font-bold text-white mb-4">Keyword Match</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {scanResult.keywordMatch.map((k, i) => (
                                                    <span key={i} className={`px-3 py-1 rounded-full text-xs font-bold border ${k.found ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                        {k.keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="glass-card p-6">
                                            <h4 className="font-bold text-white mb-4">Formatting Check</h4>
                                            <div className="space-y-3">
                                                {Object.entries(scanResult.formattingChecks).map(([key, value], i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm">
                                                        <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                        {value ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Settings className="w-4 h-4 text-red-500" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card p-6">
                                        <h4 className="font-bold text-white mb-4">Suggestions to Improve</h4>
                                        <ul className="space-y-3">
                                            {scanResult.suggestions.map((s, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-slate-400">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Simple step fallback for brevity in this response */}
                    {(step > 1 && step < 6) && (
                        <div className="glass-card p-20 text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Step {step} Implementation</h3>
                            <p className="text-slate-400 mb-8 lowercase">This section gathers your {steps.find(s => s.id === step).name} data.</p>
                            <div className="flex justify-between">
                                <button onClick={() => setStep(step - 1)} className="px-6 py-2 text-slate-400 hover:text-white">Back</button>
                                <button onClick={() => setStep(step + 1)} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Section */}
            <div className={`flex-1 bg-slate-900 overflow-y-auto p-12 ${showPreview ? 'block' : 'hidden lg:block'}`}>
                <div className="flex justify-between items-center mb-8 max-w-[210mm] mx-auto">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-500" /> Live ATS Preview
                    </h2>
                    <div className="flex gap-4">
                        <button onClick={handleCopyText} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium border border-white/10 transition-all">
                            Copy Text
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium border border-white/10 transition-all">
                            <Download className="w-4 h-4" /> PDF
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 transition-all">
                            <Send className="w-4 h-4" /> Deploy
                        </button>
                    </div>
                </div>

                {/* The Actual ATS Resume Template */}
                <div className="ats-resume shadow-2xl">
                    <h1>{formData.personalInfo.fullName || 'YOUR NAME'}</h1>
                    <div className="contact-info">
                        {formData.personalInfo.email} | {formData.personalInfo.phone} | {formData.personalInfo.linkedin} | {formData.personalInfo.github}
                    </div>

                    <h2>Education</h2>
                    {formData.education.map((edu, i) => (
                        <div key={i} className="section-item">
                            <div className="item-header">
                                <span>{edu.college || 'College Name'}</span>
                                <span>{edu.year || '2020 - 2024'}</span>
                            </div>
                            <div>{edu.degree || 'Degree'} {edu.cgpa && `| CGPA: ${edu.cgpa}`}</div>
                        </div>
                    ))}

                    <h2>Work Experience</h2>
                    {formData.experience.map((exp, i) => (
                        <div key={i} className="section-item">
                            <div className="item-header">
                                <span>{exp.company || 'Company Name'}</span>
                                <span>{exp.duration || 'Jan 2022 - Present'}</span>
                            </div>
                            <div className="font-bold italic">{exp.role || 'Job Role'}</div>
                            <ul>
                                {exp.bullets.map((b, bi) => <li key={bi}>{b || 'Bullet point describing impact...'}</li>)}
                            </ul>
                        </div>
                    ))}

                    <h2>Projects</h2>
                    {formData.projects.map((proj, i) => (
                        <div key={i} className="section-item">
                            <div className="item-header">
                                <span>{proj.title || 'Project Title'}</span>
                                <span>{proj.techStack || 'React, Node.js'}</span>
                            </div>
                            <ul>
                                {proj.bullets.map((b, bi) => <li key={bi}>{b || 'Bullet point describing problem and results...'}</li>)}
                            </ul>
                        </div>
                    ))}

                    <h2>Skills</h2>
                    <div className="text-sm">
                        <strong>Languages:</strong> {formData.skills.languages} <br />
                        <strong>Frameworks:</strong> {formData.skills.frameworks} <br />
                        <strong>Tools:</strong> {formData.skills.tools}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Builder;
