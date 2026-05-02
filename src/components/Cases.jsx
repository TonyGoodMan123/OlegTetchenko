import React, { useState, useEffect } from 'react';
import Section from './ui/Section';
import SectionTitle from './ui/SectionTitle';
import { Star, ShieldCheck, ChevronLeft, ChevronRight } from './ui/icons';

const Cases = () => {
    const feedbackPoints = [
        "уменьшение напряжения",
        "лёгкость движения",
        "улучшение самочувствия",
        "снижение ощущения усталости",
        "улучшение осанки",
        "комфорт в теле"
    ];

    const testimonials = [
        {
            name: "Елена",
            text: "Обратилась с постоянным напряжением в шее и скованностью. После нескольких встреч почувствовала невероятную лёгкость. Олег работает очень бережно и профессионально.",
            role: "Клиент"
        },
        {
            name: "Алексей",
            text: "Активно занимаюсь спортом, часто бывают мышечные перегрузки. Работа с Олегом помогает быстрее восстанавливаться и поддерживать тело в тонусе. Очень эффективная методика.",
            role: "Спортсмен-любитель"
        },
        {
            name: "Мария",
            text: "Приводила ребёнка 10 лет для коррекции осанки. Олег сразу нашёл подход, всё прошло в спокойной обстановке. Заметили, что ребёнок стал меньше сутулиться и стал бодрее.",
            role: "Мама клиента"
        },
        {
            name: "Иван",
            text: "Понравилось, что работа идёт через тестирование — тело само подсказывает, где есть зажимы. Всё очень наглядно. Ощущение комфорта в теле сохраняется надолго.",
            role: "Клиент"
        }
    ];

    const [activeIdx, setActiveIdx] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isHovered, testimonials.length]);

    return (
        <Section id="cases" bg="white">
            <SectionTitle
                title="Отзывы клиентов"
                subtitle="Многие отмечают изменения уже после первых встреч"
            />

            <div className="max-w-6xl mx-auto mb-20">
                <div 
                    className="relative bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-soft overflow-hidden group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-teal/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex justify-center mb-8">
                            <div className="flex text-yellow-400 gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" stroke="none" />)}
                            </div>
                        </div>

                        <div className="min-h-[200px] flex items-center justify-center text-center px-4 md:px-12">
                            <div className="animate-fade-in key={activeIdx}">
                                <p className="text-xl md:text-2xl font-serif italic text-slate-700 leading-relaxed mb-8">
                                    "{testimonials[activeIdx].text}"
                                </p>
                                <h4 className="text-lg font-bold text-slate-900">{testimonials[activeIdx].name}</h4>
                                <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">{testimonials[activeIdx].role}</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                                className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all text-slate-600 hover:text-brand-purple"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={() => setActiveIdx((prev) => (prev + 1) % testimonials.length)}
                                className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all text-slate-600 hover:text-brand-purple"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        <div className="flex justify-center gap-3 mt-12">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIdx(i)}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === activeIdx ? "w-10 bg-brand-purple" : "w-2 bg-slate-200 hover:bg-slate-300"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                    <h3 className="text-2xl font-serif font-bold text-slate-800 mb-8 relative z-10">
                        После первых встреч многие отмечают:
                    </h3>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-2 relative z-10">
                        {feedbackPoints.map((point, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="bg-white text-brand-purple rounded-full p-2 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="text-lg text-slate-700 font-medium">{point}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, x) => <Star key={x} size={20} fill="currentColor" stroke="none" />)}
                            </div>
                            <span className="font-bold text-slate-800 text-lg">5.0</span>
                        </div>
                        <p className="text-slate-500 text-sm italic text-center md:text-right max-w-sm">
                            Моя задача — помочь телу вернуть естественный баланс и комфорт движения через мягкие телесные практики.
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Cases;
