import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';

// 1:1 严格复刻参考图：经典的小巧精致角花
const CornerOrnament = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* 边框直角连线 - 加粗以匹配四周的 1.5px 边框感 */}
      <path d="M 0 95 L 0 5 C 0 2, 2 0, 5 0 L 95 0" strokeWidth="3" />
      
      <g strokeWidth="1.5">
        {/* 边框连线末端的菱形/小水滴箭头 */}
        <path d="M 95 0 L 91 -2 L 91 2 Z" fill="currentColor" stroke="none" />
        <path d="M 0 95 L -2 91 L 2 91 Z" fill="currentColor" stroke="none" />

        {/* 中心向外发散的主藤蔓 (饱满的C形曲线) */}
        <path d="M 10 10 C 25 25, 30 45, 20 55 C 10 65, 0 50, 10 40 C 15 35, 25 35, 30 45" />
        
        {/* 右侧的副藤蔓 (饱满的S形/C形曲线) */}
        <path d="M 25 15 C 40 10, 55 10, 65 20 C 75 30, 60 40, 50 30 C 45 25, 45 15, 55 10" />
        
        {/* 内侧的小卷曲 */}
        <path d="M 35 30 C 45 40, 55 40, 60 30" />
        <path d="M 15 30 C 25 40, 25 50, 15 55" />

        {/* 叶片点缀 */}
        <path d="M 35 15 C 45 20, 55 20, 60 10" />

        {/* 原图标志性的圆点 (实心) */}
        <circle cx="20" cy="40" r="2" fill="currentColor" stroke="none" />
        <circle cx="50" cy="30" r="2" fill="currentColor" stroke="none" />
        <circle cx="55" cy="35" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="65" cy="15" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="15" cy="55" r="1.5" fill="currentColor" stroke="none" />

        {/* 散落的游离点 */}
        <circle cx="45" cy="45" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="30" cy="55" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="75" cy="20" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="70" cy="10" r="1.2" fill="currentColor" stroke="none" />
      </g>
    </g>
  </svg>
);

// 1:1 严格复刻参考图：顶部和底部的对称花草装饰
const TopBottomOrnament = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* 左右两侧连入的直线及箭头 */}
      <path d="M 0 12 L 60 12" />
      <path d="M 60 12 L 56 9 L 56 15 Z" fill="currentColor" stroke="none" />
      
      <path d="M 200 12 L 140 12" />
      <path d="M 140 12 L 144 9 L 144 15 Z" fill="currentColor" stroke="none" />

      {/* 中心对称的舒展蔓草 (像蝴蝶翅膀一样展开) */}
      <path d="M 70 12 C 80 5, 90 5, 100 12" />
      <path d="M 130 12 C 120 5, 110 5, 100 12" />
      
      <path d="M 85 12 C 90 18, 95 20, 100 16 C 105 12, 105 6, 100 2 C 95 -2, 85 4, 80 12" />
      <path d="M 115 12 C 110 18, 105 20, 100 16 C 95 12, 95 6, 100 2 C 105 -2, 115 4, 120 12" />
      
      {/* 外侧的细小卷须 */}
      <path d="M 75 12 C 70 15, 65 12, 68 9" />
      <path d="M 125 12 C 130 15, 135 12, 132 9" />

      {/* 中心的微小菱形和圆点 */}
      <path d="M 100 14 L 102 16 L 100 18 L 98 16 Z" fill="currentColor" stroke="none" />
      <circle cx="100" cy="2" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="68" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="132" cy="9" r="1" fill="currentColor" stroke="none" />
    </g>
  </svg>
);

