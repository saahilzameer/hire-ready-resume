import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Cpu, ShieldCheck, Zap } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#030712] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <FileText className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">Resu<span className="text-blue-400">AI</span></span>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all active:scale-95"
                >
                    Get Started
                </button>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 inline-block">
                        ATS-Optimized & AI-Powered
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.1]">
                        Build a Resume that <br />
                        <span className="gradient-text">Actually Gets Interviews.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Stop worrying about ATS filters. Our AI rewrites your experience using the STAR method and optimizes keywords to boost your matching score.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Build My Resume <Zap className="w-5 h-5 fill-white" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all active:scale-95">
                            View Sample
                        </button>
                    </div>
                </motion.div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-32">
                    {[
                        { icon: Cpu, title: "AI Optimization", desc: "Bullets rewritten using the STAR method for maximum impact." },
                        { icon: ShieldCheck, title: "ATS Guaranteed", desc: "Strict adherence to scanning rules. Single column, minimal design." },
                        { icon: Zap, title: "Instant Scan", desc: "Real-time feedback on keyword matching and formatting." }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="glass-card p-8 text-left hover:border-blue-500/30 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-colors">
                                <feature.icon className="text-blue-500 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Landing;
