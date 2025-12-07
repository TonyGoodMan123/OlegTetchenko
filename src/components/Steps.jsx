import React from 'react';
import Section from './ui/Section';
import SectionTitle from './ui/SectionTitle';
import { Users } from './ui/icons';

const Steps = ({ onOpenModal }) => (
    <Section id="steps" bg="white" className="relative overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-teal/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 -z-10 pointer-events-none"></div>

        <SectionTitle title="Как проходит приём" />

        <div className="flex justify-start mb-16 -mt-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-purple-50 rounded-full border border-purple-100 text-brand-purple shadow-sm">
                <Users size={18} />
                <span className="text-sm font-medium text-slate-700">Возрастная категория: <span className="font-bold">подростки от 10 лет и взрослые</span></span>
            </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
            <div className="hidden lg:block absolute top-12 left-0 w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-brand-purple via-brand-teal to-brand-purple"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
                {[
                    { num: "1", title: "Консультация", text: "Подробно обсуждаем ваши жалобы, историю и цели." },
                    { num: "2", title: "Диагностика", text: "Провожу мануально-мышечное тестирование и осмотр." },
                    { num: "3", title: "Обсуждение", text: "Чётко объясняю, что нашёл, в чём причина и как будем это исправлять." },
                    { num: "4", title: "Коррекция", text: "Проводим первый сеанс терапии по устранению ключевых нарушений." },
                    { num: "5", title: "Рекомендации", text: "Даю понятные инструкции на ближайшие дни." }
                ].map((step, idx) => (
                    <div key={idx} className="relative group">
                        {idx !== 4 && (
                            <div className="lg:hidden absolute left-8 top-16 bottom-[-2rem] w-1 bg-slate-100 z-0"></div>
                        )}

                        <div className="flex flex-col h-full relative z-10">
                            <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-50 shadow-lg flex items-center justify-center text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-brand-purple to-brand-teal mb-6 mx-auto lg:mx-auto relative z-10 group-hover:scale-110 transition-transform duration-300">
                                {step.num}
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-lg transition-all duration-300 flex-grow text-center relative">
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-100 transform rotate-45"></div>

                                <h4 className="font-bold text-lg text-slate-800 mb-3">{step.title}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{step.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </Section>
);

export default Steps;
