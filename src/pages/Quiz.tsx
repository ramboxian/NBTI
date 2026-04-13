import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';

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
    {/* 直线使用 1.5px 的统一粗细，颜色较浅的灰。为了不碰到 90px 的角花且留出 30px 间距，起止点设为 120px */}
    <div className="absolute top-0 left-[120px] right-[120px] h-[1.5px] bg-current"></div>
    <div className="absolute bottom-0 left-[120px] right-[120px] h-[1.5px] bg-current"></div>
    <div className="absolute left-0 top-[120px] bottom-[120px] w-[1.5px] bg-current"></div>
    <div className="absolute right-0 top-[120px] bottom-[120px] w-[1.5px] bg-current"></div>

    {/* 4 个角花：向外扩散 8px (从 -1px 改为 -9px)，使其更靠近屏幕边缘，但不影响直线的边距 */}
    <img src="/花边.svg" className="absolute top-[-9px] left-[-9px] w-[90px] h-[90px]" alt="" />
    <img src="/花边.svg" className="absolute top-[-9px] right-[-9px] w-[90px] h-[90px] transform scale-x-[-1]" alt="" />
    <img src="/花边.svg" className="absolute bottom-[-9px] left-[-9px] w-[90px] h-[90px] transform scale-y-[-1]" alt="" />
    <img src="/花边.svg" className="absolute bottom-[-9px] right-[-9px] w-[90px] h-[90px] transform scale-x-[-1] scale-y-[-1]" alt="" />

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
  const [scores, setScores] = useState<Record<string, number>>({ N: 0, B: 0, T: 0, S: 0 });
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
      className="min-h-[100dvh] flex flex-col items-center bg-canvas text-ink px-[32px] sm:px-[48px] py-16 relative overflow-hidden"
    >
      <VintageFrameOverlay />
      
      {/* Container to shift everything up by 30px */}
      <div className="w-full flex-1 flex flex-col items-center relative z-10 -mt-[30px]">
        {/* Question Number & Progress - Moved to Top */}
        <div className="w-full flex flex-col items-center justify-center font-sans mb-8 pt-4">
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
        
        {/* Question Content Area */}
        <div className="flex-1 w-full max-w-md flex flex-col justify-start">
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
            className="w-full flex flex-col"
          >
            {/* Question at the top */}
            <div className="mb-6">
              <h2 className="font-serif text-[20px] leading-[1.4] tracking-wide text-ink font-normal">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-0 border-t-[0.5px] border-ink/20">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentIndex] === opt.id;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionClick(opt.id, opt.scores)}
                    className={`group flex items-start text-left py-4 border-b-[0.5px] border-ink/20 transition-all duration-500 hover:bg-[#ebe6d8]/50 relative overflow-hidden ${isSelected ? 'bg-ink/5' : ''}`}
                  >
                    <span className={`font-serif text-[16px] italic w-10 shrink-0 pt-0 transition-opacity duration-500 text-center ${isSelected ? 'opacity-100 font-bold' : 'opacity-50 group-hover:opacity-100'}`}>
                      {opt.id}.
                    </span>
                    
                    <span className={`font-serif text-[15px] leading-relaxed transition-colors duration-500 pr-4 ${isSelected ? 'text-ink font-medium' : 'text-ink/80 group-hover:text-ink font-normal'}`}>
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
      </div>
    </motion.div>
  );
}