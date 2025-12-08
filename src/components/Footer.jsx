import React from 'react';

const Footer = () => (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 px-4 text-center text-sm">
        <div className="max-w-6xl mx-auto border-t border-slate-800 pt-8">
            <p className="text-white font-serif font-bold text-lg mb-4">Олег Тетченко</p>
            <p className="mb-8">Кинезиология и остеопрактика. Комплексный подход к здоровью.</p>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-8">
                <a href="#" className="hover:text-white transition">Политика конфиденциальности</a>
                <a href="#" className="hover:text-white transition">Договор оферты</a>
            </div>
            <p className="opacity-50">© {new Date().getFullYear()} Олег Тетченко. Все права защищены.</p>

            <div className="mt-8 pt-4 border-t border-slate-800/50">
                <a href="https://t.me/ant2424" target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0" className="w-5 h-5 fill-current">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0Zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635Z" />
                        </svg>
                    </div>
                    <div className="text-left leading-tight">
                        <p className="text-[11px] font-medium opacity-90 text-sky-50 uppercase tracking-wider">Разработка сайтов и приложений</p>
                        <p className="text-sm font-bold">Антон Федотов</p>
                    </div>
                </a>
            </div>
        </div>
    </footer>
);

export default Footer;
