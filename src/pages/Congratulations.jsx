// src/pages/Congratulations.jsx

import React from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import {
    BACKGROUND_COLOR, ACCENT_GRADIENT, FEATURE_BG, BORDER_COLOR, GridOverlay
} from "../utils/constants";


// Internal component holding the main content block
const CongratsView = ({ navigate }) => (
    <div className={`${FEATURE_BG} ${BORDER_COLOR} border rounded-2xl p-6 sm:p-10 shadow-2xl shadow-fuchsia-900/50 text-center animate-fade-in`}>
        <h1 className="text-3xl font-audiowide tracking-widest mb-4 uppercase font-bold">
            <span className="text-white">ACCOUNT </span>
            <span className={`bg-clip-text text-transparent ${ACCENT_GRADIENT}`}>ACTIVATED</span>
        </h1>

        <p className="text-gray-300 text-lg mb-3 font-quicksand">
            Congratulations!
        </p>
        <p className="text-gray-400 text-base mb-8 font-light max-w-md mx-auto font-quicksand">
            You've successfully secured your place in the CodePact collective. You can now proceed to log in and start collaborating.
        </p>

        <Button
            onClick={() => navigate("/login")} 
            widthClass="w-full max-w-sm mx-auto block" 
        >
            LOGIN
        </Button>
    </div>
);


export default function Congratulations() {
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen ${BACKGROUND_COLOR} text-white relative overflow-hidden flex flex-col font-quicksand`}>
            <GridOverlay />
            
            <div className="absolute top-[-10rem] left-1/4 w-[50rem] h-[50rem] bg-fuchsia-500/10 rounded-full filter blur-3xl opacity-30 pointer-events-none z-0"></div>

            <NavBar />

            <div className={`relative z-10 w-full mb-12`}>
                <div className={`h-[2px] bg-gray-700 opacity-70`}></div>
            </div>

            <main className="max-w-xl mx-auto px-6 relative z-10 py-16 flex-grow">
                <CongratsView navigate={navigate} />
            </main>

            <Footer />
        </div>
    );
}