import React, { useState, useEffect } from 'react';
import { Menu, X } from './ui/icons';
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

    const navItems = [
        { name: 'Симптомы', id: 'problems' },
        { name: 'Методика', id: 'method' },
        { name: 'Приём', id: 'steps' },
        { name: 'Кейсы', id: 'cases' },
        { name: 'Обо мне', id: 'about' },
        { name: 'Контакты', id: 'contacts' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center cursor-pointer gap-2 md:gap-4" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    {/* Logo - visible on all devices */}
                    <img src="/images/logo.png" alt="Logo" className="h-8 w-8 md:h-12 md:w-12 object-contain" />

                    <h1 className="font-serif font-bold text-slate-800 flex items-center gap-2 text-sm md:text-2xl">
                        <span className="font-sans font-medium text-slate-500 text-xs md:text-xl">Кинезиолог |</span> Олег Тетченко
                    </h1>
                </div>

                <div className="hidden xl:flex items-center space-x-6">
                    <nav className="flex space-x-5">
                        {navItems.map(item => (
                            <button key={item.name} onClick={() => scrollTo(item.id)} className="text-sm font-medium text-slate-600 hover:text-brand-purple transition">
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    <Button onClick={onOpenModal} variant="primary" className="py-2 px-4 text-sm">
                        Бесплатная консультация
                    </Button>
                </div>

                <button className="xl:hidden p-2 text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col space-y-4 xl:hidden animate-fade-in max-h-[80vh] overflow-y-auto">
                    {navItems.map(item => (
                        <button key={item.name} onClick={() => scrollTo(item.id)} className="text-left text-lg font-medium text-slate-700 py-2 border-b border-slate-50">
                            {item.name}
                        </button>
                    ))}
                    <Button onClick={() => { setIsMenuOpen(false); onOpenModal(); }} className="w-full mt-4">
                        Получить консультацию
                    </Button>
                </div>
            )}
        </header>
    );
};

export default Header;
