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
                <a href="https://t.me/ant2424" target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-slate-600 hover:text-slate-400 transition-colors">
                    <p>Разработка сайтов и приложений</p>
                    <p className="font-bold mt-0.5">Антон Федотов</p>
                </a>
            </div>
        </div>
    </footer>
);

export default Footer;
