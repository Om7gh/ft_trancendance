import { Banner } from '@/assets';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StartNow(): JSX.Element {
    const navigate = useNavigate();
    return (
        <section className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border-2 border-violet-500 ring-4 ring-violet-800/50 p-4 bg-gray-900/50 backdrop-blur-sm overflow-hidden">
                <div className="relative group rounded-xl overflow-hidden">
                    <img
                        src={Banner}
                        alt="PingPop Game Banner"
                        className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/30 to-neon/30 mix-blend-overlay" />
                </div>

                <div className="flex flex-col justify-center items-center text-center p-4 space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 to-neon bg-clip-text text-transparent">
                        Get started and have fun with your friends!
                    </h3>
                    <p className="text-slate-300/80">
                        Join the ultimate ping pong experience with stunning
                        fantasy arenas
                    </p>
                    <button
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-500 to-neon text-white font-bold hover:from-violet-600 hover:to-neon transition-all shadow-lg hover:shadow-violet-500/30 hover:scale-105"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/auth/signin');
                        }}
                    >
                        Play Now →
                    </button>
                </div>
            </div>
        </section>
    );
}
