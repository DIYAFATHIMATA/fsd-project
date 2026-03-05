import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroImage from '../assets/hero_image.png';
import { BarChart3, ShieldCheck, Zap, Users, Store, Building2, Check, ArrowRight } from 'lucide-react';
import { healthApi } from '../services/api';

export default function Home() {
    const [serverStatus, setServerStatus] = useState('checking');

    useEffect(() => {
        let isMounted = true;

        const checkServer = async () => {
            try {
                await healthApi.getStatus();
                if (isMounted) {
                    setServerStatus('connected');
                }
            } catch {
                if (isMounted) {
                    setServerStatus('offline');
                }
            }
        };

        checkServer();

        return () => {
            isMounted = false;
        };
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-zinc-900 scroll-smooth">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg z-50 border-b border-zinc-200 transition-all duration-300">
                <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-12">
                        <Link to="/" className="flex items-center gap-2 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="w-9 h-9 bg-airbnb-500 rounded-xl flex items-center justify-center shadow-air group-hover:scale-105 transition-transform duration-300">
                                <span className="text-white font-bold text-xl">I</span>
                            </div>
                            <span className="text-xl font-bold text-zinc-900 tracking-tight group-hover:text-airbnb-600 transition-colors">Inventory</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                            <button onClick={() => scrollToSection('features')} className="hover:text-slate-900 transition-colors">Features</button>
                            <button onClick={() => scrollToSection('who-its-for')} className="hover:text-slate-900 transition-colors">Who It's For</button>
                            <button onClick={() => scrollToSection('pricing')} className="hover:text-slate-900 transition-colors">Pricing</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline text-xs font-semibold text-slate-500">
                            API: {serverStatus}
                        </span>
                        <Link to="/login" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
                            Log in
                        </Link>
                        <Link to="/register" className="px-5 py-2.5 text-sm font-bold bg-airbnb-500 text-white rounded-xl hover:bg-airbnb-600 transition-all transform hover:-translate-y-0.5 shadow-air">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-40 pb-24 overflow-hidden">
                {/* Background Gradient Mesh - Muted Professional Tones */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-stone-100"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-airbnb-50 rounded-full blur-3xl opacity-70"></div>
                    <div className="absolute top-48 -left-24 w-72 h-72 bg-slate-100 rounded-full blur-3xl opacity-60"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="max-w-2xl animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-slate-200">
                                <span className="w-2 h-2 rounded-full bg-slate-700 animate-pulse"></span>
                                New Version 2.0 Live
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                                Inventory Software <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-airbnb-600 to-zinc-700">Built for Business.</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                                Stop wrestling with spreadsheets. Inventory gives you the visibility you need to balance stock, manage sales, and grow your business with confidence.
                            </p>

                            <div className="bg-white p-2 rounded-2xl shadow-air max-w-md border border-zinc-100 transform transition-all hover:scale-[1.01]">
                                <form className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="email"
                                        placeholder="Enter your work email"
                                        className="flex-1 px-4 py-3 text-slate-700 outline-none rounded-lg bg-transparent placeholder:text-slate-400"
                                    />
                                    <Link
                                        to="/register"
                                        className="px-6 py-3 bg-airbnb-500 text-white font-bold rounded-xl hover:bg-airbnb-600 transition-all shadow-air whitespace-nowrap flex items-center justify-center gap-2"
                                    >
                                        Start Free Trial <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </form>
                            </div>
                            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                    <span>14-day free trial</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                    <span>Instant access</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative lg:h-[600px] flex items-center justify-center">
                            <div className="relative z-10 w-full animate-fade-in-left delay-200">
                                <img
                                    src={HeroImage}
                                    alt="Dashboard Preview"
                                    className="rounded-2xl shadow-2xl border-4 border-white/50 backdrop-blur-sm w-full object-cover transform rotate-1 hover:rotate-0 transition-all duration-700"
                                />
                                {/* Floating Badge 1 */}
                                <div className="absolute -left-8 top-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
                                    <div className="p-2 bg-emerald-50 rounded-lg">
                                        <BarChart3 className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase">Monthly Sales</p>
                                        <p className="text-lg font-bold text-slate-900">$12,450</p>
                                    </div>
                                </div>
                                {/* Floating Badge 2 */}
                                <div className="absolute -right-4 bottom-24 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-delayed">
                                    <div className="p-2 bg-airbnb-50 rounded-lg">
                                        <Users className="w-6 h-6 text-airbnb-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase">Active Users</p>
                                        <p className="text-lg font-bold text-slate-900">24 Online</p>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-airbnb-100/60 to-slate-100/50 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Proof */}
            <section className="py-10 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by growing retail and warehouse teams</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Logos */}
                        <div className="text-xl font-bold font-serif text-slate-600">Acme Corp</div>
                        <div className="text-xl font-bold font-mono text-slate-600">GlobalTech</div>
                        <div className="text-xl font-bold text-slate-600 italic">InventoryPro</div>
                        <div className="text-xl font-black text-slate-600 tracking-tighter">LOGISTICA</div>
                        <div className="text-xl font-medium text-slate-600">WareHouse+</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Everything you need to scale</h2>
                        <p className="text-xl text-slate-600">Powerful features designed to help you manage your inventory effectively, from tracking stock to generating actionable insights.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-airbnb-600 to-airbnb-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            <div className="w-14 h-14 bg-airbnb-50 rounded-2xl flex items-center justify-center text-airbnb-600 mb-8 group-hover:bg-airbnb-600 group-hover:text-white transition-colors duration-300">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Real-time Tracking</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Monitor stock levels in real-time across multiple locations. Get low stock alerts instantly and never run out of your best-selling items again.
                            </p>
                            <a href="#" className="flex items-center gap-2 text-airbnb-600 font-semibold group-hover:translate-x-1 transition-transform">Learn more <ArrowRight className="w-4 h-4" /></a>
                        </div>

                        <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                <BarChart3 className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Smart Reports</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Visual analytics that help you deduce what's selling and what's not. Make data-driven decisions to grow your profits with one-click reports.
                            </p>
                            <a href="#" className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:translate-x-1 transition-transform">Learn more <ArrowRight className="w-4 h-4" /></a>
                        </div>

                        <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">Secure & Reliable</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Your data is safe with enterprise-grade security and role-based access control. Manage permissions for your staff and keep sensitive data secure.
                            </p>
                            <a href="#" className="flex items-center gap-2 text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">Learn more <ArrowRight className="w-4 h-4" /></a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who It's For Section */}
            <section id="who-its-for" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium mb-6">
                                Solutions for everyone
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Built for modern businesses of all sizes</h2>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                                Whether you're just starting out as a retailer or managing a complex wholesale operation, Inventory adapts to your workflow.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                                        <Store className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Retailers</h3>
                                        <p className="text-slate-400 leading-relaxed">Manage point-of-sale transactions and track real-time inventory across multiple physical shelves effortlessly.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                                        <Building2 className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Wholesalers</h3>
                                        <p className="text-slate-400 leading-relaxed">Handle bulk orders, manage multiple suppliers, and streamline your complex procurement process.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                                        <Users className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Growing Teams</h3>
                                        <p className="text-slate-400 leading-relaxed">Scale your team with granular permissions, audit logs, and collaborative tools designed for growth.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
                            <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 relative shadow-2xl">
                                {/* Dashboard Mockup UI */}
                                <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <div className="ml-auto w-1/3 h-2 bg-slate-700 rounded-full"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                                            <BarChart3 className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="h-2 w-20 bg-slate-600 rounded-full mb-3"></div>
                                        <div className="h-6 w-16 bg-slate-500 rounded-full"></div>
                                    </div>
                                    <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
                                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                                            <Zap className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div className="h-2 w-20 bg-slate-600 rounded-full mb-3"></div>
                                        <div className="h-6 w-16 bg-slate-500 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
                                    <div className="flex justify-between mb-4">
                                        <div className="h-3 w-32 bg-slate-600 rounded-full"></div>
                                        <div className="h-3 w-12 bg-slate-700 rounded-full"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-12 w-full bg-slate-700/40 rounded-lg"></div>
                                        <div className="h-12 w-full bg-slate-700/40 rounded-lg"></div>
                                        <div className="h-12 w-full bg-slate-700/40 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing CTA */}
            <section id="pricing" className="py-32 bg-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">Ready to streamline your inventory?</h2>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">Join thousands of business owners who trust Inventory to manage their stock and grow their business.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="px-8 py-4 text-lg font-bold bg-airbnb-500 text-white rounded-xl hover:bg-airbnb-600 transition-all shadow-air transform hover:-translate-y-1">
                            Get Started Free
                        </Link>
                        <button onClick={() => scrollToSection('features')} className="px-8 py-4 text-lg font-bold bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all hover:border-slate-300">
                            Learn More
                        </button>
                    </div>
                    <p className="mt-6 text-sm text-slate-400">14-day free trial • Cancel anytime</p>
                </div>
            </section>

            <footer className="bg-white py-12 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-airbnb-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">I</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Inventory</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        © 2025 Inventory. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
