import React from 'react';
import SectionTitle from './ui/SectionTitle';
import Card from './ui/Card';
import {
    CustomSpineHernia, CustomScoliosis, CustomBone, CustomMomBaby,
    CustomHeadStorm, CustomSleep, CustomStomach, CustomHeadTangle, CustomFoot
} from './ui/icons';

const Problems = ({ onOpenModal }) => {
    const items = [
        {
            category: "Опорно-двигательный аппарат",
            title: "Грыжи, протрузии, боль в спине",
            text: "Тянет, «стреляет», ломит. Боль в пояснице, шее, межлопаточной области. Безопасная работа с грыжами, протрузиями и остеохондрозом без грубых манипуляций.",
            icon: CustomSpineHernia,
            image: "/icons/hernia.png"
        },
        {
            category: "Осанка и походка",
            title: "Сколиоз и нарушения осанки",
            text: "Функциональный сколиоз, сутулость, перекос таза, «разная длина ног», ограничения в суставах, чувство перекоса тела при стоянии или ходьбе.",
            icon: CustomScoliosis,
            image: "/icons/spine.png"
        },
        {
            category: "После травм и операций",
            title: "Последствия травм, операций, болезней",
            text: "После травм, хирургии или тяжёлых заболеваний остаётся стянутость, боль, ощущение «не восстановился как раньше», ограничение в движениях.",
            icon: CustomBone,
            image: "/icons/injury.png"
        },
        {
            category: "После родов и длительных нагрузок",
            title: "Состояние после родов и длительных нагрузок",
            text: "Боли в спине и тазу, чувство, что «тело стало чужим», дискомфорт в области шрамов, нестабильность таза и поясницы, тяжесть после поднятия ребёнка или длительной работы «на ногах».",
            icon: CustomMomBaby,
            image: "/icons/mom_baby.png"
        },
        {
            category: "Голова и нервная система",
            title: "Головные боли, метеочувствительность",
            text: "Мигрени, тяжесть в голове, «туман», шум или звон, зависимость самочувствия от погоды, напряжение в шее и плечах, невозможность расслабиться.",
            icon: CustomHeadStorm,
            image: "/icons/headache.png"
        },
        {
            category: "Усталость и восстановление",
            title: "Хроническая усталость и нарушения сна",
            text: "Нет сил, сон не восстанавливает, просыпаетесь разбитым, часто просыпаетесь от боли или напряжения, при этом анализы «в норме».",
            icon: CustomSleep,
            image: "/icons/sleep.png"
        },
        {
            category: "Аллергоподобные реакции",
            title: "Пищевые реакции и «непонятные» симптомы",
            text: "Реакции на отдельные продукты, дискомфорт в животе, вздутие, колебания самочувствия после еды при отсутствии грубой патологии по обследованиям.",
            icon: CustomStomach,
            image: "/icons/stomach.png"
        },
        {
            category: "Психоэмоциональные проявления",
            title: "Стресс, который «застрял» в теле",
            text: "Напряжение в шее, челюсти, груди, ощущение кома в горле, тяжести в груди, дрожь, внутреннее беспокойство, которое проявляется через тело.",
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
        <section id="problems" className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden bg-white">
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
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0" />
                        <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
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
                    title="Симптомы и состояния, с которыми ко мне обращаются"
                    subtitle="Я работаю с широким спектром обратимых нарушений, когда тело показывает, что система дала сбой: боль, стянутость, ограничение движений, непонятные реакции на нагрузку или стресс."
                />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {items.map((item, idx) => (
                        <Card key={idx} className="relative h-full hover:-translate-y-1 transition-transform flex flex-col bg-slate-50 border border-slate-100 rounded-2xl p-6 pt-8">
                            <div className="absolute top-4 right-4 w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-brand-purple shadow-sm overflow-hidden p-3 border border-slate-100">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                                ) : (
                                    <item.icon size={32} />
                                )}
                            </div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pr-16">{item.category}</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 pr-16">{item.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm flex-grow">{item.text}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Problems;
