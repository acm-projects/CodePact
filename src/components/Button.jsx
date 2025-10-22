// src/components/Button.jsx

import React from 'react';
// Import the ACCENT_GRADIENT style from the constants utility file

const ACCENT_GRADIENT = "bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500";

/**
 * A highly stylized, reusable button component for primary calls-to-action (CTAs).
 * It applies the application's signature futuristic gradient style.
 * * @param {object} props
 * @param {React.ReactNode} props.children - The content/text inside the button.
 * @param {function} props.onClick - The click handler function.
 * @param {string} [props.type="button"] - The button type for form submission (e.g., "submit").
 * @param {string} [props.widthClass="w-full"] - Custom Tailwind class for width/sizing.
 */
export default function Button({ children, onClick, type = "button", widthClass = "w-full" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            // Apply all the complex, futuristic button styling here using ACCENT_GRADIENT
            className={`${ACCENT_GRADIENT} text-white font-bold font-quicksand tracking-widest ${widthClass} py-3 rounded-lg 
                       transition-all duration-300 shadow-xl shadow-fuchsia-600/30 
                       hover:shadow-lg hover:shadow-cyan-400/50 transform hover:scale-[1.01]`}
        >
            {children}
        </button>
    );
}