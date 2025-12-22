import React from 'react';

const Footer = () => (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 px-4 text-center text-sm">
        <div className="max-w-6xl mx-auto border-t border-slate-800 pt-8">
            <p className="text-white font-serif font-bold text-lg mb-4">Олег Тетченко</p>
            <p className="mb-8">Кинезиология и остеопрактика. Комплексный подход к здоровью.</p>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-8">
                <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Политика конфиденциальности</a>
                <a href="/consent.html" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Согласие на обработку ПД</a>
            </div>
            <p className="opacity-50">© {new Date().getFullYear()} Олег Тетченко. Все права защищены.</p>

            <div className="mt-8 pt-4 border-t border-slate-800/50">
                <a href="https://t.me/ant2424" target="_blank" rel="noopener noreferrer"
                    className="group inline-flex flex-col items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-[#4B3990]/40 to-[#008F85]/40 hover:from-[#4B3990]/60 hover:to-[#008F85]/60 border border-white/5 hover:border-white/10 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
                    <p className="text-[11px] font-medium opacity-60 text-indigo-100 uppercase tracking-widest leading-tight">Разработка сайтов и приложений</p>
                    <p className="text-sm font-bold opacity-90 leading-tight mt-0.5">Антон Федотов</p>
                </a>
            </div>
        </div>
    </footer>
);

export default Footer;
