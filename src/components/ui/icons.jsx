import React from 'react';

export const IconBase = ({ children, size = 24, className = "", viewBox = "0 0 24 24", ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        {children}
    </svg>
);

export const Phone = (props) => <IconBase {...props} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></IconBase>;
export const Menu = (props) => <IconBase {...props}><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></IconBase>;
export const X = (props) => <IconBase {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconBase>;
export const Check = (props) => <IconBase {...props}><polyline points="20 6 9 17 4 12" /></IconBase>;
export const MapPin = (props) => <IconBase {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></IconBase>;
export const MessageCircle = (props) => <IconBase {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></IconBase>;
export const Send = (props) => <IconBase {...props}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></IconBase>;
export const User = (props) => <IconBase {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></IconBase>;
export const Play = (props) => <IconBase {...props}><polygon points="5 3 19 12 5 21 5 3" /></IconBase>;
export const ShieldCheck = (props) => <IconBase {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></IconBase>;
export const Star = (props) => <IconBase {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></IconBase>;
export const Activity = (props) => <IconBase {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></IconBase>;
export const Brain = (props) => <IconBase {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" /></IconBase>;
export const Users = (props) => <IconBase {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></IconBase>;
export const Heart = (props) => <IconBase {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></IconBase>;
export const Move = (props) => <IconBase {...props}><polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" /><polyline points="15 19 12 22 9 19" /><polyline points="19 15 22 12 19 9" /><line x1="2" x2="22" y1="12" y2="12" /><line x1="12" x2="12" y1="2" y2="22" /></IconBase>;
export const Baby = (props) => <IconBase {...props}><path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" /><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.8 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.8A9 9 0 0 1 19 6.3z" /></IconBase>;
export const Battery = (props) => <IconBase {...props}><rect width="16" height="10" x="2" y="7" rx="2" ry="2" /><line x1="22" x2="22" y1="11" y2="13" /></IconBase>;
export const Clock = (props) => <IconBase {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></IconBase>;
export const AlertTriangle = (props) => <IconBase {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></IconBase>;
export const Footprints = (props) => <IconBase {...props}><path d="M4 16v-2.38C4 11.5 2.97 10.74 2.38 10.5C1.5 10.14 1 9.16 1 8c0-2.21 1.79-4 4-4s4 1.79 4 4v8h11v-2.38c0-2.12-1.03-2.88-1.62-3.12C17.5 10.14 17 9.16 17 8c0-2.21 1.79-4 4-4s4 1.79 4 4v8h-4" /></IconBase>;
export const ChevronLeft = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export const ChevronRight = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

export const Award = (props) => <IconBase {...props}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></IconBase>;

export const ArrowRightIcon = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

// Custom Icons
export const CustomSpineHernia = (props) => <IconBase {...props} viewBox="0 0 24 24">
    <path d="M8 5c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8V5z" />
    <path d="M8 11c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8v-2z" />
    <path d="M8 17c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8v-2z" />
    <circle cx="18" cy="12" r="3" className="text-red-400" fill="currentColor" fillOpacity="0.2" />
    <path d="M18 12l-2 0" strokeDasharray="2 2" />
</IconBase>;

export const CustomScoliosis = (props) => <IconBase {...props} viewBox="0 0 24 24">
    <path d="M12 4c-1.5 2-2 4-2 6s.5 4 2 6c1.5 2 2 4 2 6" strokeDasharray="3 3" opacity="0.5" />
    <path d="M15 7v10l3-3m-3 3l-3-3" strokeWidth="2" />
    <path d="M8 6h2M8 10h2M8 14h2M8 18h2" strokeLinecap="round" />
</IconBase>;

export const CustomBone = (props) => <IconBase {...props} viewBox="0 0 24 24">
    <path d="M18 4.5a2.5 2.5 0 0 0-5 0v3l-2 2-3-3v-2a2.5 2.5 0 0 0-5 0 2.5 2.5 0 0 0 2.5 2.5h2l3 3-2 2h-2a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 5 0v-3l3-3 2 2v2a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0-2.5-2.5h-2l-2-2 3-3h2a2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z" opacity="0.3" />
    <path d="M8 14l3-3" strokeWidth="2.5" />
    <path d="M16 7l-3 3" strokeWidth="2.5" />
    <circle cx="17" cy="17" r="5" strokeWidth="1.5" />
    <path d="M15 17l1.5 1.5 3-3" strokeWidth="1.5" />
</IconBase>;

export const CustomMomBaby = (props) => <IconBase {...props} viewBox="0 0 24 24">
    <circle cx="16" cy="6" r="3" />
    <path d="M13 9h6v4a4 4 0 0 1-4 4h-2" />
    <path d="M16 21v-4" />
    <path d="M13 21v-4" />
    <path d="M5 16a3 3 0 1 0 6 0c0-2-3-3-3-6" />
    <circle cx="8" cy="19" r="1.5" />
    <path d="M9 13l-2 3" />
</IconBase>;

export const CustomHeadStorm = (props) => <IconBase {...props} viewBox="0 0 24 24">
    <path d="M13 3a7 7 0 0 1 6 9v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-4" />
    <path d="M7 16c0-3 2-4 3-6" />
    <path d="M15 13a2.5 2.5 0 1 0-4-2" strokeDasharray="2 2" />
    <path d="M16 10l2-2" />
    <path d="M17 12l3 1" />
    <path d="M15 8l2-3" />
</IconBase>;

export const CustomSleep = (props) => <IconBase {...props} viewBox="0 0 24 24">
    <path d="M2 18h20" />
    <path d="M3 18v-6a5 5 0 0 1 10 0v6" />
    <path d="M16 18v-4a3 3 0 0 1 5.5-1.5" />
    <path d="M18 6h4v2.5h-4z" />
    <path d="M22.5 7.25h1" />
    <path d="M19 6v2.5" fill="currentColor" opacity="0.3" />
    <path d="M7 9l-1-2" opacity="0.5" />
    <path d="M9 8l-1-2" opacity="0.5" />
</IconBase>;

export const CustomStomach = (props) => <IconBase {...props} viewBox="0 0 24 24">
    <path d="M6 4c0 3 1 4 2 4s3-1 3-4" />
    <path d="M11 4c0 6-3 7-5 10s1 7 8 7 9-4 9-9-4-9-8-9" />
    <path d="M11 12c2 1 4 1 6 0" />
    <path d="M12 15c2 1 4 1 5 0" />
    <path d="M19 5l1-1" />
    <path d="M19 8l2-1" />
    <path d="M4 12l-2 1" />
    <path d="M5 15l-2 1" />
</IconBase>;

export const CustomHeadTangle = (props) => <IconBase {...props} viewBox="0 0 24 24">
    <path d="M13 3a7 7 0 0 1 7 7v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-4" />
    <path d="M7 16c0-3 2-4 3-6" />
    <path d="M12 8c1.5 0 1.5 2.5 3 2.5s1.5-2 3-2" />
    <path d="M13 11c-1.5 0-1.5 2-3 2s-1.5-1.5-3-1.5" />
    <path d="M14 9c0 2-1.5 3-2 3" />
</IconBase>;

export const CustomFoot = (props) => <IconBase {...props} viewBox="0 0 24 24">
    <path d="M4 16v-2.38C4 11.5 2.97 10.74 2.38 10.5C1.5 10.14 1 9.16 1 8c0-2.21 1.79-4 4-4s4 1.79 4 4v8h11v-2.38c0-2.12-1.03-2.88-1.62-3.12C17.5 10.14 17 9.16 17 8c0-2.21 1.79-4 4-4s4 1.79 4 4v8h-4" />
    <path d="M4 20h10c1.5 0 3-.5 4-1.5" strokeWidth="2" strokeLinecap="round" />
    <circle cx="14" cy="9" r="1.5" />
    <circle cx="9" cy="11" r="1" />
</IconBase>;
