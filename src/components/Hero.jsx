import React from 'react';
import { Star, Check } from './ui/icons';
import Button from './ui/Button';

const Hero = ({ onOpenModal }) => (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 md:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-purple/20 to-transparent -z-10 rounded-l-[100px]"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-teal/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="order-1">
                <div className="relative pl-6 md:pl-10">
                    {/* Vertical Accent Line */}
                    <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-gradient-to-b from-brand-purple to-brand-teal rounded-full opacity-60"></div>

                    <div className="space-y-8">
                        <p className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-[1.2] tracking-tight">
                            Помогаю снизить напряжение в теле, улучшить подвижность и вернуть комфорт движения
                        </p>
                        
                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                            Работаю с источниками напряжения в теле, помогаю восстановить лёгкость движения, улучшить самочувствие и вернуть комфорт в повседневной жизни.
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="inline-flex items-center gap-3 bg-brand-teal/10 text-brand-teal px-5 py-2.5 rounded-2xl border border-brand-teal/20 shadow-sm">
                                <div className="bg-brand-teal text-white rounded-full p-1 flex-shrink-0">
                                    <Check size={16} />
                                </div>
                                <span className="font-bold text-sm md:text-base uppercase tracking-wider">Работаю со взрослыми и детьми</span>
                            </div>
                        </div>

                        <div className="pt-4 hidden md:block">
                            <Button
                                id="hero-cta-button-desktop"
                                onClick={onOpenModal}
                                className="text-base px-8 py-4 shadow-brand-purple/20"
                            >
                                Записаться на встречу
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="order-2 relative flex flex-col items-center md:items-end">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200 aspect-[4/5] w-full max-w-[320px] md:max-w-sm">
                    <img
                        src="/images/hero_photo_purple.jpg"
                        alt="Олег Тетченко"
                        className="w-full h-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-6 pt-16">
                        <h3 className="text-white font-serif text-xl md:text-2xl font-bold leading-tight mb-0.5">Олег Тетченко</h3>
                        <p className="text-slate-200 text-xs md:text-sm font-medium opacity-90">Специалист по телесным практикам</p>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" stroke="none" className="mr-0.5" />
                                    ))}
                                </div>
                                <span className="text-white font-bold text-xs bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">5.0</span>
                            </div>
                            <span className="text-white/40 text-xs">|</span>
                            <a href="tel:+79320990444" className="text-white/90 text-xs md:text-sm font-bold hover:text-white transition-colors">
                                +7 932 099 0444
                            </a>
                        </div>
                    </div>
                </div>

                {/* Mobile Button - visible only on small screens */}
                <div className="w-full max-w-[320px] mt-8 md:hidden">
                    <Button
                        id="hero-cta-button-mobile"
                        onClick={onOpenModal}
                        className="w-full text-base py-4 shadow-brand-purple/20"
                    >
                        Записаться на встречу
                    </Button>
                </div>
                
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-purple rounded-full opacity-10 blur-2xl -z-10"></div>
            </div>
        </div>
    </section>
);

export default Hero;