// 1:1 严格复刻参考图：侧边轻盈小巧的8字形/无限结装饰
const SideOrnament = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 100" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* 上下连入的直线及水滴形/菱形末端 */}
      <path d="M 12 0 L 12 25" />
      <path d="M 12 25 L 9 21 L 15 21 Z" fill="currentColor" stroke="none" />
      
      <path d="M 12 100 L 12 75" />
      <path d="M 12 75 L 9 79 L 15 79 Z" fill="currentColor" stroke="none" />

      {/* 中心的瘦长8字形藤蔓 */}
      <path d="M 12 35 C 18 35, 20 40, 16 45 C 12 50, 8 50, 4 55 C 0 60, 4 65, 12 65 C 18 65, 20 60, 16 55 C 12 50, 8 50, 4 45 C 0 40, 4 35, 12 35 Z" />
      
      {/* 外部的半弧形拥抱线 */}
      <path d="M 12 30 C 4 30, 0 35, 5 42" />
      <path d="M 12 70 C 4 70, 0 65, 5 58" />
      
      {/* 散落的圆点点缀 */}
      <circle cx="12" cy="50" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="45" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="55" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="5" cy="42" r="1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="58" r="1" fill="currentColor" stroke="none" />
    </g>
  </svg>
);

const VintageFrameOverlay = () => (
  <div className="absolute inset-4 pointer-events-none z-0 text-[#9C9C9C] opacity-80">
    {/* 直线使用 1.5px 的统一粗细，颜色较浅的灰，不再是极细 */}
    <div className="absolute top-0 left-[45px] right-[45px] h-[1.5px] bg-current"></div>
    <div className="absolute bottom-0 left-[45px] right-[45px] h-[1.5px] bg-current"></div>
    <div className="absolute left-0 top-[45px] bottom-[45px] w-[1.5px] bg-current"></div>
    <div className="absolute right-0 top-[45px] bottom-[45px] w-[1.5px] bg-current"></div>

    {/* 4 个角花：尺寸小巧(w-12)但图案饱满，不夸张 */}
    <CornerOrnament className="absolute top-[-1px] left-[-1px] w-12 h-12 text-current" />
    <CornerOrnament className="absolute top-[-1px] right-[-1px] w-12 h-12 text-current transform scale-x-[-1]" />
    <CornerOrnament className="absolute bottom-[-1px] left-[-1px] w-12 h-12 text-current transform scale-y-[-1]" />
    <CornerOrnament className="absolute bottom-[-1px] right-[-1px] w-12 h-12 text-current transform scale-x-[-1] scale-y-[-1]" />

    {/* 上下中心装饰：细长优美 */}
    <TopBottomOrnament className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-32 h-3.5 text-current" />
    <TopBottomOrnament className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-32 h-3.5 text-current transform scale-y-[-1]" />

    {/* 侧边装饰：极度克制小巧 */}
    <SideOrnament className="absolute top-1/2 -translate-y-1/2 left-[-6px] w-3.5 h-16 text-current" />
    <SideOrnament className="absolute top-1/2 -translate-y-1/2 right-[-6px] w-3.5 h-16 text-current transform scale-x-[-1]" />
  </div>
);

