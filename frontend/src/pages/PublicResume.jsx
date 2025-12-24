import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PublicResume = () => {
    const { slug } = useParams();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicResume = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/resume/public/${slug}`);
                setResume(res.data);
            } catch (err) {
                console.error('Resume not found');
            }
            setLoading(false);
        };
        fetchPublicResume();
    }, [slug]);

    if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading Resume...</div>;
    if (!resume) return <div className="h-screen flex items-center justify-center text-white">Resume not found or link expired.</div>;

    return (
        <div className="min-h-screen bg-slate-100 py-12 px-6">
            <div className="ats-resume shadow-xl">
                <h1>{resume.personalInfo.fullName}</h1>
                <div className="contact-info">
                    {resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.linkedin} | {resume.personalInfo.github}
                </div>

                <h2>Education</h2>
                {resume.education.map((edu, i) => (
                    <div key={i} className="section-item">
                        <div className="item-header">
                            <span>{edu.college}</span>
                            <span>{edu.year}</span>
                        </div>
                        <div>{edu.degree} {edu.cgpa && `| CGPA: ${edu.cgpa}`}</div>
                    </div>
                ))}

                {resume.experience.length > 0 && (
                    <>
                        <h2>Work Experience</h2>
                        {resume.experience.map((exp, i) => (
                            <div key={i} className="section-item">
                                <div className="item-header">
                                    <span>{exp.company}</span>
                                    <span>{exp.duration}</span>
                                </div>
                                <div className="font-bold italic">{exp.role}</div>
                                <ul>
                                    {exp.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                                </ul>
                            </div>
                        ))}
                    </>
                )}

                {resume.projects.length > 0 && (
                    <>
                        <h2>Projects</h2>
                        {resume.projects.map((proj, i) => (
                            <div key={i} className="section-item">
                                <div className="item-header">
                                    <span>{proj.title}</span>
                                    <span>{proj.techStack.join(', ')}</span>
                                </div>
                                <ul>
                                    {proj.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                                </ul>
                            </div>
                        ))}
                    </>
                )}

                <h2>Skills</h2>
                <div className="text-sm">
                    {resume.skills.languages.length > 0 && <><strong>Languages:</strong> {resume.skills.languages.join(', ')} <br /></>}
                    {resume.skills.frameworks.length > 0 && <><strong>Frameworks:</strong> {resume.skills.frameworks.join(', ')} <br /></>}
                    {resume.skills.tools.length > 0 && <><strong>Tools:</strong> {resume.skills.tools.join(', ')}</>}
                </div>
            </div>
        </div>
    );
};

export default PublicResume;
