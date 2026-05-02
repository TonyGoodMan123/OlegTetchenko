import React from 'react';
import Section from './ui/Section';
import SectionTitle from './ui/SectionTitle';
import { ShieldCheck, AlertTriangle } from './ui/icons';

const Method = () => (
    <Section id="method">
        <SectionTitle
            title="Мануально-мышечное тестирование"
            subtitle="Ваше тело даёт точные ответы. Я лишь помогаю их услышать."
        />

        <div className="max-w-6xl mr-auto mb-16">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-soft relative overflow-hidden grid md:grid-cols-2 gap-10 items-center">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-brand-purple to-brand-teal"></div>

                <div className="relative z-10">
                    <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">
                        Что это такое?
                    </h3>

                    <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                        <p>
                            На первой встрече проводится <strong>мягкий анализ мышечного баланса</strong>, подвижности и общего состояния тела. Это базируется на знании биомеханики и анатомии человека.
                        </p>
                        <p>
                            Это помогает определить зоны напряжения, ограничения движения и подобрать <strong>индивидуальный план работы</strong>. Такой подход позволяет работать бережно, точно и эффективно.
                        </p>
                        <p className="flex items-center pt-2 font-medium text-brand-purple">
                            <ShieldCheck className="mr-2 flex-shrink-0" size={20} />
                            Безопасный и комплексный подход к восстановлению ресурса тела.
                        </p>
                    </div>
                </div>

                <div className="relative h-full min-h-[300px] md:min-h-0 rounded-2xl overflow-hidden shadow-md">
                    <img
                        src="/images/method_photo.jpg"
                        alt="Олег Тетченко - анализ состояния"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
                {
                    step: "01",
                    title: "Анализ через отклик мышц",
                    text: "С помощью мануально-мышечного теста я проверяю реакцию ваших мышц на лёгкое давление. Это «сигнал» тела о зонах напряжения или функционального ослабления."
                },
                {
                    step: "02",
                    title: "Поиск источника напряжения",
                    text: "Мы не работаем только там, где чувствуется дискомфорт. Мы находим, почему он возник. Часто причина напряжения в одном отделе кроется в дисбалансе другой зоны."
                },
                {
                    step: "03",
                    title: "Бережная коррекция",
                    text: "Используя мягкие техники работы с мышцами, связками и фасциями, я помогаю телу освободиться от накопленного напряжения и запустить процессы самовосстановления."
                },
                {
                    step: "04",
                    title: "Закрепление лёгкости",
                    text: "Чтобы эффект был долгим, я даю индивидуальные рекомендации: простые упражнения для дома и советы по повседневной активности для поддержания результата."
                }
            ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-6 opacity-10 font-serif text-8xl font-bold text-brand-purple select-none -mt-2 -mr-2">
                        {item.step}
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-slate-800 mb-3 pr-8">{item.title}</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {item.text}
                        </p>
                    </div>
                </div>
            ))}
        </div>

        <div className="max-w-5xl mr-auto mb-0">
            <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2 text-left">Направления работы</h3>
                <p className="text-slate-500 text-left mb-10 max-w-2xl mr-auto">
                    Для решения вашей задачи я использую комплексный подход и проверенные практики:
                </p>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
                    {[
                        { title: "Прикладная кинезиология", desc: "основа для точного анализа состояния." },
                        { title: "Телесные практики", desc: "мягкая коррекция баланса тела и подвижности." },
                        { title: "Висцеральные техники", desc: "работа с мягким снятием внутреннего напряжения." },
                        { title: "Кинезиотейпирование", desc: "поддержка мышц и комфорта после сеанса." },
                        { title: "Массажные техники", desc: "(миофасциальный, лимфодренажный) для снятия зажимов." },
                        { title: "Психоэмоциональный баланс", desc: "работа с последствиями стресса в теле." },
                        { title: "Основы благополучия", desc: "рекомендации по образу жизни для поддержки тела." }
                    ].map((method, idx) => (
                        <div key={idx} className="flex items-start">
                            <div className="w-2 h-2 mt-2.5 rounded-full bg-brand-purple flex-shrink-0 mr-4"></div>
                            <p className="text-slate-700">
                                <span className="font-bold text-slate-800">{method.title}</span> — {method.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="w-full bg-gradient-to-r from-brand-purple to-brand-teal text-white rounded-2xl p-6 md:p-8 shadow-lg shadow-brand-teal/20 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="text-white/90 flex-shrink-0 mt-1 hidden sm:block bg-white/20 p-3 rounded-full">
                        <AlertTriangle size={32} />
                    </div>
                    <div className="relative z-10 flex-grow">
                        <p className="font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2 text-white/90">
                            <span className="sm:hidden text-white bg-white/20 p-1.5 rounded-full"><AlertTriangle size={20} /></span>
                            Важная информация
                        </p>
                        <p className="text-sm text-white/90 leading-relaxed">
                            Перед записью, пожалуйста, сообщите о наличии острых состояний, требующих неотложной помощи, или серьёзных ограничений по здоровью. Моя работа направлена на общее оздоровление и не заменяет квалифицированную медицинскую помощь в острых случаях.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </Section>
);

export default Method;
