import React, { useState, useEffect, useRef } from 'react';
import howItWorksBg from '../assets/how-it-works-bg.png';

export default function HowItWorks({ language = 'bn', setActiveTab }) {
  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoSlideActive, setIsAutoSlideActive] = useState(true);
  const touchStartX = useRef(0);
  const autoSlideTimerRef = useRef(null);
  const SLIDE_DURATION = 3800; // 3.8s per card ultra-smooth transition

  const stepDescriptions = [
    { 
      stepBn: "ধাপ ০১ / ০৬", 
      stepEn: "Step 01 / 06",
      textBn: "ভয়েস ও এআই প্রম্পট চ্যাট দিয়ে যে কোনো জটিল কৃষি সমস্যার কথা মুখে বলে বা লিখে জানান।",
      textEn: "Voice or text-based conversational plant health diagnostic assistant."
    },
    { 
      stepBn: "ধাপ ০২ / ০৬", 
      stepEn: "Step 02 / 06",
      textBn: "পাতার ছবি তুলে বা আপলোড করে ৯৮% নির্ভুল কম্পিউটার ভিশন প্যাথোলজি ডায়াগনোসিস পান।",
      textEn: "Capture or upload leaf canopy photos for 98% accurate computer vision pathology."
    },
    { 
      stepBn: "ধাপ ০৩ / ০৬", 
      stepEn: "Step 03 / 06",
      textBn: "ঝড়, বৃষ্টি ও বাতাসের লাইভ গতির ওপর ভিত্তি করে নিরাপদ স্প্রে সময় নির্ধারণ করুন।",
      textEn: "Real-time telemetry and weather-calibrated spray safety advisory gauge."
    },
    { 
      stepBn: "ধাপ ০৪ / ০৬", 
      stepEn: "Step 04 / 06",
      textBn: "মধ্যস্বত্বভোগীদের এড়িয়ে স্থানীয় পাইকারি মোকামের সেরা বাজারদর ও সম্ভাব্য ক্ষতি যাচাই করুন।",
      textEn: "Eliminate middlemen with real-time wholesale mandi price intelligence."
    },
    { 
      stepBn: "ধাপ ০৫ / ০৬", 
      stepEn: "Step 05 / 06",
      textBn: "জমির সঠিক আয়তন অনুযায়ী ইউরিয়া, ডিএপি ও পটাশ সারের নিখুঁত মাত্রা পরিমাপ করুন।",
      textEn: "Calculate balanced Urea, TSP, and MoP fertilizer doses for your exact plot size."
    },
    { 
      stepBn: "ধাপ ০৬ / ০৬", 
      stepEn: "Step 06 / 06",
      textBn: "এক ক্লিকে রোগমুক্তি ও পুষ্টির সার্টিফাইড ডিজিটাল ক্রপ পাসপোর্ট PDF আকারে ডাউনলোড করুন।",
      textEn: "Download verified official Digital Crop Health Passports with secure QR codes."
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % totalSteps);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + totalSteps) % totalSteps);
  };

  const goToStep = (idx) => {
    setCurrentStep(idx);
    resetAutoSlideTimer();
  };

  const startAutoSlide = () => {
    if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    autoSlideTimerRef.current = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % totalSteps);
    }, SLIDE_DURATION);
  };

  const stopAutoSlide = () => {
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
      autoSlideTimerRef.current = null;
    }
  };

  const resetAutoSlideTimer = () => {
    if (isAutoSlideActive) {
      stopAutoSlide();
      startAutoSlide();
    }
  };

  const toggleAutoSlide = () => {
    setIsAutoSlideActive((prev) => {
      const nextState = !prev;
      if (nextState) {
        startAutoSlide();
      } else {
        stopAutoSlide();
      }
      return nextState;
    });
  };

  // Auto-Slide Lifecycle
  useEffect(() => {
    if (isAutoSlideActive) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [isAutoSlideActive]);

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX < -40) {
      nextStep();
      resetAutoSlideTimer();
    } else if (diffX > 40) {
      prevStep();
      resetAutoSlideTimer();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextStep();
        resetAutoSlideTimer();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
        resetAutoSlideTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // IntersectionObserver for soft-focus scroll reveal
  const sectionRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-focus');
        }
      });
    }, { threshold: 0.15 });

    const elements = sectionRef.current?.querySelectorAll('.reveal-focus');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="how-it-works" 
      ref={sectionRef} 
      className="how-it-works-section"
    >
      {/* Background Paddy Harvest Image Layer with Backdrop Blur */}
      <div className="hiw-backdrop-layer">
        <img 
          src={howItWorksBg} 
          alt="কৃষকের সোনালী ধান কাটা" 
          className="hiw-backdrop-img"
        />
        <div className="hiw-backdrop-overlay" />
        <div className="hiw-backdrop-fade-top" />
        <div className="hiw-backdrop-fade-bottom" />
      </div>

      <div className="hiw-content-container">
        
        {/* Section Header (Reveals from Below into Focus) */}
        <div className="reveal-focus hiw-header-block">
          <h2 className="hiw-main-heading font-serif-bn">
            {language === 'bn' ? (
              <>কোন সমস্যার জন্য কোথায় ক্লিক করবেন?<br /><span className="text-gold-gradient">অঙ্কুর অ্যাপের পূর্ণাঙ্গ সচিত্র নির্দেশিকা</span></>
            ) : (
              <>Where to Click for Which Problem?<br /><span className="text-gold-gradient">Visual Feature Guide to Onkur App</span></>
            )}
          </h2>

          <p className="hiw-sub-desc font-serif-bn">
            {language === 'bn' 
              ? 'কার্ডগুলো স্বয়ংক্রিয়ভাবে ডান থেকে বামে স্লাইড হচ্ছে। মাউস রাখলে থামবে, যেকোনো কার্ডে ক্লিক করে সরাসরি ফিচারটিতে প্রবেশ করুন।'
              : 'Cards automatically slide right to left. Hover to pause, click any card to directly open the feature.'}
          </p>
        </div>

        {/* 3D Coverflow Stage (Reveals from Below into Focus) */}
        <div className="reveal-focus hiw-coverflow-wrapper">
          <div 
            className="coverflow-stage" 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={stopAutoSlide}
            onMouseLeave={() => { if (isAutoSlideActive) startAutoSlide(); }}
          >
            
            {/* ================= CARD 1: Voice & AI Prompt ================= */}
            <div 
              className={`coverflow-card ${getCardPositionClass(0, currentStep, totalSteps)}`} 
              onClick={() => (currentStep === 0 ? setActiveTab('task1') : goToStep(0))}
            >
              <div className="card-top-content">
                <div className="card-header-tag">
                  <span className="card-step-badge font-mono">মেন্যু ০১</span>
                  <span className="card-menu-label font-serif-bn">
                    {language === 'bn' ? 'ভয়েস ও এআই প্রম্পট' : 'Voice & AI Prompt'}
                  </span>
                </div>

                <div className="card-problem-box">
                  <span className="card-problem-title font-serif-bn">
                    ⚠️ {language === 'bn' ? 'কোন সমস্যার জন্য?' : 'For Which Problem?'}
                  </span>
                  <p className="card-problem-text font-serif-bn">
                    {language === 'bn' 
                      ? 'কীটপতঙ্গ, পাতা হলুদ হওয়া বা যে কোনো অজানা রোগ মুখে বলে বা লিখে পরামর্শ নিতে।'
                      : 'Ask questions about pests, yellowing leaves, or unknown symptoms via voice or text.'}
                  </p>
                </div>

                {/* Simulated In-App UI */}
                <div className="mock-ui-box">
                  <div className="mock-ui-header font-mono">
                    <span>AI Prompt Chat</span>
                    <span className="text-emerald-status">● Live Mic</span>
                  </div>
                  <div className="mock-chat-bubble user">
                    <span className="mock-avatar">👨‍🌾</span>
                    <p className="font-serif-bn">
                      {language === 'bn' ? '"ধানের পাতা শুকিয়ে বাদামি চোখা দাগ হচ্ছে, কী স্প্রে করব?"' : '"Brown lesions on paddy leaves, what spray is safe?"'}
                    </p>
                  </div>
                  <div className="mock-chat-bubble bot">
                    <span className="mock-avatar">🌱</span>
                    <div className="mock-bot-text font-serif-bn">
                      <strong>{language === 'bn' ? 'শনাক্ত: ধানের ব্লাস্ট রোগ' : 'Detected: Rice Blast'}</strong>
                      <span>{language === 'bn' ? 'ট্রাইসাইক্লাজোল ৭৫% ০.৭৫ গ্রাম/লিটারে স্প্রে করুন।' : 'Spray Tricyclazole 75% WP @ 0.75g/L.'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-action-bar">
                <div className="card-click-guide">
                  <strong className="font-serif-bn">
                    👆 {language === 'bn' ? 'কোথায় ক্লিক করবেন?' : 'Where to click?'}
                  </strong>
                  <p className="font-serif-bn">
                    {language === 'bn' 
                      ? 'মেন্যু থেকে "এআই প্রম্পট" চাপুন। মাইকে কথা বলুন বা লিখুন।'
                      : 'Click "AI Prompt" in menu. Speak into mic or type your question.'}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-card-launch"
                  onClick={(e) => { e.stopPropagation(); setActiveTab('task1'); }}
                >
                  <span className="font-serif-bn">{language === 'bn' ? 'এখনই ব্যবহার করুন' : 'Launch Feature'}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* ================= CARD 2: Camera Leaf Scanner ================= */}
            <div 
              className={`coverflow-card ${getCardPositionClass(1, currentStep, totalSteps)}`} 
              onClick={() => (currentStep === 1 ? setActiveTab('task2') : goToStep(1))}
            >
              <div className="card-top-content">
                <div className="card-header-tag">
                  <span className="card-step-badge font-mono">মেন্যু ০২</span>
                  <span className="card-menu-label font-serif-bn">
                    {language === 'bn' ? 'পাতার রোগ স্ক্যানার' : 'Leaf Pathology Scanner'}
                  </span>
                </div>

                <div className="card-problem-box">
                  <span className="card-problem-title font-serif-bn">
                    ⚠️ {language === 'bn' ? 'কোন সমস্যার জন্য?' : 'For Which Problem?'}
                  </span>
                  <p className="card-problem-text font-serif-bn">
                    {language === 'bn' 
                      ? 'পাতার দাগ, পোকার ফুটো বা পচনের স্পষ্ট ছবি দিয়ে মুহূর্তেই ৯৮% নির্ভুল ডায়াগনোসিস পেতে।'
                      : 'Scan leaf lesions, holes, or rot with camera for instant 98% accurate pathology.'}
                  </p>
                </div>

                {/* Simulated In-App Viewfinder */}
                <div className="mock-scanner-box">
                  <img 
                    src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80" 
                    alt="Scanner Preview" 
                    className="mock-scanner-img"
                  />
                  <div className="mock-scanner-header font-mono">
                    <span>SCANNER LIVE</span>
                    <span className="mock-badge-accuracy">98% Accuracy</span>
                  </div>
                  <div className="mock-reticle">
                    <span className="font-serif-bn">
                      {language === 'bn' ? 'আক্রান্ত পাতা ফ্রেমে রাখুন' : 'Align Infected Leaf'}
                    </span>
                  </div>
                  <div className="mock-detected-pill font-serif-bn">
                    <span>{language === 'bn' ? 'টমেটো: লিফ কার্ল ভাইরাস' : 'Tomato: Leaf Curl Virus'}</span>
                    <span className="text-emerald-status font-bold">শনাক্ত ✓</span>
                  </div>
                </div>
              </div>

              <div className="card-action-bar">
                <div className="card-click-guide">
                  <strong className="font-serif-bn">
                    👆 {language === 'bn' ? 'কোথায় ক্লিক করবেন?' : 'Where to click?'}
                  </strong>
                  <p className="font-serif-bn">
                    {language === 'bn' 
                      ? '"পাতার রোগ স্ক্যানার" ট্যাবে যান। ক্যামেরা দিয়ে সরাসরি ছবি তুলুন।'
                      : 'Go to "Leaf Scanner". Tap camera button or upload a photo.'}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-card-launch"
                  onClick={(e) => { e.stopPropagation(); setActiveTab('task2'); }}
                >
                  <span className="font-serif-bn">{language === 'bn' ? 'এখনই ব্যবহার করুন' : 'Launch Feature'}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* ================= CARD 3: Weather & Advisory ================= */}
            <div 
              className={`coverflow-card ${getCardPositionClass(2, currentStep, totalSteps)}`} 
              onClick={() => (currentStep === 2 ? setActiveTab('task3') : goToStep(2))}
            >
              <div className="card-top-content">
                <div className="card-header-tag">
                  <span className="card-step-badge font-mono">মেন্যু ০৩</span>
                  <span className="card-menu-label font-serif-bn">
                    {language === 'bn' ? 'আবহাওয়া ও স্প্রে সতর্কতা' : 'Weather & Spray Safety'}
                  </span>
                </div>

                <div className="card-problem-box">
                  <span className="card-problem-title font-serif-bn">
                    ⚠️ {language === 'bn' ? 'কোন সমস্যার জন্য?' : 'For Which Problem?'}
                  </span>
                  <p className="card-problem-text font-serif-bn">
                    {language === 'bn' 
                      ? 'বৃষ্টি, ঝড় বা তীব্র বাতাসে স্প্রে ধুয়ে যাওয়া ও অপচয় বন্ধ করতে সঠিক সময় জানতে।'
                      : 'Prevent pesticide wash-off and chemical waste during rain, heavy fog or high winds.'}
                  </p>
                </div>

                <div className="mock-weather-box">
                  <div className="mock-weather-header font-mono">
                    <span>Bogura Telemetry</span>
                    <span className="text-gold">GPS: 24.84° N</span>
                  </div>
                  <div className="mock-spray-dial">
                    <span className="mock-weather-icon">🌤️</span>
                    <div>
                      <strong className="font-serif-bn text-emerald-status block">
                        {language === 'bn' ? 'আজ স্প্রে করা নিরাপদ (Optimal)' : 'Safe Spray Window (Optimal)'}
                      </strong>
                      <span className="font-serif-bn text-muted-sub">
                        {language === 'bn' ? 'বাতাস: ৭ কিমি/ঘণ্টা • আর্দ্রতা: ৬৫%' : 'Wind: 7 km/h • Humidity: 65%'}
                      </span>
                    </div>
                  </div>
                  <div className="mock-forecast-row font-serif-bn">
                    <div className="mock-forecast-item">আজ: রোদ ☀️</div>
                    <div className="mock-forecast-item">কাল: কুয়াশা 🌫️</div>
                    <div className="mock-forecast-item alert">পরশু: বৃষ্টি 🌧️</div>
                  </div>
                </div>
              </div>

              <div className="card-action-bar">
                <div className="card-click-guide">
                  <strong className="font-serif-bn">
                    👆 {language === 'bn' ? 'কোথায় ক্লিক করবেন?' : 'Where to click?'}
                  </strong>
                  <p className="font-serif-bn">
                    {language === 'bn' 
                      ? '"আবহাওয়া ও স্প্রে" ট্যাবে ক্লিক করুন। লাইভ স্প্রে সেফটি সিগনাল দেখুন।'
                      : 'Click "Weather & Advisory" tab. Check real-time spray safety index.'}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-card-launch"
                  onClick={(e) => { e.stopPropagation(); setActiveTab('task3'); }}
                >
                  <span className="font-serif-bn">{language === 'bn' ? 'এখনই ব্যবহার করুন' : 'Launch Feature'}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* ================= CARD 4: Mandi Market Prices ================= */}
            <div 
              className={`coverflow-card ${getCardPositionClass(3, currentStep, totalSteps)}`} 
              onClick={() => (currentStep === 3 ? setActiveTab('task4') : goToStep(3))}
            >
              <div className="card-top-content">
                <div className="card-header-tag">
                  <span className="card-step-badge font-mono">মেন্যু ০৪</span>
                  <span className="card-menu-label font-serif-bn">
                    {language === 'bn' ? 'পাইকারি বাজার দর' : 'Mandi Market Prices'}
                  </span>
                </div>

                <div className="card-problem-box">
                  <span className="card-problem-title font-serif-bn">
                    ⚠️ {language === 'bn' ? 'কোন সমস্যার জন্য?' : 'For Which Problem?'}
                  </span>
                  <p className="card-problem-text font-serif-bn">
                    {language === 'bn' 
                      ? 'মধ্যস্বত্বভোগীদের ঠকানো রোধ করে স্থানীয় মোকামে ফসলের সর্বোচ্চ পাইকারি দাম জানতে।'
                      : 'Eliminate middlemen and check daily mandi wholesale rates for maximum profit.'}
                  </p>
                </div>

                <div className="mock-price-box">
                  <div className="mock-price-header font-serif-bn">
                    <span>{language === 'bn' ? 'বগুড়া পাইকারি মোকাম' : 'Bogura Wholesale Mandi'}</span>
                    <span className="mock-price-badge font-mono">LIVE ↗</span>
                  </div>
                  <div className="mock-price-highlight">
                    <div>
                      <span className="font-serif-bn text-muted-sub block text-xs">
                        {language === 'bn' ? 'ব্রি-২৮ ধান (প্রতি মণ):' : 'BR-28 Paddy (per maund):'}
                      </span>
                      <strong className="font-mono text-gold text-base">৳ ১,৩২০ - ১,৩৭০</strong>
                    </div>
                    <span className="mock-demand-tag font-serif-bn">
                      {language === 'bn' ? 'চাহিদা বেশি ↑' : 'High Demand ↑'}
                    </span>
                  </div>
                  <p className="mock-price-tip font-serif-bn">
                    {language === 'bn' 
                      ? '💡 পরামর্শ: পাশের মোকামে বিক্রি করলে মণপ্রতি ৫০ টাকা বেশি মুনাফা হবে।'
                      : '💡 Tip: Selling in Shibganj mandi yields 50 BDT/maund higher return.'}
                  </p>
                </div>
              </div>

              <div className="card-action-bar">
                <div className="card-click-guide">
                  <strong className="font-serif-bn">
                    👆 {language === 'bn' ? 'কোথায় ক্লিক করবেন?' : 'Where to click?'}
                  </strong>
                  <p className="font-serif-bn">
                    {language === 'bn' 
                      ? '"বাজার দর" ট্যাবে ক্লিক করে আপনার জেলা ও ফসল নির্বাচন করুন।'
                      : 'Click "Market Prices" tab. Select your district and crop.'}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-card-launch"
                  onClick={(e) => { e.stopPropagation(); setActiveTab('task4'); }}
                >
                  <span className="font-serif-bn">{language === 'bn' ? 'এখনই ব্যবহার করুন' : 'Launch Feature'}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* ================= CARD 5: Fertilizer Calculator ================= */}
            <div 
              className={`coverflow-card ${getCardPositionClass(4, currentStep, totalSteps)}`} 
              onClick={() => (currentStep === 4 ? setActiveTab('fertilizer') : goToStep(4))}
            >
              <div className="card-top-content">
                <div className="card-header-tag">
                  <span className="card-step-badge font-mono">মেন্যু ০৫</span>
                  <span className="card-menu-label font-serif-bn">
                    {language === 'bn' ? 'সার ক্যালকুলেটর' : 'Fertilizer Calculator'}
                  </span>
                </div>

                <div className="card-problem-box">
                  <span className="card-problem-title font-serif-bn">
                    ⚠️ {language === 'bn' ? 'কোন সমস্যার জন্য?' : 'For Which Problem?'}
                  </span>
                  <p className="card-problem-text font-serif-bn">
                    {language === 'bn' 
                      ? 'অতিরিক্ত সার দিয়ে মাটির ক্ষতি ও অর্থ অপচয় না করে জমির মাপ অনুযায়ী সুষম সারের মাত্রা জানতে।'
                      : 'Calculate precise balanced fertilizer dosage per acre to prevent toxic soil acidification.'}
                  </p>
                </div>

                <div className="mock-fertilizer-box">
                  <div className="mock-fert-header font-serif-bn">
                    <span>{language === 'bn' ? 'ধানের জমি: ৩৩ শতাংশ (১ বিঘা)' : 'Paddy Field: 33 Decimals (1 Bigha)'}</span>
                  </div>
                  <div className="mock-fert-grid font-mono">
                    <div className="mock-fert-col">
                      <span className="font-serif-bn">{language === 'bn' ? 'ইউরিয়া' : 'Urea'}</span>
                      <strong>৩৫ কেজি</strong>
                    </div>
                    <div className="mock-fert-col">
                      <span className="font-serif-bn">{language === 'bn' ? 'টিএসপি' : 'TSP'}</span>
                      <strong>১৮ কেজি</strong>
                    </div>
                    <div className="mock-fert-col">
                      <span className="font-serif-bn">{language === 'bn' ? 'এমওপি' : 'MoP'}</span>
                      <strong>২০ কেজি</strong>
                    </div>
                  </div>
                  <div className="mock-fert-note font-serif-bn text-emerald-status">
                    ✓ {language === 'bn' ? 'পরিমিত ইউরিয়া প্রয়োগে ব্লাস্ট রোগ প্রতিরোধ সহজ হয়।' : 'Calibrated Urea helps suppress blast fungus.'}
                  </div>
                </div>
              </div>

              <div className="card-action-bar">
                <div className="card-click-guide">
                  <strong className="font-serif-bn">
                    👆 {language === 'bn' ? 'কোথায় ক্লিক করবেন?' : 'Where to click?'}
                  </strong>
                  <p className="font-serif-bn">
                    {language === 'bn' 
                      ? '"সার ক্যালকুলেটর"-এ গিয়ে জমির শতাংশ লিখে হিসাব বোতাম চাপুন।'
                      : 'Open "Fertilizer Calculator", enter decimals, and tap calculate.'}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-card-launch"
                  onClick={(e) => { e.stopPropagation(); setActiveTab('fertilizer'); }}
                >
                  <span className="font-serif-bn">{language === 'bn' ? 'এখনই ব্যবহার করুন' : 'Launch Feature'}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* ================= CARD 6: Digital Crop Passport ================= */}
            <div 
              className={`coverflow-card ${getCardPositionClass(5, currentStep, totalSteps)}`} 
              onClick={() => (currentStep === 5 ? setActiveTab('task5') : goToStep(5))}
            >
              <div className="card-top-content">
                <div className="card-header-tag">
                  <span className="card-step-badge font-mono">মেন্যু ০৬</span>
                  <span className="card-menu-label font-serif-bn">
                    {language === 'bn' ? 'ডিজিটাল ক্রপ পাসপোর্ট' : 'Digital Crop Passport'}
                  </span>
                </div>

                <div className="card-problem-box">
                  <span className="card-problem-title font-serif-bn">
                    ⚠️ {language === 'bn' ? 'কোন সমস্যার জন্য?' : 'For Which Problem?'}
                  </span>
                  <p className="card-problem-text font-serif-bn">
                    {language === 'bn' 
                      ? 'সব তথ্য এক পাতায় নিয়ে সার্টিফাইড ডিজিটাল পাসপোর্ট ও স্প্রে শিডিউল PDF ডাউনলোড করতে।'
                      : 'Generate official certified crop diagnostic and harvest health passports in PDF.'}
                  </p>
                </div>

                <div className="mock-passport-box">
                  <div className="mock-pass-header font-cinzel">
                    <span>CROP PASSPORT #9842</span>
                    <span className="text-emerald-status font-mono">VERIFIED ✓</span>
                  </div>
                  <div className="mock-pass-body font-serif-bn">
                    <div className="mock-qr-code">
                      <div className="mock-qr-grid">
                        <div className="b" /><div className="b" /><div className="w" />
                        <div className="w" /><div className="b" /><div className="b" />
                        <div className="b" /><div className="w" /><div className="b" />
                      </div>
                    </div>
                    <div className="mock-pass-meta">
                      <strong>{language === 'bn' ? 'ধান — রোগমুক্তির ডিজিটাল সনদ' : 'Paddy — Certified Health Certificate'}</strong>
                      <span>{language === 'bn' ? 'সুরক্ষিত ফলন নিশ্চিত: ৯৬%' : 'Yield Health Index: 96%'}</span>
                      <span className="text-gold">{language === 'bn' ? 'কৃষি অফিসার ভেরিফায়েড' : 'Agri Officer Verified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-action-bar">
                <div className="card-click-guide">
                  <strong className="font-serif-bn">
                    👆 {language === 'bn' ? 'কোথায় ক্লিক করবেন?' : 'Where to click?'}
                  </strong>
                  <p className="font-serif-bn">
                    {language === 'bn' 
                      ? 'ন্যাভবারে "ক্রপ পাসপোর্ট" চাপুন। এক ক্লিকেই PDF ডাউনলোড করুন।'
                      : 'Click "Crop Passport". Download official PDF certificate with 1-click.'}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-card-launch"
                  onClick={(e) => { e.stopPropagation(); setActiveTab('task5'); }}
                >
                  <span className="font-serif-bn">{language === 'bn' ? 'এখনই ব্যবহার করুন' : 'Launch Feature'}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Active Step Detail Caption Underneath Stage */}
        <div className="reveal-focus hiw-caption-box font-serif-bn">
          <span className="hiw-caption-number font-mono">
            {language === 'bn' ? stepDescriptions[currentStep].stepBn : stepDescriptions[currentStep].stepEn} :
          </span>
          <span className="hiw-caption-text">
            {language === 'bn' ? stepDescriptions[currentStep].textBn : stepDescriptions[currentStep].textEn}
          </span>
        </div>

      </div>
    </section>
  );
}

// Helper function to calculate 3D Coverflow positioning classes
function getCardPositionClass(cardIndex, currentStep, totalSteps) {
  const diff = (cardIndex - currentStep + totalSteps) % totalSteps;
  let relativePos = diff;
  if (diff > totalSteps / 2) {
    relativePos = diff - totalSteps;
  }

  if (relativePos === 0) return 'is-active';
  if (relativePos === -1) return 'pos-left-1';
  if (relativePos === -2) return 'pos-left-2';
  if (relativePos === 1) return 'pos-right-1';
  if (relativePos === 2) return 'pos-right-2';
  return 'pos-hidden';
}
