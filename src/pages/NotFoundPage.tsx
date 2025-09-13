import { memo } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import notFoundAnimation from '../assets/animations/Not Found.json';

const NotFoundPage = () => {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 p-8 text-center">
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"></div>

      <div className="z-10 flex w-full max-w-xl flex-col items-center">
        
        <div className="w-72 sm:w-80">
          <Lottie 
            animationData={notFoundAnimation} 
            loop={true} 
            autoplay={true} 
          />
        </div>

        {/* Konten Teks */}
        <div className="mt-6 flex flex-col items-center">
          <h1 className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-8xl font-black text-transparent sm:text-9xl">
            404
          </h1>
          
          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            Page Not Found
          </p>
          
          <p className="mt-3 max-w-md text-base text-slate-400">
            Oops! Sepertinya kamu berkelana terlalu jauh dari jalur utama. Mari kami bantu kamu kembali.
          </p>

          <Link
            to="/"
            className="mt-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Kembali ke Beranda
          </Link>
        </div>
        
      </div>
    </main>
  );
};

export default memo(NotFoundPage);