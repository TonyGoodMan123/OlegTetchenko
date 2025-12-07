import React from 'react';
import Section from './ui/Section';
import SectionTitle from './ui/SectionTitle';
import { ShieldCheck, AlertTriangle } from './ui/icons';

const Method = ({ onOpenModal }) => (
    <Section id="method">
        <SectionTitle
            title="О методе лечения"
            subtitle="Ваше тело — лучший диагност. Я лишь задаю ему правильные вопросы."
        />

        <div className="max-w-6xl mr-auto mb-16">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-soft relative overflow-hidden grid md:grid-cols-2 gap-10 items-center">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-brand-purple to-brand-teal"></div>

                <div className="relative z-10">
                    <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">
                        Что такое прикладная кинезиология?
                    </h3>

                    <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                        <p>
                            Это <strong>научно обоснованный метод</strong> восстановления здоровья, который базируется на законах <strong>биомеханики, анатомии и нейрофизиологии</strong>. Никакой мистики или эзотерики — только знание того, как работает человеческое тело.
                        </p>
                        <p>
                            Метод объединяет в себе лучшие принципы <strong>остеопрактики и лечебной физкультуры (ЛФК)</strong>. Мы рассматриваем организм как единую систему, где боль в одном месте часто является следствием сбоя в совершенно другой зоне.
                        </p>
                        <p className="flex items-center pt-2 font-medium text-brand-purple">
                            <ShieldCheck className="mr-2 flex-shrink-0" size={20} />
                            Это доказанный, безопасный и комплексный подход к реабилитации.
                        </p>
                    </div>
                </div>

                <div className="relative h-full min-h-[300px] md:min-h-0 rounded-2xl overflow-hidden shadow-md">
                    <img
                        src="/OlegTetchenko/images/method_photo.jpg"
                        alt="Олег Тетченко - работа с моделью черепа"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
                {
                    step: "01",
                    title: "Диагностика через «диалог» с мышцами",
                    text: "С помощью мануально-мышечного теста я проверяю реакцию ваших мышц на лёгкое давление. Ослабленный отклик — это «сигнал» тела о проблеме в связанном органе, позвонке или системе."
                },
                {
                    step: "02",
                    title: "Поиск первопричины",
                    text: "Мы не работаем там, где болит. Мы находим, почему болит. Часто причина боли в пояснице кроется в стопе, а головная боль «рождается» в шейных позвонках."
                },
                {
                    step: "03",
                    title: "Коррекция и запуск самовосстановления",
                    text: "Используя мягкие техники (остеопрактика, висцеральный массаж, работа с фасциями), я снимаю найденные блоки и дисбалансы. Это даёт сигнал нервной системе: «Угроза устранена, можно восстанавливаться»."
                },
                {
                    step: "04",
                    title: "Закрепление результата",
                    text: "Чтобы эффект был долгим, я даю индивидуальные рекомендации: специальные упражнения, коррекция осанки, иногда — изготовление индивидуальных ортопедических стелек для правильной опоры."
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
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2 text-left">Мой арсенал методов</h3>
                <p className="text-slate-500 text-left mb-10 max-w-2xl mr-auto">
                    Для решения вашей задачи я использую комплексный подход и проверенные методы:
                </p>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
                    {[
                        { title: "Прикладная кинезиология", desc: "основа для точной диагностики." },
                        { title: "Остеопрактика", desc: "мягкая коррекция позвоночника, суставов, костей черепа." },
                        { title: "Висцеральная практика", desc: "работа с внутренними органами для улучшения их функции." },
                        { title: "Кинезиотейпирование", desc: "поддержка мышц и суставов после сеанса." },
                        { title: "Лечебный массаж", desc: "(миофасциальный, триггерный, лимфодренажный) для снятия спазмов." },
                        { title: "Психоэмоциональная коррекция", desc: "работа со стрессом, который «записан» в теле." },
                        { title: "Основы нутрициологии", desc: "рекомендации по питанию для поддержки восстановления." }
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
                            Имеются противопоказания. Необходима консультация специалиста.
                        </p>
                        <p className="text-sm text-white/90 leading-relaxed">
                            Перед записью сообщите мне о наличии острых инфекционных заболеваний, онкологических процессов в стадии лечения, тяжёлых психических расстройств, острых травмах и состояниях, требующих неотложной медицинской помощи.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </Section>
);

export default Method;
