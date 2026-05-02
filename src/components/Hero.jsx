import React from 'react';
import { Star, Check } from './ui/icons';
import Button from './ui/Button';

const Hero = () => (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 md:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-purple/20 to-transparent -z-10 rounded-l-[100px]"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-teal/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1 md:order-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-[1.15] mb-4">
                    Олег Тетченко
                </h1>
                <p className="text-xl md:text-2xl font-serif font-bold gradient-text mb-6">
                    Кинезиолог | Специалист по телесным практикам
                </p>

                <div className="mb-8 space-y-6">
                    <p className="text-xl md:text-2xl font-serif font-medium text-slate-800 leading-tight">
                        Помогаю снизить напряжение в теле, улучшить подвижность и вернуть комфорт движения
                    </p>
                    <p className="text-slate-600 leading-relaxed max-w-lg">
                        Работаю с источниками напряжения в теле, помогаю восстановить лёгкость движения, улучшить самочувствие и вернуть комфорт в повседневной жизни.
                    </p>
                </div>

                <div className="flex items-center gap-3 mb-10 text-slate-800 font-bold">
                    <div className="bg-brand-purple/10 text-brand-purple rounded-full p-1.5 flex-shrink-0">
                        <Check size={18} />
                    </div>
                    Работаю со взрослыми и детьми
                </div>
            </div>

            <div className="order-2 md:order-2 relative flex justify-center md:block">
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-slate-200 aspect-[4/5] md:max-w-md md:mx-auto">
                    <img
                        src="/images/hero_photo_purple.jpg"
                        alt="Олег Тетченко"
                        className="w-full h-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-6 md:p-8 pt-24">
                        <h3 className="text-white font-serif text-2xl md:text-3xl font-bold leading-tight mb-1">Олег Тетченко</h3>
                        <p className="text-slate-200 text-sm md:text-base font-medium opacity-90">Кинезиолог · Специалист по телесным практикам</p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="text-white text-xs md:text-sm font-medium">Отзывы:</span>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" stroke="none" className="mr-0.5 last:mr-0 drop-shadow-sm" />
                                ))}
                            </div>
                            <span className="text-white font-bold text-xs md:text-sm bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10">5.0</span>
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-purple rounded-full opacity-10 blur-2xl"></div>
            </div>

            <div className="order-3 md:col-start-1 md:-mt-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="flex flex-col gap-4">
                        <Button
                            id="hero-cta-button"
                            onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-lg px-8 py-4 shadow-brand-purple/30"
                        >
                            Записаться на первую встречу
                        </Button>
                        <a
                            href="tel:+79320990444"
                            className="flex items-center gap-2 text-slate-600 hover:text-brand-purple transition-colors font-bold px-4"
                        >
                            <span className="text-sm opacity-60 font-normal">Телефон:</span>
                            +7 932 099 0444
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default Hero;
