import React, { useState, useEffect } from 'react';

const MobileStickyCTA = ({ onOpenModal }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const heroBtn = document.getElementById('hero-cta-button');
            const contactsSec = document.getElementById('contacts');

            // If elements don't exist yet, we can't determine, assume hidden
            if (!heroBtn) return;

            const heroRect = heroBtn.getBoundingClientRect();
            // Hero is "past" if its top is above the viewport, or specifically if it's completely out.
            // Let's say if the bottom of the button is < 0, it's fully scrolled past.
            const isHeroPast = heroRect.bottom < 0;

            let isContactsVisible = false;
            if (contactsSec) {
                const contactsRect = contactsSec.getBoundingClientRect();
                // Contacts is visible if its top is within the viewport height
                // i.e., top is less than window.innerHeight
                isContactsVisible = contactsRect.top < window.innerHeight;
            }

            // Show if Hero is past AND Contacts is NOT visible
            setIsVisible(isHeroPast && !isContactsVisible);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Trigger once on mount to set initial state
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-slide-up">
            <div className="bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] py-4 px-5 safe-area-bottom">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-light text-slate-500 leading-tight max-w-[55%]">
                        Бесплатная консультация по вашей ситуации
                    </p>
                    <button
                        onClick={onOpenModal}
                        className="py-3 px-6 bg-gradient-to-r from-[#6D4CFF] to-[#00D1C1] text-white text-sm font-bold rounded-full shadow-lg transform active:scale-95 transition-all whitespace-nowrap"
                    >
                        Оставить заявку
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileStickyCTA;
