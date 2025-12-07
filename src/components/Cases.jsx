import React from 'react';
import Section from './ui/Section';
import SectionTitle from './ui/SectionTitle';
import Card from './ui/Card';
import { ArrowRightIcon, Play, Star, ChevronLeft, ChevronRight } from './ui/icons';
import caseDenisBefore from '../assets/case_denis_before.jpg';
import caseDenisAfter from '../assets/case_denis_after.jpg';
import caseMarinaBefore from '../assets/case_marina_before.jpg';
import caseMarinaAfterPreview from '../assets/case_marina_after_preview.png';

// Testimonials Carousel Component
const TestimonialsCarousel = () => {
    const testimonials = [
        {
            name: "Лилия Набиулина",
            title: "Проблема решена за один сеанс",
            text: "Обратилась к Олегу Евгеньевичу с болью в спине. Той самой, которая тупая, ноющая, а потом резко простреливающая. За один сеанс проблема была решена. Кроме этого, Олег Евгеньевич провёл диагностику всего тела и выявил застарелые проблемы, к которым уже привыкла, но которые ухудшали качество жизни. Всего за несколько сеансов реально начать жить полноценной жизнью! Очень рада, что в нашем городе работает отличный кинезиолог Тетченко Олег Евгеньевич. Рекомендую этого специалиста."
        },
        {
            name: "Наталия Гальперина",
            title: "Прекрасный специалист и немного волшебник",
            text: "Олег Евгеньевич прекрасный специалист и, наверное, немного волшебник. После приёма прошло несколько дней, привыкла к новым возможностям старого тела. Мышечные боли ушли, восстановилась опорная функция кисти, увеличилась гибкость, встал на место живот. Самые большие и застарелые проблемы болеть не давали, сейчас боли нет, и я планирую ещё вернуться к Олегу Евгеньевичу для закрепления результата. Спасибо большое."
        },
        {
            name: "Татьяна Синева",
            title: "Появилась надежда на жизнь без боли",
            text: "Путь к моему оздоровлению был долгий и непростой! Но судьба после испытаний всегда даёт шанс! Я познакомилась с Олегом Евгеньевичем и всё стало меняться в лучшую сторону. Сразу после сеанса проблемы, которые мешали нормально жить и работать, отступили! А главное — появилась надежда, что дальнейшая жизнь будет без боли и можно ещё работать и хорошо себя чувствовать. Спасибо Олег Евгеньевич за Ваше мастерство, знания, опыт. Дай Бог Вам здоровья на долгие-долгие годы!"
        },
        {
            name: "Татьяна Леон",
            title: "Результат превзошёл все ожидания",
            text: "Мне порекомендовали пройти тестирование у Олега Евгеньевича. Проблемы с плечом, спина, шея и др… После приёма я осталась под большим впечатлением, я оказалась у профессионала своего дела, понравился метод диагностики, подход, работа. Но самое важное — результат, который превзошёл все мои ожидания. Восстановили работу левой сухой мышцы руки, поясничный отдел стал подвижен, вернулся живот. Спасибо Вам большое!"
        },
        {
            name: "Татьяна Цихович",
            title: "За 15 минут убрал боль, которую лечила месяц",
            text: "Я просто счастлива и очень благодарна! Олег Евгеньевич за 15 минут убрал боль в руке, которую я лечила месяц безуспешно. Прошла кучу приёмов, УЗИ, блокад, таблеток, диагноз — латеральный эпикондилит локтевого сустава. Облегчало на время, болел желудок и боль возвращалась. Рука практически не работала. Всем рекомендую, это чудо методика, которая доступна в нашем городе. Спасибо огромное, Олег Евгеньевич!"
        },
        {
            name: "Ольга Власова",
            title: "Мигрени ушли после 4 лет страданий",
            text: "Я пришла к Олегу Евгеньевичу с болью в теле, которая мучает меня несколько лет. Уже спустя полчаса после первого приёма я ощутила «супер-радость-удивления» — без боли! Но после второго приёма случилось ещё что-то более НЕВЕРОЯТНОЕ!!! У меня была серьёзная проблема: частые мигрени, непрерывное зажимание нервных пучков шеи! Ничего я этим поделать не могла на протяжении 4-х лет. Я не знаю, что со мной сделал Олег Евгеньевич, но боли в голове ушли!! У меня как будто новая жизнь началась! ОГРОМНОЕ ВАМ СПАСИБО! ВЫ ТВОРИТЕ ЧУДЕСА!"
        },
        {
            name: "Юлия",
            title: "Золотые ручки",
            text: "Спасибо большое. Золотые ручки, в шее ушло напряжение и боль, помог точно определить проблемные места и восстановиться, вы лучший!"
        },
        {
            name: "Андрей Николаевич",
            title: "Реабилитация после перелома плеча",
            text: "Хочу выразить слова благодарности Олегу Евгеньевичу за помощь в реабилитации после перелома большой головки плеча. Беспокоили боли в плече и ограниченная подвижность в плечевом суставе. После курса кинезиотерапии и выполнения физических упражнений, рекомендованных Олегом Евгеньевичем, боли и дискомфорт полностью ушли, при этом подвижность сустава стала даже лучше, чем до травмы. Также курсы кинезиотерапии у Олега Евгеньевича прошли и мои дети, сын жаловался на боли в колене (последствия перелома пятки) и дочь с жалобой на асимметрию лица. Результатом лечения довольны все!"
        },
        {
            name: "From Scratch",
            title: "Зажимы и боли ушли после первого посещения",
            text: "Отличный специалист, очень интересное направление! Уже после первого посещения прошли зажимы, боли в спине, которые беспокоили больше полугода!"
        },
        {
            name: "Natalia Kornienko",
            title: "Настоящий профессионал своего дела",
            text: "Олег Евгеньевич, спасибо большое за лекцию по прикладной кинезиологии. Я и коллега под большим впечатлением. Вы — настоящий профессионал своего дела. Замечательный, очень чуткий специалист. Нам понравился подход, методы диагностики, работа, рекомендации. Мы открыли для себя много нового. После приёма чувствую себя лучше, рука практически не болит. Большая удача найти такого специалиста в нашем городе. Рекомендую всем!"
        },
        {
            name: "Виктор Иванов",
            title: "Боль в пояснице прошла",
            text: "Была пульсирующая боль в районе поясницы, справа. Обострилась после тайского массажа. После приёма у доктора, стало легко, боль прошла, но некоторая чувствительность осталась. Доктор порекомендовал ещё один, контрольный визит. Рекомендую."
        }
    ];

    // Add first 2 testimonials to the end to prevent empty spaces on desktop
    const displayTestimonials = [...testimonials, ...testimonials.slice(0, 2)];

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);

    // Auto-scroll every 3 seconds (advance by 1 card)
    React.useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isHovered, testimonials.length]);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Carousel Container */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out [--slide-width:100%] md:[--slide-width:50%] lg:[--slide-width:33.333%]"
                    style={{ transform: `translateX(calc(var(--slide-width) * -${currentIndex}))` }}
                >
                    {displayTestimonials.map((r, i) => (
                        <div key={i} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 h-full flex flex-col">
                                <div className="flex text-yellow-400 mb-3">
                                    {[...Array(5)].map((_, x) => <Star key={x} size={16} fill="currentColor" stroke="none" />)}
                                </div>
                                <h5 className="font-bold text-slate-800 mb-2">{r.title}</h5>
                                <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">"{r.text}"</p>
                                <div className="flex justify-between items-end pt-4 border-t border-slate-200/50">
                                    <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">{r.name}</span>
                                    <a href="https://vk.com/reviews-212898269" target="_blank" className="text-[10px] font-bold text-blue-600 hover:underline">Оригинал в VK</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
                <button
                    onClick={prevTestimonial}
                    className="pointer-events-auto -ml-4 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextTestimonial}
                    className="pointer-events-auto -mr-4 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                            ? "w-8 bg-gradient-to-r from-brand-purple to-brand-teal"
                            : "w-2 bg-slate-300 hover:bg-slate-400"
                            }`}
                        aria-label={`Отзыв ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};


const Cases = ({ onOpenModal }) => (
    <Section id="cases" bg="white">
        <SectionTitle
            title="Кейсы и отзывы"
            subtitle="Реальные истории пациентов. Что было до, что делали и каких результатов удалось добиться."
        />

        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
                {
                    label: "Кейс: плечевой сустав",
                    title: "Боль в плече",
                    before: "1,5 месяца боли в плече, ограничение поднятия руки.",
                    process: "2 приёма, работа с плечевым поясом и шейным отделом.",
                    result: "Рука поднимается без боли, восстановлен объём движения.",
                    time: "2 приёма за 10 дней"
                },
                {
                    label: "Кейс: неврология",
                    title: "Онемение руки",
                    before: "Онемение левой руки, страх «ущемления нерва».",
                    process: "Мягкая коррекция шеи, диафрагмы, грудного отдела.",
                    result: "Онемение ушло, стало легче работать и спать.",
                    time: "1 приём"
                },
                {
                    label: "Кейс: после родов",
                    title: "Боль в спине",
                    before: "Боль в спине после родов, тяжело держать ребёнка.",
                    process: "Работа с тазом, животом, дыханием.",
                    result: "Уменьшилась боль, вернулся контроль над телом.",
                    time: "3 приёма за 3 недели"
                }
            ].map((c, i) => (
                <Card key={i} className="flex flex-col h-full border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-brand-purple text-xs font-bold uppercase tracking-wide">
                            {c.label}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{c.title}</h3>

                    <div className="space-y-3 text-sm flex-grow">
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="font-bold text-slate-700 block mb-1">До:</span>
                            <span className="text-slate-600">{c.before}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="font-bold text-slate-700 block mb-1">Что делали:</span>
                            <span className="text-slate-600">{c.process}</span>
                        </div>
                        <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
                            <span className="font-bold text-teal-700 block mb-1">Результат:</span>
                            <span className="text-teal-800">{c.result}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-400">{c.time}</span>
                        <a href="https://vk.com/kineziolog_89" className="text-xs font-bold text-brand-purple hover:underline flex items-center">
                            Смотреть детали <Play size={12} className="ml-1" />
                        </a>
                    </div>
                </Card>
            ))}
        </div> */}

        <div className="mb-16">
            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">Видео-кейсы и до/после</h3>
            <p className="text-slate-500 mb-8">Видео и фото, показывающие реальные изменения после работы.</p>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="group cursor-pointer md:col-span-1" onClick={() => window.open('https://vkvideo.ru/video-212898269_456239036', '_blank')}>
                    <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                        {/* Images Container */}
                        <div className="relative h-48 flex">
                            <div className="w-1/2 h-full relative">
                                <img src={caseMarinaBefore} alt="До лечения" className="w-full h-full object-cover object-top" />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">ДО</div>
                            </div>
                            <div className="w-1/2 h-full relative border-l border-white/20 bg-slate-900 group-hover:bg-slate-800 transition-colors">
                                <img src={caseMarinaAfterPreview} alt="Видео отзыв" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                        <Play size={16} className="text-white ml-1" fill="white" />
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 bg-teal-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">ПОСЛЕ</div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-grow">
                            <div className="mb-3">
                                <h4 className="font-bold text-slate-800 text-lg leading-tight">Марина, 35 лет</h4>
                                <p className="text-brand-purple text-xs font-bold uppercase tracking-wide mt-1">Боль в спине от кишечника</p>
                            </div>

                            <div className="space-y-3 text-xs text-slate-600 mb-4 flex-grow">
                                <p><strong className="text-slate-700">Проблема:</strong> 5 лечебных блокад не помогли. Боль мешала сидеть и есть.</p>
                                <p><strong className="text-slate-700">Диагностика:</strong> Воспаление в кишечнике отключило мышцы пресса → перегруз поясницы.</p>
                                <p><strong className="text-slate-700">Решение:</strong> Висцеральная терапия. Боль ушла за 1 сеанс.</p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 mt-auto flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 font-medium">Лечим причину, а не симптом</span>
                                <ArrowRightIcon size={12} className="text-brand-purple" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="group cursor-pointer" onClick={() => window.open('https://vk.com/kineziolog_89', '_blank')}>
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <div className="absolute inset-0 flex items-center justify-center z-20 group-hover:scale-110 transition-transform duration-300">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                <Play size={24} className="text-white ml-1" fill="white" />
                            </div>
                        </div>
                        <span className="absolute bottom-4 left-4 text-white font-bold text-sm z-20">Видео-кейс: Работа с осанкой</span>
                    </div>
                    <a href="https://vk.com/kineziolog_89" target="_blank" className="inline-flex items-center text-xs font-bold text-blue-600 mt-3 hover:underline">
                        Смотреть во ВКонтакте <ArrowRightIcon size={12} className="ml-1" />
                    </a>
                </div>

                <div className="group cursor-pointer md:col-span-1" onClick={() => window.open('https://vk.com/kineziolog_89', '_blank')}>
                    <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                        {/* Images Container */}
                        <div className="relative h-48 flex">
                            <div className="w-1/2 h-full relative">
                                <img src={caseDenisBefore} alt="До лечения" className="w-full h-full object-cover" />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">ДО</div>
                            </div>
                            <div className="w-1/2 h-full relative border-l border-white/20">
                                <img src={caseDenisAfter} alt="После лечения" className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-teal-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">ПОСЛЕ</div>
                            </div>
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                                    Подробнее VK
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-grow">
                            <div className="mb-3">
                                <h4 className="font-bold text-slate-800 text-lg leading-tight">Денис, 24 года</h4>
                                <p className="text-brand-purple text-xs font-bold uppercase tracking-wide mt-1">Коррекция перекоса за 1 сеанс</p>
                            </div>

                            <div className="space-y-3 text-xs text-slate-600 mb-4 flex-grow">
                                <p><strong className="text-slate-700">Проблема:</strong> Тело «ушло» влево. Компенсаторная цепь: укорочение мышц поясницы, скрученный таз, дисбаланс шеи.</p>
                                <p><strong className="text-slate-700">Решение:</strong> Нашли первопричину. Убрали гипертонус — тело само вернулось в симметрию.</p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 mt-auto">
                                <span className="text-[10px] text-slate-400 font-medium">Системный подход кинезиологии</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mb-16">
            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-8">Отзывы пациентов</h3>
            <TestimonialsCarousel />
        </div>
    </Section>
);

export default Cases;
