const Footer = () => (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 px-4 text-center text-sm">
        <div className="max-w-6xl mx-auto border-t border-slate-800 pt-8">
            <div className="max-w-2xl mx-auto mb-10 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs leading-relaxed">
                <p className="font-bold text-slate-100 mb-2 uppercase tracking-widest">Важно</p>
                <p>Практики носят консультативный и восстановительный характер, не являются медицинскими услугами и не заменяют обращение к врачу.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-8">
                <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Политика конфиденциальности</a>
                <a href="/consent.html" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Согласие на обработку ПД</a>
            </div>
            <p className="opacity-50">© {new Date().getFullYear()} Олег Тетченко. Все права защищены.</p>

            <div className="mt-8 pt-4 border-t border-slate-800/50">
                <a href="https://t.me/ant2424" target="_blank" rel="noopener noreferrer"
                    className="group inline-flex flex-col items-center justify-center px-6 py-2.5 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
                    <p className="text-[10px] font-medium opacity-50 text-slate-400 uppercase tracking-widest leading-tight">Разработка сайтов и приложений</p>
                    <p className="text-xs font-bold text-slate-300 leading-tight mt-0.5">Антон Федотов</p>
                </a>
            </div>
        </div>
    </footer>
);

export default Footer;
