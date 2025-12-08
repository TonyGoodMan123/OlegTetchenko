import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, id }) => {
    const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-300 transform active:scale-95 px-6 py-3 rounded-full cursor-pointer";

    const variants = {
        primary: "gradient-bg text-white shadow-lg hover:shadow-xl hover:brightness-110 border-0",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:border-brand-purple hover:text-brand-purple shadow-sm",
        outline: "bg-transparent border border-slate-300 text-slate-600 hover:border-brand-teal hover:text-brand-teal"
    };

    return (
        <button id={id} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {Icon && <Icon size={20} className="mr-2" />}
            {children}
        </button>
    );
};

export default Button;
