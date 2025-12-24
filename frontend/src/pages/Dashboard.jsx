import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, FileText, ChevronRight, Layout, Trash2, Globe } from 'lucide-react';

const Dashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/resume', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setResumes(res.data);
        } catch (err) {
            console.error('Error fetching resumes');
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-[#030712] p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Your Resumes</h1>
                        <p className="text-slate-400 mt-1">Manage and optimize your career profiles</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/builder')}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                        >
                            <Plus className="w-5 h-5" /> New Resume
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-xl font-medium transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading resumes...</div>
                ) : resumes.length === 0 ? (
                    <div className="glass-card p-20 text-center">
                        <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="text-blue-500 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No resumes yet</h3>
                        <p className="text-slate-400 mb-8 max-w-sm mx-auto">Create your first ATS-optimized resume in minutes using our AI builder.</p>
                        <button
                            onClick={() => navigate('/builder')}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all active:scale-95"
                        >
                            Start Building
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <div
                                key={resume._id}
                                className="glass-card p-6 flex flex-col hover:border-blue-500/30 transition-all cursor-pointer group"
                                onClick={() => navigate(`/builder/${resume._id}`)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                                        <Layout className="text-blue-500 w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20 uppercase tracking-wider">
                                            Optimal
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1">{resume.personalInfo.fullName || 'Untitled Resume'}</h3>
                                <p className="text-slate-400 text-sm mb-6">{resume.targetJobRole}</p>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                                        Last updated {new Date(resume.updatedAt).toLocaleDateString()}
                                    </span>
                                    <ChevronRight className="text-slate-600 w-5 h-5 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
