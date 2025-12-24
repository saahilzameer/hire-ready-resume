import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/send-otp', { email });
            setMessage(`OTP sent to ${email} (Check console for mock)`);
            setStep(2);
        } catch (err) {
            setMessage('Error sending OTP');
        }
        setLoading(false);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setMessage('Invalid or expired OTP');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                        <ShieldCheck className="text-blue-500 w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                    <p className="text-slate-400 mt-2">Log in with your email to continue</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl mb-6 text-sm text-center ${message.includes('Error') || message.includes('Invalid') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP} className="space-y-6">
                    {step === 1 ? (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="name@example.com"
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Verification Code</label>
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-center text-3xl tracking-[1em] font-bold focus:outline-none focus:border-blue-500 transition-all font-mono"
                                placeholder="000000"
                                maxLength={6}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing...' : step === 1 ? 'Send One-Time Code' : 'Verify & Continue'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                {step === 2 && (
                    <button
                        onClick={() => setStep(1)}
                        className="w-full mt-6 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                    >
                        Wrong email? Change it
                    </button>
                )}
            </motion.div>
        </div>
    );
};

export default Login;
