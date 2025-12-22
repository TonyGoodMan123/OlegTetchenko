import React from 'react';

const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-[2rem] p-6 md:p-8 shadow-soft border border-slate-100 hover:shadow-lg transition-shadow duration-300 ${className}`}>
        {children}
    </div>
);

export default Card;
