import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ModeSelection() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-canvas px-6 py-12"
    >
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-[320px] mx-auto space-y-10 pb-16">
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-center w-full"
        >
          <h1 className="font-serif text-[40px] leading-none text-ink font-normal tracking-wide mb-3">
            选择诊断模式
          </h1>
          <p className="font-serif text-[14px] text-ink/70 leading-relaxed text-center px-2">
            请根据你的时间安排，选择合适的版本
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="w-full flex flex-col gap-4"
        >
          <button 
            onClick={() => navigate('/quiz', { state: { mode: '30' } })}
            className="group relative w-full aspect-[4/3] overflow-hidden bg-ink transition-all duration-300 text-left flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.15)] active:scale-[0.98]"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity duration-500 filter contrast-[1.1] sepia-[0.2]"
              style={{ backgroundImage: `url('https://i.ibb.co/BHGCzJfB/DEPTH.jpg')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            <div className="relative z-10 p-6 mt-auto flex flex-col gap-1">
              <div className="flex items-end justify-between w-full mb-1">
                <span className="font-serif text-[28px] text-white tracking-wide">深度剖析版</span>
                <span className="font-serif text-[36px] text-[#d8c39e] leading-none mb-0.5 drop-shadow-md">30<span className="text-[16px] text-[#d8c39e]/80 ml-1 font-sans">题</span></span>
              </div>
              <span className="font-sans text-[13px] text-white/90 block leading-relaxed mt-2">
                全面深度的灵魂拷问，最精准还原你的职场生存画像。推荐首次测试使用。
              </span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/quiz', { state: { mode: '16' } })}
            className="group relative w-full aspect-[4/3] overflow-hidden bg-ink/5 transition-all duration-300 text-left flex flex-col shadow-sm active:scale-[0.98]"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity duration-500 filter contrast-[1.1] sepia-[0.2]"
              style={{ backgroundImage: `url('https://i.ibb.co/KcGqRPjP/FAST.jpg')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            <div className="relative z-10 p-6 mt-auto flex flex-col gap-1">
              <div className="flex items-end justify-between w-full mb-1">
                <span className="font-serif text-[28px] text-white tracking-wide">极速诊断版</span>
                <span className="font-serif text-[36px] text-[#d8c39e] leading-none mb-0.5 drop-shadow-md">16<span className="text-[16px] text-[#d8c39e]/80 ml-1 font-sans">题</span></span>
              </div>
              <span className="font-sans text-[13px] text-white/80 block leading-relaxed mt-2">
                保留最核心的问题，快速揭晓你的职场真面目。适合时间紧凑的牛马。
              </span>
            </div>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
