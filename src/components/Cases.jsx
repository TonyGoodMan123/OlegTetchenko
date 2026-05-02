import React from 'react';
import Section from './ui/Section';
import SectionTitle from './ui/SectionTitle';
import { Star, ShieldCheck } from './ui/icons';

const Cases = () => {
    const feedbackPoints = [
        "уменьшение напряжения",
        "лёгкость движения",
        "улучшение самочувствия",
        "снижение ощущения усталости",
        "улучшение осанки",
        "комфорт в теле"
    ];

    return (
        <Section id="cases" bg="white">
            <SectionTitle
                title="Отзывы клиентов"
                subtitle="Многие отмечают изменения уже после первых встреч"
            />

            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    
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
