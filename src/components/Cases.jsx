import React, { useState, useRef, useEffect } from 'react';
import Section from './ui/Section';
import SectionTitle from './ui/SectionTitle';
import { ArrowRightIcon, Play, Star, ChevronLeft, ChevronRight } from './ui/icons';
import caseDenisBefore from '../assets/case_denis_before.jpg';
import caseDenisAfter from '../assets/case_denis_after.jpg';
import caseMarinaBefore from '../assets/case_marina_before.jpg';
import caseMarinaAfterPreview from '../assets/case_marina_after_preview.png';
import caseEvgeniaPreview from '../assets/case_evgenia_preview.jpg';
import caseSergeyBefore from '../assets/case_sergey_before.jpg';
import caseSergeyAfter from '../assets/case_sergey_after.jpg';
import caseSergeyExercises from '../assets/case_sergey_exercises.jpg';
import caseNatalyaPreview from '../assets/case_natalya_preview.jpg';
import caseYuliaPart1 from '../assets/case_yulia_part1.jpg';
import caseYuliaPart2 from '../assets/case_yulia_part2.jpg';
import caseIrinaPreview from '../assets/case_irina_preview.jpg';


// Testimonials Carousel Component (Unchanged)
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

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-scroll every 3 seconds (advance by 1 card)
    useEffect(() => {
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
                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 h-full flex flex-col shadow-sm card-hover">
                                <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200/50">
                                    <span className="font-bold text-slate-800 text-sm md:text-base">{r.name}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, x) => <Star key={x} size={14} fill="currentColor" stroke="none" />)}
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">5.0</span>
                                    </div>
                                </div>

                                <h5 className="font-bold text-brand-purple mb-2 text-sm md:text-base leading-tight">{r.title}</h5>
                                <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">"{r.text}"</p>

                                <div className="pt-2 mt-auto">
                                    <a href="https://vk.com/reviews-212898269" target="_blank" className="text-[10px] font-bold text-blue-500 hover:text-blue-600 hover:underline flex items-center opacity-75 hover:opacity-100 transition-opacity">
                                        Читать оригинал в VK
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons - Desktop only */}
            <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between pointer-events-none">
                <button
                    onClick={prevTestimonial}
                    className="pointer-events-auto -ml-4 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 border border-slate-100"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextTestimonial}
                    className="pointer-events-auto -mr-4 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 border border-slate-100"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Combined Mobile Navigation & Dots */}
            <div className="flex flex-col items-center gap-4 mt-8">
                {/* Mobile Arrows */}
                <div className="flex md:hidden items-center gap-6">
                    <button
                        onClick={prevTestimonial}
                        className="bg-white text-slate-800 p-3 rounded-full shadow-md border border-slate-100 active:scale-95 transition-transform"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextTestimonial}
                        className="bg-white text-slate-800 p-3 rounded-full shadow-md border border-slate-100 active:scale-95 transition-transform"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Dots Navigation */}
                <div className="flex justify-center gap-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? "w-8 bg-gradient-to-r from-brand-purple to-brand-teal"
                                : "w-1.5 bg-slate-300 hover:bg-slate-400"
                                }`}
                            aria-label={`Отзыв ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};


