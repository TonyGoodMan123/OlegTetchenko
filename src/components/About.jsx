import React from 'react';
import Section from './ui/Section';
import SectionTitle from './ui/SectionTitle';
import { ShieldCheck, ChevronLeft, ChevronRight, Award } from './ui/icons';

const About = ({ onOpenModal }) => {
    // Dynamically resolve base URL for both dev and prod
    const baseUrl = import.meta.env.BASE_URL;

    // --- Personal Gallery Data & State ---
    // Updated based on user deletion
    const galleryImages = [
        `${baseUrl}/images/about_gallery_1.jpg`,
        `${baseUrl}/images/about_gallery_2.jpg`,
        `${baseUrl}/images/about_gallery_3.jpg`,
        `${baseUrl}/images/about_gallery_4.jpg`,
        `${baseUrl}/images/about_gallery_5.jpg`,
        `${baseUrl}/images/about_gallery_6.jpg`,
        `${baseUrl}/images/about_gallery_7.jpg`,
        `${baseUrl}/images/about_gallery_9.jpg`,
        `${baseUrl}/images/about_gallery_10.jpg`
    ];
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isHoveredPersonal, setIsHoveredPersonal] = React.useState(false);

    const certImages = [
        `${baseUrl}/images/cert_1.jpg`,
        `${baseUrl}/images/cert_2.jpg`,
        `${baseUrl}/images/cert_3.jpg`,
        `${baseUrl}/images/cert_4.jpg`,
        `${baseUrl}/images/cert_5.jpg`,
        `${baseUrl}/images/cert_6.jpg`,
        `${baseUrl}/images/cert_7.jpg`,
        `${baseUrl}/images/cert_8.jpg`,
        `${baseUrl}/images/cert_9.jpg`,
        `${baseUrl}/images/cert_10.jpg`,
        `${baseUrl}/images/cert_11.jpg`,
        `${baseUrl}/images/cert_12.jpg`,
        `${baseUrl}/images/cert_13.jpg`,
        `${baseUrl}/images/cert_14.jpg`,
        `${baseUrl}/images/cert_15.jpg`,
        `${baseUrl}/images/cert_16.jpg`,
        `${baseUrl}/images/cert_17.jpg`,
        `${baseUrl}/images/cert_18.jpg`,
        `${baseUrl}/images/cert_19.jpg`,
        `${baseUrl}/images/cert_20.jpg`,
        `${baseUrl}/images/cert_21.jpg`,
        `${baseUrl}/images/cert_22.jpg`,
        `${baseUrl}/images/cert_23.jpg`
    ];
    const [certIndex, setCertIndex] = React.useState(0);
    const [isHoveredCert, setIsHoveredCert] = React.useState(false);

    // --- Auto-scroll Effects ---
    // Personal Gallery (3s, pauses on hover)
    React.useEffect(() => {
        if (isHoveredPersonal) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [galleryImages.length, isHoveredPersonal]);

    // Certificates Gallery (3s, pauses on hover)
    React.useEffect(() => {
        if (isHoveredCert) return;
        const interval = setInterval(() => {
            setCertIndex((prev) => (prev + 1) % certImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [certImages.length, isHoveredCert]);

    // --- Navigation Handlers ---
    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

    const nextCert = () => setCertIndex((prev) => (prev + 1) % certImages.length);
    const prevCert = () => setCertIndex((prev) => (prev - 1 + certImages.length) % certImages.length);

    return (
        <Section id="about">
            <div className="space-y-24">
                {/* --- Row 1: About Me (Text Left, Photo Right) --- */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <SectionTitle title="Обо мне" subtitle="Олег Тетченко — кинезиолог, остеопрактик, нутрициолог" />
                        <div className="prose text-slate-600 mb-8">
                            <p>
                                Уже более 15 лет работаю с телом людей: сначала в сфере физической подготовки, затем в прикладной кинезиологии и остеопрактике.
                            </p>
                            <p>
                                Моя задача — помочь вам вернуть подвижность, снизить боль и научиться жить в теле, которое поддерживает, а не мешает.
                            </p>
                        </div>
                    </div>

                    <div>
                        <div
                            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100 aspect-[4/5] max-w-md mx-auto group"
                            onMouseEnter={() => setIsHoveredPersonal(true)}
                            onMouseLeave={() => setIsHoveredPersonal(false)}
                        >
                            <img
                                src={galleryImages[currentIndex]}
                                alt={`Олег Тетченко фото ${currentIndex + 1}`}
                                className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                            />

                            {/* Personal Gallery Nav */}
                            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button onClick={prevSlide} className="bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full backdrop-blur-sm shadow-md transition-all transform hover:scale-110"><ChevronLeft size={24} /></button>
                                <button onClick={nextSlide} className="bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full backdrop-blur-sm shadow-md transition-all transform hover:scale-110"><ChevronRight size={24} /></button>
                            </div>

                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {galleryImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
                                        aria-label={`Фото ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Row 2: Certificates (Gallery Left, Skills Right) --- */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Certificate Gallery (Left) */}
                    <div className="order-2 md:order-1">
                        <div
                            className="relative rounded-2xl overflow-hidden shadow-2xl bg-white aspect-[4/3] border-4 border-white group max-w-md mx-auto"
                            onMouseEnter={() => setIsHoveredCert(true)}
                            onMouseLeave={() => setIsHoveredCert(false)}
                        >
                            <img
                                src={certImages[certIndex]}
                                alt={`Сертификат ${certIndex + 1}`}
                                className="w-full h-full object-contain bg-slate-50 transition-all duration-500 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            {/* Certificate Gallery Nav */}
                            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button onClick={prevCert} className="bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full backdrop-blur-sm shadow-lg transition-all transform hover:scale-110 active:scale-95"><ChevronLeft size={24} /></button>
                                <button onClick={nextCert} className="bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full backdrop-blur-sm shadow-lg transition-all transform hover:scale-110 active:scale-95"><ChevronRight size={24} /></button>
                            </div>

                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {certImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCertIndex(index)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${index === certIndex ? "w-8 bg-gradient-to-r from-brand-teal to-brand-purple" : "bg-brand-purple/40 w-2 hover:bg-brand-purple/80"}`}
                                        aria-label={`Сертификат ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Education List (Right) */}
                    <div className="order-1 md:order-2">
                        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-800 mb-6 flex items-center text-xl">
                                <ShieldCheck className="text-brand-teal mr-3" size={28} />
                                Образование и навыки
                            </h4>
                            <ul className="space-y-4 text-slate-600">
                                {["Среднее медицинское образование", "Прикладная кинезиология (базовые и продв. курсы)", "Остеопрактика (несколько ступеней)", "Работа с болью в области таза и позвоночника", "Мягкие мануальные и фасциальные техники"].map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <span className="w-2 h-2 bg-brand-teal rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default About;