export default function Quiz() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ N: 0, B: 0, T: 0 });
  const [history, setHistory] = useState<Record<string, number>[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // Store selected option id by question index
  const [direction, setDirection] = useState(1);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (optionId: string, optionScores: Record<string, number>) => {
    // Check if we are re-answering a question
    const isReanswering = answers[currentIndex] !== undefined;

    if (isReanswering) {
      // If re-answering, we need to rollback to the score BEFORE this question was answered
      // Luckily, the history array at `currentIndex` holds exactly this!
      const scoreBeforeThisQuestion = history[currentIndex];
      
      const newScores = { ...scoreBeforeThisQuestion };
      Object.keys(optionScores).forEach((key) => {
        if (newScores[key] !== undefined) {
          newScores[key] += optionScores[key];
        }
      });
      setScores(newScores);
      
      // Update answers
      setAnswers(prev => ({ ...prev, [currentIndex]: optionId }));
      
    } else {
      // First time answering this question
      setHistory(prev => {
        const newHistory = [...prev];
        newHistory[currentIndex] = { ...scores };
        return newHistory;
      });
      
      const newScores = { ...scores };
      Object.keys(optionScores).forEach((key) => {
        if (newScores[key] !== undefined) {
          newScores[key] += optionScores[key];
        }
      });
      setScores(newScores);
      setAnswers(prev => ({ ...prev, [currentIndex]: optionId }));
    }

    // Move to next question or result
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setDirection(1);
        setCurrentIndex(currentIndex + 1);
      } else {
        // Need to pass the LATEST computed score here, not the state `scores` which might be stale
        const finalScores = { ...(isReanswering ? history[currentIndex] : scores) };
        Object.keys(optionScores).forEach((key) => {
          if (finalScores[key] !== undefined) {
            finalScores[key] += optionScores[key];
          }
        });
        navigate('/result', { state: { scores: finalScores } });
      }
    }, 200); // Add a tiny delay so the user sees their selection highlight before moving
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      // We do NOT modify history or answers when going back.
      // We just change the view. The score will be re-calculated correctly when they pick an option.
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const variants = {
    enter: (direction: number) => {
      return {
        opacity: 0,
        y: direction > 0 ? 10 : -10,
        filter: "blur(4px)"
      };
    },
    center: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)"
    },
    exit: (direction: number) => {
      return {
        opacity: 0,
        y: direction < 0 ? 10 : -10,
        filter: "blur(4px)"
      };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-[100dvh] flex flex-col items-center bg-canvas text-ink px-6 sm:px-10 py-16 relative overflow-hidden"
    >
      <VintageFrameOverlay />
      
      {/* Question Number & Progress - Moved to Top */}
      <div className="w-full flex flex-col items-center justify-center font-sans -mt-[20px] mb-[20px] relative z-10">
        <span className="text-[12px] uppercase tracking-[0.2em] opacity-50 mb-3">
          Question {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} / {questions.length}
        </span>
        <div className="w-48 h-[1px] bg-ink/10">
          <motion.div 
            className="h-full bg-ink/40"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* Question Content Area - Moved up by 116px (60px + 56px) */}
      <div className="flex-1 w-full max-w-md flex flex-col justify-center relative z-10 -mt-[116px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              filter: { duration: 0.4 }
            }}
            className="w-full h-full flex flex-col"
          >
            {/* Question at the top */}
            <div className="mb-6">
              <h2 className="font-serif text-[24px] leading-[1.4] tracking-wide text-ink font-normal">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-0 mt-auto mb-auto border-t-[0.5px] border-ink/20">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentIndex] === opt.id;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionClick(opt.id, opt.scores)}
                    className={`group flex items-start text-left py-6 border-b-[0.5px] border-ink/20 transition-all duration-500 hover:bg-[#ebe6d8]/50 relative overflow-hidden ${isSelected ? 'bg-ink/5' : ''}`}
                  >
                    <span className={`font-serif text-[20px] italic w-12 shrink-0 pt-0.5 transition-opacity duration-500 text-center ${isSelected ? 'opacity-100 font-bold' : 'opacity-50 group-hover:opacity-100'}`}>
                      {opt.id}.
                    </span>
                    
                    <span className={`font-serif text-[16px] leading-relaxed transition-colors duration-500 pr-4 ${isSelected ? 'text-ink font-medium' : 'text-ink/80 group-hover:text-ink font-normal'}`}>
                      {opt.text}
                    </span>
                    
                    {/* Extremely subtle left highlight line */}
                    <div className={`absolute top-0 left-0 w-[2px] h-full bg-ink transform transition-transform duration-500 origin-top ${isSelected ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`}></div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Previous Question Button - Only visible after first question */}
      <AnimatePresence>
        {currentIndex > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-10 left-0 w-full flex justify-center z-20"
          >
            <button 
              onClick={handlePreviousQuestion}
              className="font-sans text-[11px] uppercase tracking-[0.2em] text-ink/50 hover:text-ink px-6 py-2 border border-ink/20 hover:border-ink transition-all duration-300 rounded-none bg-transparent"
            >
              上一题
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}