import React from 'react';

export default function NavBar() {
    return (
        <header className="max-w-7xl mx-auto p-6 flex justify-between items-center z-20 relative">
            {/* CODEPACT on the far left */}
            <div className="text-2xl font-audiowide text-white tracking-widest">CODEPACT</div>
            
            {/* Navigation links grouped on the far right */}
            <nav className="space-x-4">
                <a href="#" className="text-gray-400 hover:text-fuchsia-400 transition font-quicksand">Features</a>
                <a href="#" className="text-gray-400 hover:text-fuchsia-400 transition font-quicksand">About</a>
            </nav>
        </header>
    );
}
