// src/components/FormInput.jsx

import React from 'react';
import { FEATURE_BG } from "../utils/constants"; 

export default function FormInput({ label, type, name, value, onChange, placeholder, required = true }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full px-4 py-3 ${FEATURE_BG} border border-gray-700 rounded-lg focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition duration-200 shadow-inner shadow-black/50`}
            />
        </div>
    );
}