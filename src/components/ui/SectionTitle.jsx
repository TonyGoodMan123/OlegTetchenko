import React from 'react';

const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-12 text-left">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-800 mb-6 leading-tight">
            {title}
        </h2>
        {subtitle && (
            <p className="text-slate-600 text-lg md:text-xl max-w-3xl font-light leading-relaxed mb-6">
                {subtitle}
            </p>
        )}
        <div className="h-1.5 w-24 bg-gradient-to-r from-brand-purple to-brand-teal rounded-full"></div>
    </div>
);

export default SectionTitle;
