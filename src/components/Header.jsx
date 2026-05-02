import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from './ui/icons';
import Button from './ui/Button';

const Header = ({ onOpenModal }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        setIsMenuOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const navItems = [
        { name: 'Запросы', id: 'problems' },
        { name: 'Методика', id: 'method' },
        { name: 'Направления', id: 'directions' },
        { name: 'Отзывы', id: 'cases' },
        { name: 'Обо мне', id: 'about' },
        { name: 'Контакты', id: 'contacts' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isMenuOpen ? 'z-[200] bg-white' : scrolled ? 'z-40 glass shadow-sm py-3' : 'z-40 bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center cursor-pointer gap-2 md:gap-4" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    {/* Logo - visible on all devices */}
                    <img src="/images/logo.png" alt="Logo" className="h-8 w-8 md:h-12 md:w-12 object-contain" />

                    <h1 className="font-serif font-bold text-slate-800 flex items-center gap-2 text-base md:text-2xl">
                        Специалист по телесным практикам
                    </h1>
                </div>

                <div className="hidden lg:flex items-center space-x-6">
                    <nav className="flex space-x-5">
                        {navItems.map(item => (
                            <button key={item.name} onClick={() => scrollTo(item.id)} className="text-sm font-medium text-slate-600 hover:text-brand-purple transition">
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    <a href="tel:+79320990444" className="inline-flex items-center justify-center font-medium transition-all duration-300 transform active:scale-95 px-5 py-2.5 rounded-full bg-brand-purple text-white shadow-lg hover:shadow-xl hover:brightness-110 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Позвонить
                    </a>
                </div>

                <button className="lg:hidden p-2 text-slate-800 relative z-[110]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* Full Screen Mobile Menu Overlay - Instant Open */}
            <div className={`fixed inset-0 bg-white z-[100] flex flex-col lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Top Bar inside menu to maintain logo and close button consistency */}
                <div className="p-6 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-2">
                         <img src="/images/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
                         <span className="font-serif font-bold text-slate-800 text-lg tracking-tight">Олег Тетченко</span>
                    </div>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-8">
                    <nav className="flex flex-col items-center space-y-6">
                        {navItems.map((item) => (
                            <button 
                                key={item.name} 
                                onClick={() => scrollTo(item.id)} 
                                className="text-3xl font-serif font-bold text-slate-800 hover:text-brand-purple transition-all transform active:scale-95"
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>
                    
                    <div className="w-16 h-1 bg-slate-100 rounded-full"></div>

                    <Button onClick={onOpenModal} className="w-full text-base py-4 shadow-brand-purple/20">
                        Записаться на встречу
                    </Button>
                    <a href="tel:+79320990444" className="flex flex-col items-center gap-2 group">
                        <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Или позвоните</span>
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span className="text-2xl font-bold text-brand-purple group-active:scale-95 transition-transform">+7 932 099 0444</span>
                        </div>
                    </a>
                </div>

                <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-center">
                    <div className="flex gap-8 text-slate-400">
                         <span className="text-sm font-medium italic">Олег Тетченко — Телесные практики</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
