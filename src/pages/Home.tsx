import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // A robust function to handle when video is ready
    const handleVideoReady = () => {
      setIsVideoLoaded(true);
    };

    // Ensure muted is set on the DOM node for iOS autoplay policies
    video.muted = true;
    
    // Check if video is already ready (from cache or very fast network)
    if (video.readyState >= 3) { // HAVE_FUTURE_DATA
      handleVideoReady();
    } else {
      // Attach robust listeners for different ready states
      video.addEventListener('loadeddata', handleVideoReady);
      video.addEventListener('canplay', handleVideoReady);
      video.addEventListener('canplaythrough', handleVideoReady);
      video.addEventListener('playing', handleVideoReady);
    }

    // Function to attempt playback
    const attemptPlay = () => {
      if (!video) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Autoplay prevented:', err);
          // Even if autoplay is prevented, the video element is usually loaded and ready
          handleVideoReady(); 
        });
      }
    };

    // Attempt immediately
    attemptPlay();

    // Special handling for WeChat browser (WeixinJSBridge)
    // WeChat often blocks autoplay until its JSBridge is ready or a user interacts
    if (typeof window !== 'undefined') {
      // @ts-ignore - WeixinJSBridge is injected by WeChat
      if (window.WeixinJSBridge) {
        // @ts-ignore
        window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
          attemptPlay();
        });
      } else {
        document.addEventListener('WeixinJSBridgeReady', () => {
          // @ts-ignore
          window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
            attemptPlay();
          });
        }, false);
      }
    }

    // Absolute fallback: if network is super slow or browser entirely blocks loading, just show the page after 4 seconds
    const timeoutId = setTimeout(() => {
      handleVideoReady();
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
      if (video) {
        video.removeEventListener('loadeddata', handleVideoReady);
        video.removeEventListener('canplay', handleVideoReady);
        video.removeEventListener('canplaythrough', handleVideoReady);
        video.removeEventListener('playing', handleVideoReady);
      }
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="h-[100dvh] flex flex-col relative overflow-hidden bg-canvas"
    >
      <AnimatePresence>
        {!isVideoLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-canvas"
          >
            <div className="w-12 h-12 border-[2px] border-ink/20 border-t-ink rounded-full animate-spin mb-6"></div>
            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-ink/70">
              LOADING
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header: Clean, very small, wide tracking - Floating over video */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="absolute top-12 left-6 right-6 flex justify-between items-start font-sans text-[8px] uppercase tracking-[0.3em] text-ink/90 mix-blend-overlay drop-shadow-sm z-20"
      >
        <div>
          VOLUME I<br/>
          EST. 2026
        </div>
        <div className="text-right">
          PERSONALITY<br/>
          ASSESSMENT
        </div>
      </motion.div>
      
      {/* Video Section - Flex to fill available space */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isVideoLoaded ? 1 : 0 }}
        transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
        className="flex-1 w-full relative z-0 min-h-[20vh] overflow-hidden cursor-pointer"
        onClick={() => navigate('/all', { state: { fromHome: true } })}
      >
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="false"
          onLoadedData={() => setIsVideoLoaded(true)}
          onCanPlay={() => setIsVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply"
        >
          <source src="https://lf3-static.bytednsdoc.com/obj/eden-cn/evithyeh7vibfuhpe/%E6%8E%92%E8%A1%8C%E6%A6%9C/%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91.mp4" type="video/mp4" />
        </video>
        
        {/* Click indication text overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 bg-ink/5">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-ink/80 px-4 py-2 border border-ink/20 backdrop-blur-sm bg-canvas/40">
            VIEW GALLERY
          </span>
        </div>

        {/* Realistic Torn Paper Edge Image Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-[40px] sm:h-[60px] md:h-[90px] translate-y-[1px] pointer-events-none z-10">
          <img src="/torn-edge.svg?v=2" alt="" className="w-full h-full object-fill block" />
        </div>
      </motion.div>
      
      {/* Bottom Content Area - Fixed height section to ensure button is always visible */}
      <div className="shrink-0 flex flex-col items-center justify-between w-full px-6 pt-2 pb-[80px] relative z-10 bg-canvas min-h-[300px]">
        
        {/* Title Section */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center w-full flex flex-col items-center flex-1 justify-center"
        >
          <h1 className="font-serif text-[70px] sm:text-[90px] leading-none text-ink font-normal tracking-wide mb-4">
            N<span className="text-[70px] sm:text-[90px]">BTI</span>
          </h1>
          
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-italic text-[24px] sm:text-[28px] text-ink/90 font-light tracking-[0.1em]">
              职场牛马人格诊断
            </h2>
            <div className="w-12 h-[0.5px] bg-ink/30"></div>
            <div className="flex flex-col items-center mt-2 gap-1.5 w-full max-w-[320px]">
              <p className="font-sans text-[8px] uppercase tracking-[0.2em] text-ink/50 leading-relaxed text-center px-4">
                Discover your inner masterpiece through 30 carefully curated questions.
              </p>
              <p className="font-serif text-[12px] tracking-widest text-ink/70 leading-relaxed text-center">
                30道灵魂拷问，测出你的隐藏职场属性
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Bottom CTA */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="w-full flex justify-center mt-6 shrink-0"
        >
          <button 
            onClick={() => navigate('/quiz')}
            className="group relative w-full max-w-[320px] py-4 overflow-hidden bg-ink text-canvas transition-all duration-300 active:scale-[0.98]"
          >
            <span className="relative z-10 font-sans text-[11px] uppercase tracking-[0.3em]">
              开始诊断
            </span>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}