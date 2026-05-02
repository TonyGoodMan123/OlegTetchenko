import React, { useState, useEffect } from 'react';

const MobileStickyCTA = ({ onOpenModal }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const secondBlock = document.getElementById('problems');
            const contactsSec = document.getElementById('contacts');

            if (!secondBlock) return;

            const secondRect = secondBlock.getBoundingClientRect();
            // Show when the 2nd block starts entering the viewport (or slightly before)
            const isPastHero = secondRect.top < 100;

            let isContactsVisible = false;
            if (contactsSec) {
                const contactsRect = contactsSec.getBoundingClientRect();
                isContactsVisible = contactsRect.top < window.innerHeight - 100;
            }

            setIsVisible(isPastHero && !isContactsVisible);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Trigger once on mount to set initial state
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden animate-slide-up">
            <div className="bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] py-4 px-5 safe-area-bottom">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-bold text-slate-800 leading-tight max-w-[55%]">
                        Запишитесь на бесплатную консультацию
                    </p>
                    <button
                        onClick={onOpenModal}
                        className="py-3 px-6 bg-brand-purple text-white text-sm font-bold rounded-full shadow-lg transform active:scale-95 transition-all hover:shadow-xl hover:brightness-110 whitespace-nowrap"
                    >
                        Записаться
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileStickyCTA;
