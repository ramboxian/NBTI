import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { resultsData } from '../data/results';

// Simple SVG Radar Chart
const RadarChart = ({ scores, themeColor }: { scores: Record<string, number>, themeColor: string }) => {
  // 按照题库实际的最小/最大值对分数进行归一化 (0到1)
  const normN = Math.max(0, Math.min(1, (scores.N + 22) / 52));
  const normB = Math.max(0, Math.min(1, (scores.B + 30) / 57));
  const normT = Math.max(0, Math.min(1, (scores.T + 30) / 60));

  // 半径和中心点
  const r = 40;
  const cx = 50;
  const cy = 50;

  // N (Top), B (Bottom Right), T (Bottom Left)
  const getPoint = (normValue: number, angleDeg: number) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return {
      x: cx + (r * normValue) * Math.cos(rad),
      y: cy + (r * normValue) * Math.sin(rad)
    };
  };

  const pN = getPoint(normN, 0);
  const pB = getPoint(normB, 120);
  const pT = getPoint(normT, 240);

  // Background grid points
  const g1N = getPoint(1, 0), g1B = getPoint(1, 120), g1T = getPoint(1, 240);
  const g2N = getPoint(0.66, 0), g2B = getPoint(0.66, 120), g2T = getPoint(0.66, 240);
  const g3N = getPoint(0.33, 0), g3B = getPoint(0.33, 120), g3T = getPoint(0.33, 240);

  // 直接使用 themeColor 作为十六进制颜色
  const hexColor = themeColor || '#ffffff';

  return (
    <div className="w-full flex flex-col items-center mt-16 mb-12">
      <h3 className="font-sans text-[14px] uppercase tracking-[0.4em] opacity-60 mb-4 flex items-center justify-center gap-3">
        Dimension Radar
        <span className="text-[10px] tracking-[0.2em] font-medium opacity-80">维度雷达</span>
      </h3>
      
      {/* N, B, T Explanation */}
      <div className="flex flex-col items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.2em] opacity-60 mb-10">
        <span><strong className="opacity-100 font-medium">N</strong> : 牛马值 (卷/躺)</span>
        <span><strong className="opacity-100 font-medium">B</strong> : 背锅值 (扛/闪)</span>
        <span><strong className="opacity-100 font-medium">T</strong> : 套路值 (深/浅)</span>
      </div>

      <div className="w-72 h-72 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {/* Background Grids */}
          <polygon points={`${g1N.x},${g1N.y} ${g1B.x},${g1B.y} ${g1T.x},${g1T.y}`} fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
          <polygon points={`${g2N.x},${g2N.y} ${g2B.x},${g2B.y} ${g2T.x},${g2T.y}`} fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
          <polygon points={`${g3N.x},${g3N.y} ${g3B.x},${g3B.y} ${g3T.x},${g3T.y}`} fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
          
          {/* Axes */}
          <line x1={cx} y1={cy} x2={g1N.x} y2={g1N.y} stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
          <line x1={cx} y1={cy} x2={g1B.x} y2={g1B.y} stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
          <line x1={cx} y1={cy} x2={g1T.x} y2={g1T.y} stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />

          {/* Labels */}
          <text x={g1N.x} y={g1N.y - 4} fontSize="5" fill="currentColor" textAnchor="middle" opacity="0.7">N</text>
          <text x={g1B.x + 5} y={g1B.y + 2} fontSize="5" fill="currentColor" textAnchor="middle" opacity="0.7">B</text>
          <text x={g1T.x - 5} y={g1T.y + 2} fontSize="5" fill="currentColor" textAnchor="middle" opacity="0.7">T</text>

          {/* Data Polygon */}
          <polygon 
            style={{ transformOrigin: '50% 50%' }}
            points={`${pN.x},${pN.y} ${pB.x},${pB.y} ${pT.x},${pT.y}`} 
            fill={hexColor} 
            fillOpacity="0.3" 
            stroke={hexColor} 
            strokeWidth="1.5" 
          />
          
          {/* Data Points */}
          <circle cx={pN.x} cy={pN.y} r="1.5" fill={hexColor} />
          <circle cx={pB.x} cy={pB.y} r="1.5" fill={hexColor} />
          <circle cx={pT.x} cy={pT.y} r="1.5" fill={hexColor} />
        </svg>
      </div>
    </div>
  );
};

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  // if skipLoading is passed, start directly at 'done'
  const [phase, setPhase] = useState<'loading' | 'done'>(
    location.state?.skipLoading ? 'done' : 'loading'
  );

  if (!location.state || !location.state.scores) {
    // 为了方便预览彩蛋效果，如果没有传入分数，则给一个默认触发彩蛋的高分组合
    location.state = {
      scores: { N: 8, B: -8, T: 7 }
    };
  }

  const scores = location.state.scores as Record<string, number>;
  
  // 恢复策划文档的原始计分判定（0 为界限），并按 v4 规则处理 score=0
  const determineType = (score: number, dimension: string) => {
    if (score > 0) return `${dimension}+`;
    if (score < 0) return `${dimension}-`;
    // score === 0 时随机归属
    return Math.random() < 0.5 ? `${dimension}+` : `${dimension}-`;
  };

  const resultId = React.useMemo(() => {
    const typeN = determineType(scores.N, 'N');
    const typeB = determineType(scores.B, 'B');
    const typeT = determineType(scores.T, 'T');
    return `${typeN}${typeB}${typeT}`;
  }, [scores.N, scores.B, scores.T]);
  
  // 提取单维度彩蛋 (正常逻辑，通过上面的默认高分自动触发)
  const easterEggs: { title: string; desc: string }[] = [];
  if (scores.N >= 7) easterEggs.push({ title: '🔥 牛马之魂', desc: '你的卷度已超越人类极限。建议检查一下自己是不是被PUA了，或者你其实享受这一切？' });
  if (scores.N <= -7) easterEggs.push({ title: '🛋️ 究极摸鱼王', desc: '你的摸鱼已臻化境。公司网络一半的流量可能都是你的。不过认真的说——你快乐吗？' });
  if (scores.B >= 7) easterEggs.push({ title: '🎒 背锅侠本侠', desc: '你已经背了太多锅。提醒一下：靠谱是美德，但不能无限透支。学会说"不"也是一种能力' });
  if (scores.B <= -7) easterEggs.push({ title: '🏃 闪电甩锅侠', desc: '你的不粘锅属性已满级。任何责任到你这里都会自动反弹。建议偶尔接一个锅——哪怕是空锅' });
  if (scores.T >= 7) easterEggs.push({ title: '🧠 职场诸葛亮', desc: '你已经活成了一本职场厚黑学。提醒：套路可以有，但真心不能丢。人生不止有KPI' });
  if (scores.T <= -7) easterEggs.push({ title: '💬 人间直球机', desc: '你的直球程度已经突破大气层。虽然世界需要真诚的人，但偶尔学点"说话的艺术"能救命' });

  // 如果需要修改结果对象的逻辑可以在这里进行，比如附带彩蛋内容
  let baseResult = resultsData[resultId];
  if (!baseResult) {
    baseResult = resultsData['N+B+T+'];
  }

  const result = {
    ...baseResult,
    easterEggs
  };

  useEffect(() => {
    if (phase === 'done') return;

    // Preload image
    const img = new Image();
    img.src = result.paintingUrl;

    const timer = setTimeout(() => {
      setPhase('done');
    }, 2500);
    return () => clearTimeout(timer);
  }, [result.paintingUrl, phase]);

  const renderLoading = () => (
    <div 
      className={`w-full h-[100dvh] flex flex-col items-center justify-center bg-canvas text-ink ${
        phase === 'loading'
          ? 'fixed inset-0 z-40' 
          : 'hidden'
      }`}
    >
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8"
      >
        <span className="font-serif text-[32px] tracking-widest font-light">Curating...</span>
      </motion.div>
      <p className="font-sans text-[9px] tracking-[0.4em] uppercase opacity-50">
        Preparing your masterpiece
      </p>
    </div>
  );

  const renderResultContent = () => (
    <div 
      style={{ backgroundColor: '#1a1817' }} 
      className="min-h-[100dvh] w-full flex flex-col items-center py-12 px-6 relative"
    >
      {/* Tinted Overlay layer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 50% 20%, ${result.themeColor}33 0%, transparent 70%)` 
        }}
      ></div>
      
      {/* Background Texture Overlay */}
      <div data-html2canvas-ignore className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stucco.png')]"></div>

      <div className="w-full max-w-[380px] flex flex-col items-center relative z-10">
        
        {/* Ticket Card */}
        <div 
          style={{ backgroundColor: result.themeColor, color: result.textColor }}
          className={`w-full rounded-[16px] flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative`}
        >
          <div className="w-full aspect-[4/3] relative rounded-t-[16px] overflow-hidden">
            <img 
              src={result.paintingUrl} 
              alt={result.name}
              className="w-full h-full object-cover filter contrast-[1.1] sepia-[0.25]"
            />
            <div 
              className="absolute bottom-0 left-0 w-full h-24"
              style={{
                background: `linear-gradient(to bottom, transparent, ${result.themeColor})`
              }}
            ></div>
          </div>

          <div className="px-6 pb-6 pt-2 relative z-10 flex flex-col items-center text-center">
            <h1 className="font-serif text-[42px] leading-none tracking-wide mb-3">
              {result.name}
            </h1>
            <p className="font-italic text-[16px] leading-relaxed opacity-80 max-w-[280px]">
              "{result.slogan}"
            </p>
            <div className="mt-8 mb-4 font-sans text-[10px] uppercase tracking-[0.2em] opacity-60 flex justify-between w-full px-2">
              <span>FOR: JANE DOE</span>
              <span>DATE: 10.05.2026</span>
            </div>
          </div>

          <div className="relative w-full h-[2px] flex items-center justify-center">
            <div className="absolute left-[-10px] w-5 h-5 bg-[#1e1c1a] rounded-full shadow-inner"></div>
            <div className="absolute right-[-10px] w-5 h-5 bg-[#1e1c1a] rounded-full shadow-inner"></div>
            <div className="w-[calc(100%-30px)] border-t-[1.5px] border-dashed border-current opacity-30"></div>
          </div>

          <div className="px-6 py-6 flex justify-between items-center opacity-90">
             <div className="font-sans text-[9px] uppercase tracking-[0.2em] leading-relaxed">
               N{scores.N > 0 ? '+' : ''}{scores.N} / B{scores.B > 0 ? '+' : ''}{scores.B} / T{scores.T > 0 ? '+' : ''}{scores.T}<br/>
               NBTI ASSESSMENT<br/>
               Valid for one life
             </div>
             
             <div className="flex items-center gap-3">
               <div className="flex flex-col items-end justify-center">
                 <span className="font-sans text-[8px] font-bold tracking-[0.1em] uppercase">Scan to test</span>
                 <span className="font-sans text-[6px] tracking-[0.2em] opacity-70 mt-0.5">扫码测测你的牛马值</span>
               </div>
               <div className="w-12 h-12 bg-current rounded-sm flex items-center justify-center">
                 {/* 简单的 SVG 二维码占位符 */}
                 <svg viewBox="0 0 24 24" style={{ color: result.themeColor }} className="w-10 h-10">
                   <path fill="currentColor" d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v3h-3v-3zm-3 0h2v2h-2v-2zm-3-3h2v2h-2v-2zm0 3h2v2h-2v-2zm-4-3h3v5h-3v-5zm1-7h3v2h-3V7z" />
                 </svg>
               </div>
             </div>
          </div>
        </div>

        {/* Details Below Ticket */}
        <div className="w-full mt-12 space-y-12 text-[#f4f0ea]">
          <div className="px-2">
            <h2 className="font-serif text-[32px] mb-6 border-b-[0.5px] border-[#f4f0ea]/20 pb-4 flex items-baseline gap-4">
              Diagnosis
              <span className="font-sans text-[12px] tracking-[0.2em] opacity-60 font-light mb-1 uppercase">核心诊断</span>
            </h2>
            <div className="space-y-6">
              {result.easterEggs && result.easterEggs.length > 0 && (
                <div className="relative mt-8 mb-16 w-full flex flex-col items-center">
                  {/* Top Banner Image as a "Hanging Painting" */}
                  <div className="relative w-full z-20">
                    <img 
                      src="/images/easter-egg-banner.png" 
                      alt="Easter Egg" 
                      className="w-[110%] max-w-[110%] ml-[-5%] h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                  
                  {/* Museum Plaque / Descriptive Card */}
                  <div className="w-[96%] relative z-10 -mt-10 pt-16 pb-10 px-6 flex flex-col items-center bg-gradient-to-b from-[#2c2620] to-[#1e1c1a] border border-[#d8c39e]/20 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                    {/* Inner decorative border line */}
                    <div className="absolute inset-1.5 border border-[#d8c39e]/10 rounded-lg pointer-events-none"></div>

                    {/* Congratulatory Text */}
                    <div className="relative w-full flex flex-col items-center mb-8">
                      <p className="font-serif text-[14px] leading-[1.8] opacity-90 text-[#e6dfd1] text-center">
                        恭喜你！在原有的人格诊断中，<br/>
                        我们为你检测出了隐藏的专属彩蛋。<br/>
                        这简直是万里挑一的独特存在。
                      </p>
                      <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#d8c39e]/50 to-transparent mt-6"></div>
                    </div>
                    
                    <div className="space-y-8 w-full">
                      {result.easterEggs.map((egg, idx) => (
                        <div key={idx} className="flex flex-col gap-3 text-center">
                          <h4 className="font-serif text-[18px] font-bold tracking-widest text-[#d8c39e] drop-shadow-sm">{egg.title}</h4>
                          <p className="font-serif text-[14px] leading-[1.8] opacity-80 text-[#f4f0ea]">{egg.desc}</p>
                          {idx < result.easterEggs.length - 1 && (
                            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d8c39e]/30 to-transparent mx-auto mt-4"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-sans text-[11px] uppercase tracking-[0.2em] opacity-50 mb-2 flex items-center gap-2">
                  Core Profile
                  <span className="text-[9px] tracking-[0.1em] opacity-80">核心画像</span>
                </h3>
                <p className="font-serif text-[16px] leading-[1.8] text-[#f4f0ea]/80 text-justify">
                  {result.description}
                </p>
              </div>
              
              <div>
                <h3 className="font-sans text-[11px] uppercase tracking-[0.2em] opacity-50 mb-2 flex items-center gap-2">
                  Daily Routine
                  <span className="text-[9px] tracking-[0.1em] opacity-80">职场日常</span>
                </h3>
                <p className="font-serif text-[16px] leading-[1.8] text-[#f4f0ea]/80 text-justify">
                  {result.routine}
                </p>
              </div>

              <div>
                <h3 className="font-sans text-[11px] uppercase tracking-[0.2em] opacity-50 mb-2 flex items-center gap-2">
                  Fatal Weakness
                  <span className="text-[9px] tracking-[0.1em] opacity-80">致命弱点</span>
                </h3>
                <p className="font-serif text-[16px] leading-[1.8] text-[#f4f0ea]/80 text-justify">
                  {result.weakness}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {result.traits.map((trait, idx) => (
                <span key={idx} className="font-sans text-[9px] uppercase tracking-[0.2em] border border-[#f4f0ea]/30 px-4 py-2 rounded-full text-[#f4f0ea]/70">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="px-2">
            <h2 className="font-serif text-[32px] mb-6 border-b-[0.5px] border-[#f4f0ea]/20 pb-4 flex items-baseline gap-4">
              Colleague's View
              <span className="font-sans text-[12px] tracking-[0.2em] opacity-60 font-light mb-1 uppercase">同事眼中的你</span>
            </h2>
            <ul className="space-y-4">
              {result.colleagueView.map((item, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <span className="font-serif text-[16px] leading-[1.8] text-[#f4f0ea]/80 italic">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-2">
            <h2 className="font-serif text-[32px] mb-6 border-b-[0.5px] border-[#f4f0ea]/20 pb-4 flex items-baseline gap-4">
              Strategy & Risks
              <span className="font-sans text-[12px] tracking-[0.2em] opacity-60 font-light mb-1 uppercase">生存策略与雷区</span>
            </h2>
            <ul className="space-y-6">
              {result.strategy.map((item, idx) => (
                <li key={idx} className="flex gap-5 items-start">
                  <span className="font-italic text-[20px] text-[#f4f0ea]/40 shrink-0 mt-[-2px]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="font-serif text-[16px] leading-[1.8] text-[#f4f0ea]/80">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <RadarChart scores={scores} themeColor={result.themeColor} />
        </div>

        {/* Action Buttons */}
        <div className="w-full mt-16 mb-16 flex flex-col gap-4 px-4 relative z-10 max-w-[320px] mx-auto">
          <button 
            onClick={() => navigate('/')} 
            className="group relative w-full h-14 bg-[#f4f0ea] text-[#1a1817] rounded-none font-sans text-[11px] font-bold uppercase tracking-[0.3em] overflow-hidden transition-all duration-300 active:scale-[0.98] shadow-md"
          >
            <span className="relative z-10">再测一次</span>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>
          
          <button 
            onClick={() => navigate('/all', { state: { scores } })} 
            className="group relative w-full h-14 bg-transparent text-[#f4f0ea] border border-[#f4f0ea]/30 rounded-none font-sans text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-300 active:scale-[0.98]"
          >
            <span className="relative z-10">查看所有人格</span>
            <div className="absolute inset-0 bg-[#f4f0ea] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Signature */}
        <div className="w-full pb-12 flex justify-center relative z-10">
          <img 
            src="/md.svg" 
            alt="MD Signature" 
            className="w-[142px] opacity-[0.3]" 
          />
        </div>

      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[100dvh] bg-canvas overflow-hidden">
      {renderLoading()}
      
      <div className={`absolute inset-0 z-10 overflow-y-auto no-scrollbar ${phase === 'loading' ? 'invisible' : 'visible'}`}>
        {renderResultContent()}
      </div>
    </div>
  );
}