const Cases = ({ onOpenModal }) => {
    // --- Cases Data ---
    const cases = [
        {
            id: 'marina',
            name: 'Марина, 35 лет',
            tag: 'Боль в спине от кишечника',
            details: [
                { label: 'Проблема', text: '5 лечебных блокад не помогли. Боль мешала сидеть и есть.' },
                { label: 'Диагностика', text: 'Воспаление в кишечнике отключило мышцы пресса → перегруз поясницы.' },
                { label: 'Решение', text: 'Висцеральная терапия. Боль ушла за 1 сеанс.' }
            ],
            footer: 'Лечим причину, а не симптом',
            link: 'https://vkvideo.ru/video-212898269_456239036',
            type: 'split_image_video',
            image: caseMarinaBefore,
            preview: caseMarinaAfterPreview
        },
        {
            id: 'denis',
            name: 'Денис, 24 года',
            tag: 'Коррекция перекоса за 1 сеанс',
            details: [
                { label: 'Проблема', text: 'Тело «ушло» влево. Компенсаторная цепь: укорочение мышц поясницы, скрученный таз, дисбаланс шеи.' },
                { label: 'Решение', text: 'Нашли первопричину. Убрали гипертонус — тело само вернулось в симметрию.' }
            ],
            footer: 'Системный подход кинезиологии',
            link: 'https://vk.com/kineziolog_89',
            type: 'split_image_image',
            image: caseDenisBefore,
            imageAfter: caseDenisAfter
        },
        {
            id: 'evgenia',
            name: 'Евгения, 40 лет',
            tag: 'Плечелопаточный периартрит',
            details: [
                { label: 'Диагностика', text: 'Гипертонус лестничных мышц шеи, дисфункция подлопаточной мышцы, гипертонус мышцы поднимающей лопатку.' },
                { label: 'Результат', text: 'Улучшилась подвижность плечевого сустава после первого сеанса. Боль прошла после курса лечения и домашних упражнений.' }
            ],
            footer: 'Видео до/после',
            link: 'https://vkvideo.ru/clip-212898269_456239480',
            type: 'video_single_label',
            label: 'ДО/ПОСЛЕ',
            showDualLabels: true,
            image: caseEvgeniaPreview
        },
        {
            id: 'sergey',
            name: 'Сергей, 48 лет',
            tag: 'Синдром замороженного плеча',
            details: [
                { label: 'Диагностика', text: 'ПЭДФ (психоэмоциональная дисфункция), гипертонус лестничных мышц шеи, дисфункция подлопаточной мышцы.' },
                { label: 'Лечение', text: '4 сеанса + самостоятельная работа дома и в зале.' },
                { label: 'Результат', text: 'Улучшена подвижность плечевого сустава, боль прошла, качество жизни восстановлено.' }
            ],
            footer: '3 видео: До, После, Упражнения',
            type: 'video_triple',
            links: [
                'https://vkvideo.ru/clip-212898269_456239481',
                'https://vkvideo.ru/clip-212898269_456239482',
                'https://vkvideo.ru/clip-212898269_456239483'
            ],
            images: [
                caseSergeyBefore,
                caseSergeyAfter,
                caseSergeyExercises
            ]
        },
        {
            id: 'natalya',
            name: 'Наталья, 44 года',
            tag: '10 лет боли в спине',
            details: [
                { label: 'Диагностика', text: 'Гипертонус подвздошно-поясничной мышцы, вызванный проблемами ЖКТ и слабостью прямой мышцы живота.' },
                { label: 'Лечение', text: '2 сеанса + рекомендации по укреплению мышц спины и суставная гимнастика.' },
                { label: 'Результат', text: 'Боль прошла, улучшилась подвижность.' }
            ],
            footer: 'Видео отзыв пациента',
            link: 'https://vkvideo.ru/video-212898269_456239107',
            type: 'video_single_label',
            label: 'ВИДЕО ОТЗЫВ',
            objectPosition: '[object-position:center_25%]',
            image: caseNatalyaPreview
        },
        {
            id: 'yulia',
            name: 'Юлия',
            tag: 'Диастаз и дискомфорт в пояснице',
            details: [
                { label: 'Проблема', text: 'Прямая и косые мышцы живота «выключены», нагрузка уходит в поясницу, это поддерживает расхождение по белой линии.' },
                { label: 'Решение', text: 'Тейпирование для поддержки, нейромышечная активация пресса, дыхание и стабилизация, домашняя программа.' },
                { label: 'Результат', text: 'Включены мышечные связи, диастаз минимален, восстановлен контроль корпуса.' }
            ],
            footer: '2 видео: Диагностика и Коррекция',
            type: 'video_double',
            links: [
                'https://vk.com/clip-212898269_456239420',
                'https://vk.com/clip-212898269_456239425'
            ],
            images: [
                caseYuliaPart1,
                caseYuliaPart2
            ]
        },
        {
            id: 'irina',
            name: 'Ирина, 37 лет',
            tag: 'Аллергический насморк',
            details: [
                { label: 'Проблема', text: 'Заложенность, аллергический насморк, тяжелое дыхание.' },
                { label: 'Диагностика', text: 'Смещение решетчатой кости и нарушение работы ВНЧС.' },
                { label: 'Результат', text: 'Свободное дыхание, ушла отечность после первого сеанса.' }
            ],
            footer: 'Отзыв после 1 сеанса',
            link: 'https://vkvideo.ru/video-212898269_456239099',
            type: 'video_single_label',
            label: 'ВИДЕО ОТЗЫВ',
            objectPosition: '[object-position:center_25%]',
            image: caseIrinaPreview
        }
    ];


    // --- State & Logic ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Add first 2 cases to end to prevent whitespace on large screens
    const displayCases = [...cases, ...cases.slice(0, 2)];

    // Swipe logic
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchEndX.current = null;
        setIsHovered(true); // Pause auto-scroll on touch
    };

    const onTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextCase();
        } else if (isRightSwipe) {
            prevCase();
        }

        // Reset
        touchStartX.current = null;
        touchEndX.current = null;
        // Don't unpause immediately to allow reading
        setTimeout(() => setIsHovered(false), 2000);
    };

    // Auto-scroll
    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cases.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isHovered, cases.length]);

    const nextCase = () => {
        setCurrentIndex((prev) => (prev + 1) % cases.length);
    };

    const prevCase = () => {
        setCurrentIndex((prev) => (prev - 1 + cases.length) % cases.length);
    };

    // Helper to render media content based on type
    const renderMedia = (c) => {
        switch (c.type) {
            case 'split_image_video':
                return (
                    <div className="relative h-48 flex">
                        <div className="w-1/2 h-full relative">
                            <img src={c.image} alt="До лечения" className="w-full h-full object-cover object-top" />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">ДО</div>
                        </div>
                        <div
                            className="w-1/2 h-full relative border-l border-white/20 bg-slate-900 cursor-pointer group/video"
                            onClick={() => window.open(c.link, '_blank')}
                        >
                            <img src={c.preview} alt="Видео отзыв" className="w-full h-full object-cover opacity-80 group-hover/video:opacity-60 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover/video:scale-110 transition-transform">
                                    <Play size={16} className="text-white ml-1" fill="white" />
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-teal-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">ПОСЛЕ</div>
                        </div>
                    </div>
                );
            case 'split_image_image':
                return (
                    <div className="relative h-48 flex">
                        <div className="w-1/2 h-full relative">
                            <img src={c.image} alt="До лечения" className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">ДО</div>
                        </div>
                        <div className="w-1/2 h-full relative border-l border-white/20">
                            <img src={c.imageAfter} alt="После лечения" className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 bg-teal-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">ПОСЛЕ</div>
                        </div>
                    </div>
                );
            case 'video_single_label':
                return (
                    <div
                        className="relative h-48 bg-slate-900 cursor-pointer group/video"
                        onClick={() => window.open(c.link, '_blank')}
                    >
                        {c.image && (
                            <img src={c.image} alt="Видео превью" className={`w-full h-full object-cover ${c.objectPosition || 'object-center'} opacity-90 group-hover/video:opacity-75 transition-opacity`} />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover/video:scale-110 transition-transform">
                                <Play size={20} className="text-white ml-1" fill="white" />
                            </div>
                        </div>
                        {c.showDualLabels ? (
                            <>
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">ДО</div>
                                <div className="absolute top-2 right-2 bg-teal-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">ПОСЛЕ</div>
                            </>
                        ) : (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-brand-purple to-brand-teal text-white text-[10px] font-bold px-2 py-1 rounded">{c.label}</div>
                        )}
                    </div>
                );
            case 'video_triple':
                return (
                    <div className="relative h-48 flex">
                        <div className="w-1/3 h-full relative bg-slate-900 cursor-pointer group/v1" onClick={(e) => { e.stopPropagation(); window.open(c.links[0], '_blank'); }}>
                            <img src={c.images[0]} alt="До" className="w-full h-full object-cover opacity-90 group-hover/v1:opacity-75 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover/v1:scale-110 transition-transform">
                                    <Play size={12} className="text-white ml-0.5" fill="white" />
                                </div>
                            </div>
                            <div className="absolute top-2 left-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded">ДО</div>
                        </div>
                        <div className="w-1/3 h-full relative bg-slate-800 cursor-pointer border-l border-white/20 group/v2" onClick={(e) => { e.stopPropagation(); window.open(c.links[1], '_blank'); }}>
                            <img src={c.images[1]} alt="После" className="w-full h-full object-cover opacity-90 group-hover/v2:opacity-75 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover/v2:scale-110 transition-transform">
                                    <Play size={12} className="text-white ml-0.5" fill="white" />
                                </div>
                            </div>
                            <div className="absolute top-2 left-1 bg-teal-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded">ПОСЛЕ</div>
                        </div>
                        <div className="w-1/3 h-full relative bg-slate-700 cursor-pointer border-l border-white/20 group/v3" onClick={(e) => { e.stopPropagation(); window.open(c.links[2], '_blank'); }}>
                            <img src={c.images[2]} alt="МТБ" className="w-full h-full object-cover opacity-90 group-hover/v3:opacity-75 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover/v3:scale-110 transition-transform">
                                    <Play size={12} className="text-white ml-0.5" fill="white" />
                                </div>
                            </div>
                            <div className="absolute top-2 right-1 bg-purple-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Востановление</div>
                        </div>
                    </div>
                );
            case 'video_double':
                return (
                    <div className="relative h-48 flex">
                        <div className="w-1/2 h-full relative bg-slate-900 cursor-pointer group/v1" onClick={(e) => { e.stopPropagation(); window.open(c.links[0], '_blank'); }}>
                            <img src={c.images[0]} alt="Часть 1" className="w-full h-full object-cover opacity-90 group-hover/v1:opacity-75 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover/v1:scale-110 transition-transform">
                                    <Play size={16} className="text-white ml-0.5" fill="white" />
                                </div>
                            </div>
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded">ДО</div>
                        </div>
                        <div className="w-1/2 h-full relative bg-slate-800 cursor-pointer border-l border-white/20 group/v2" onClick={(e) => { e.stopPropagation(); window.open(c.links[1], '_blank'); }}>
                            <img src={c.images[1]} alt="Часть 2" className="w-full h-full object-cover opacity-90 group-hover/v2:opacity-75 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover/v2:scale-110 transition-transform">
                                    <Play size={16} className="text-white ml-0.5" fill="white" />
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-teal-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded">ПОСЛЕ</div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Section id="cases" bg="white">
            <SectionTitle
                title="Кейсы и отзывы"
                subtitle="Реальные истории пациентов. Что было до, что делали и каких результатов удалось добиться."
            />

            <div
                className="mb-16 group relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="flex justify-between items-end mb-6 px-4">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">Кейсы обращений (До/После)</h3>
                        <p className="text-slate-500">Видео и фото, показывающие реальные изменения после работы.</p>
                    </div>
                </div>

                <div
                    className="overflow-hidden"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-500 ease-in-out [--slide-width:100%] md:[--slide-width:50%] lg:[--slide-width:33.333%]"
                        style={{ transform: `translateX(calc(var(--slide-width) * -${currentIndex}))` }}
                    >
                        {displayCases.map((c, i) => (
                            <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                                <div className="h-full">
                                    <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-all h-full flex flex-col">

                                        {renderMedia(c)}

                                        <div className="p-5 flex flex-col flex-grow">
                                            <div className="mb-3">
                                                <h4 className="font-bold text-slate-800 text-lg leading-tight">{c.name}</h4>
                                                <p className="text-brand-purple text-xs font-bold uppercase tracking-wide mt-1">{c.tag}</p>
                                            </div>
                                            <div className="space-y-3 text-xs text-slate-600 mb-4 flex-grow">
                                                {c.details.map((d, index) => (
                                                    <p key={index}><strong className="text-slate-700">{d.label}:</strong> {d.text}</p>
                                                ))}
                                            </div>
                                            <div className="pt-3 border-t border-slate-100 mt-auto flex justify-between items-center">
                                                <span className="text-[10px] text-slate-400 font-medium">{c.footer}</span>
                                                <ArrowRightIcon size={12} className="text-brand-purple" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons (Desktop Only) */}
                <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between pointer-events-none">
                    <button
                        onClick={prevCase}
                        className="pointer-events-auto -ml-4 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 opacity-100 md:opacity-0 md:group-hover:opacity-100 border border-slate-100"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextCase}
                        className="pointer-events-auto -mr-4 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 opacity-100 md:opacity-0 md:group-hover:opacity-100 border border-slate-100"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Mobile Navigation & Dots */}
                <div className="flex flex-col items-center gap-4 mt-8">
                    {/* Mobile Arrows */}
                    <div className="flex md:hidden items-center gap-6">
                        <button
                            onClick={prevCase}
                            className="bg-white text-slate-800 p-3 rounded-full shadow-md border border-slate-100 active:scale-95 transition-transform"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextCase}
                            className="bg-white text-slate-800 p-3 rounded-full shadow-md border border-slate-100 active:scale-95 transition-transform"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Dots Navigation */}
                    <div className="flex justify-center gap-2">
                        {cases.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex
                                    ? "w-8 bg-gradient-to-r from-brand-purple to-brand-teal"
                                    : "w-1.5 bg-slate-300 hover:bg-slate-400"
                                    }`}
                                aria-label={`Кейс ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-16">
                <h3 className="text-2xl font-serif font-bold text-slate-800 mb-8">Отзывы пациентов</h3>
                <TestimonialsCarousel />
            </div>
        </Section>
    );
};

export default Cases;
