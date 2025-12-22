import React from 'react';

const Section = ({ id, className = '', children, bg = 'transparent' }) => (
    <section id={id} className={`py-16 md:py-24 px-4 md:px-8 relative overflow-hidden ${className}`} style={{ backgroundColor: bg === 'white' ? '#ffffff' : 'transparent' }}>
        <div className="max-w-6xl mx-auto relative z-10">
            {children}
        </div>
    </section>
);

export default Section;
