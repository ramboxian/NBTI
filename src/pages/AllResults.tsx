import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { resultsData } from '../data/results';

import 'swiper/css';
import 'swiper/css/effect-cards';

export default function AllResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const results = Object.values(resultsData);
  
  const handleBack = () => {
    // If we have previous scores in state, pass them back to Result page
    if (location.state && location.state.scores) {
      navigate('/result', { state: { scores: location.state.scores, skipLoading: true } });
    } else {
      navigate(-1);
    }
  };

  const isFromHome = location.state?.fromHome;
  const bottomButtonText = isFromHome ? '开始诊断' : '重新诊断';
  const bottomButtonRoute = isFromHome ? '/quiz' : '/';

  return (
    <div className="w-full min-h-[100dvh] bg-[#1a1817] text-[#f4f0ea] flex flex-col relative overflow-x-hidden overflow-y-auto no-scrollbar pb-12">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stucco.png')]"></div>

      {/* Header */}
      <div className="pt-8 pb-4 flex flex-col items-center text-center relative z-10 w-full px-6">
        <div className="w-full flex justify-start mb-6">
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 text-[#f4f0ea]/70 hover:text-[#d8c39e] transition-colors font-serif text-[14px] tracking-widest"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回
          </button>
        </div>
        
        <h1 className="font-serif text-[32px] tracking-widest uppercase mb-2 text-[#d8c39e]">
          八大牛马图鉴
        </h1>
        <div className="w-12 h-[1px] bg-[#d8c39e]/40 mb-4"></div>
        <p className="font-serif text-[13px] leading-[1.8] opacity-70">
          左右滑动查看所有隐藏人格
        </p>
      </div>

      {/* Swiper Section */}
      <div className="flex-1 w-full flex items-center justify-center relative z-10 px-4 py-2">
        <Swiper
          effect={'cards'}
          grabCursor={true}
          loop={true}
          modules={[EffectCards]}
          className="w-full max-w-[340px] h-[580px]"
        >
          {results.map((result, idx) => (
            <SwiperSlide 
              key={idx} 
              className="rounded-[24px] overflow-hidden flex flex-col relative bg-transparent"
              style={{
                boxShadow: '0 20px 50px -10px rgba(0,0,0,0.8), 0 10px 20px -5px rgba(0,0,0,0.5)'
              }}
            >
              {/* Dynamic Theme Background */}
              <div 
                className="absolute inset-0 z-0" 
                style={{ backgroundColor: result.themeColor }}
              ></div>

              {/* Elegant Gradient Thin Border Overlay */}
              <div className="absolute inset-0 rounded-[24px] border-[1px] border-transparent pointer-events-none z-30" 
                   style={{ 
                     background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.4) 100%) border-box`,
                     WebkitMask: `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
                     WebkitMaskComposite: 'xor',
                     maskComposite: 'exclude'
                   }}>
              </div>
              
              {/* Inner Card Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Image Area */}
                <div className="w-full h-[45%] relative overflow-hidden">
                  <img 
                    src={result.paintingUrl} 
                    alt={result.name}
                    className="w-full h-full object-cover filter contrast-[1.1] sepia-[0.25]"
                  />
                  {/* Top Fade overlay */}
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#1a1817]/60 to-transparent"></div>
                  
                  {/* Bottom Fade overlay blending into card color */}
                  <div 
                    className="absolute bottom-0 left-0 w-full h-32"
                    style={{ background: `linear-gradient(to bottom, transparent 0%, ${result.themeColor} 80%, ${result.themeColor} 100%)` }}
                  ></div>
                  
                  {/* Elegant Badge in Top Right Corner */}
                  <div className="absolute top-4 right-4 flex items-center">
                    <span className="font-sans text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md bg-[#1a1817]/50 text-[#f4f0ea] border-[0.5px] border-[#f4f0ea]/20 tracking-[0.1em] shadow-sm">
                      {result.id}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div 
                  className="flex-1 px-8 pt-0 pb-6 flex flex-col items-center text-center justify-start relative z-20"
                  style={{ color: result.textColor }}
                >
                  <h3 className="font-serif text-[32px] mb-2 leading-tight tracking-wide drop-shadow-md">
                    {result.name}
                  </h3>
                  <p className="font-serif italic text-[14px] leading-relaxed opacity-90 mb-4 drop-shadow-sm">
                    "{result.slogan}"
                  </p>
                  
                  <div className="flex items-center gap-3 mb-4 w-full justify-center">
                    <div className="w-1 h-1 rotate-45 opacity-40" style={{ backgroundColor: result.textColor }}></div>
                    <div className="h-[1px] w-12 opacity-20" style={{ backgroundColor: result.textColor }}></div>
                    <div className="w-1 h-1 rotate-45 opacity-40" style={{ backgroundColor: result.textColor }}></div>
                  </div>
                  
                  <div className="flex-1 w-full overflow-y-auto no-scrollbar pb-2 pt-1">
                    <p className="font-serif text-[12px] sm:text-[13px] leading-[1.8] opacity-85 text-justify px-1 drop-shadow-sm">
                      {result.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Bottom Action Button */}
      <div className="pt-6 w-full flex justify-center relative z-10 px-6 shrink-0 mt-auto">
        <button 
          onClick={() => navigate(bottomButtonRoute)} 
          className="group relative w-full max-w-[320px] h-14 bg-[#f4f0ea] text-[#1a1817] rounded-none font-sans text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-300 active:scale-[0.98] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          <span className="relative z-10 font-bold">{bottomButtonText}</span>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
}
