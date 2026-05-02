import React from 'react';
import SectionTitle from './ui/SectionTitle';
import Card from './ui/Card';
import {
    CustomSpineHernia, CustomScoliosis, CustomBone, CustomMomBaby,
    CustomHeadStorm, CustomSleep, CustomStomach, CustomHeadTangle, CustomFoot
} from './ui/icons';

const Problems = () => {
    const items = [
        {
            category: "Позвоночник и спина",
            title: "Дискомфорт в спине, шее и пояснице",
            text: "Работа с ощущением стянутости, скованности и дискомфорта в любом отделе позвоночника через поиск мышечных дисбалансов.",
            icon: CustomSpineHernia,
            image: "/icons/hernia.png"
        },
        {
            category: "Осанка и баланс",
            title: "Нарушение осанки у детей и взрослых",
            text: "Коррекция сутулости, привычного наклона головы или перекоса плеч. Работа с визуальной симметрией тела и лёгкостью походки.",
            icon: CustomScoliosis,
            image: "/icons/spine.png"
        },
        {
            category: "Плечевой пояс",
            title: "Напряжение в плечах и грудном отделе",
            text: "Снятие чувства «тяжести» на плечах, скованности в лопатках и ограничений при глубоком дыхании.",
            icon: CustomBone,
            image: "/icons/injury.png"
        },
        {
            category: "Подвижность",
            title: "Ограничение подвижности суставов",
            text: "Восстановление комфортной амплитуды движения в руках, ногах и тазобедренном поясе без грубых манипуляций.",
            icon: CustomMomBaby,
            image: "/icons/mom_baby.png"
        },
        {
            category: "Голова и шея",
            title: "Головное напряжение и усталость",
            text: "Работа с зажимами в области шеи и затылка, которые вызывают чувство тяжести в голове и быструю утомляемость.",
            icon: CustomHeadStorm,
            image: "/icons/headache.png"
        },
        {
            category: "Ресурс и энергия",
            title: "Снижение общего ресурса организма",
            text: "Когда нет сил, быстро наступает усталость и тело ощущается «не в тонусе», несмотря на отсутствие явных причин.",
            icon: CustomSleep,
            image: "/icons/sleep.png"
        },
        {
            category: "Живот и таз",
            title: "Напряжение в области живота и таза",
            text: "Мягкая работа с балансом таза и снятие внутреннего напряжения в области живота для улучшения общего самочувствия.",
            icon: CustomStomach,
            image: "/icons/stomach.png"
        },
        {
            category: "Эмоции и тело",
            title: "Работа со стрессом и напряжением",
            text: "Освобождение тела от «зажимов», вызванных эмоциональными перегрузками, работа с чувством кома в горле или тяжести в груди.",
            icon: CustomHeadTangle,
            image: "/icons/psychology.png"
        },
        {
            category: "Здоровье стоп",
            title: "Проблемы стоп и индивидуальные стельки",
            text: "Быстрая утомляемость ног, боли в стопах, плоскостопие. Диагностика на специальном аппарате (подоскопе) и изготовление персональных стелек под вашу биомеханику.",
            icon: CustomFoot,
            image: "/icons/foot.png"
        }
    ];

    return (
        <section id="problems" className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden bg-white scroll-mt-20">
            {/* Hero-like Background with Energy Waves - Full Flex/Responsive */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-brand-purple/5 via-transparent to-brand-teal/5 -z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-brand-purple/5 to-transparent -z-10 rounded-bl-[100px] pointer-events-none opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-brand-teal/5 to-transparent -z-10 rounded-tr-[100px] pointer-events-none opacity-60"></div>

            {/* Smooth Energy Lines SVG */}
            <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0,100 C150,200 300,0 500,100 S800,200 1000,100 S1500,0 2000,100" stroke="url(#energy-gradient-1)" strokeWidth="2" fill="none" className="animate-pulse-slow" />
                <path d="M0,300 C200,400 400,200 600,300 S900,400 1200,300 S1800,200 2000,300" stroke="url(#energy-gradient-2)" strokeWidth="3" fill="none" style={{ animationDelay: '1s' }} />
                <path d="M0,600 C300,500 600,700 900,600 S1400,500 2000,600" stroke="url(#energy-gradient-1)" strokeWidth="2" fill="none" style={{ animationDelay: '2s' }} />

                <defs>
                    <linearGradient id="energy-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#591d81" stopOpacity="0" />
                        <stop offset="50%" stopColor="#591d81" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#591d81" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="energy-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0" />
                        <stop offset="50%" stopColor="#0d9488" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="max-w-6xl mx-auto relative z-10">
                <SectionTitle
                    title="С какими запросами я работаю"
                    subtitle="Я помогаю восстановить баланс тела в ситуациях, когда вы чувствуете напряжение, дискомфорт или ограничение привычной лёгкости движения."
                />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {items.map((item, idx) => (
                        <Card key={idx} className="relative h-full hover:-translate-y-1 transition-transform flex flex-col items-start bg-slate-50 border border-slate-100 rounded-2xl p-6 pt-8 text-left">
                            <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-purple shadow-sm overflow-hidden p-2.5 border border-slate-50">
                                {item.image ? (
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-contain" 
                                        loading="lazy"
                                        decoding="async"
                                    />
                                ) : (
                                    <item.icon size={24} />
                                )}
                            </div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pr-12">{item.category}</div>
                            <h3 className="text-lg font-bold text-slate-800 mb-3 pr-10 leading-tight">{item.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm flex-grow">{item.text}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Problems;
