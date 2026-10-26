import React, { useEffect, useRef } from 'react';
import farmerVisionImg from '../assets/farmer-vision.jpg';

export default function OurVision({ language = 'bn' }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-focus');
        } else if (entry.boundingClientRect.top > window.innerHeight * 0.75) {
          entry.target.classList.remove('in-focus');
        }
      });
    }, { 
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px' 
    });

    const elements = sectionRef.current?.querySelectorAll('.reveal-focus');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="our-vision" 
      ref={sectionRef} 
      className="our-vision-section"
    >
      {/* Grand Typographic Vision Centerpiece (Inspired by Bengali Literary Poster Art) */}
      <div className="reveal-focus our-vision-section-header">
        <div className="vision-artistic-header-wrap">
          {/* Luminous Golden Sun Backdrop with Silhouette Birds */}
          <div className="vision-sun-backdrop" aria-hidden="true">
            <div className="vision-sun-disk" />
            <svg 
              className="vision-birds-svg" 
              viewBox="0 0 180 130" 
              fill="currentColor"
            >
              {/* Bird 1: Top right soaring high */}
              <path d="M140 18 C150 11, 158 15, 164 13 C159 18, 154 23, 152 30 C149 25, 145 22, 140 18 Z M152 30 C157 28, 162 26, 167 22 C162 27, 157 32, 153 37 C152 34, 152 32, 152 30 Z" />
              {/* Bird 2: Center right */}
              <path d="M118 38 C127 32, 134 36, 139 34 C136 39, 131 43, 129 49 C126 45, 122 42, 118 38 Z M129 49 C133 48, 137 46, 141 43 C137 47, 133 51, 130 55 C129 53, 129 51, 129 49 Z" />
              {/* Bird 3: Middle rising */}
              <path d="M96 56 C103 51, 109 54, 113 52 C111 56, 107 59, 105 64 C103 61, 99 59, 96 56 Z" />
              {/* Bird 4: Smaller distant */}
              <path d="M115 72 C120 68, 124 70, 127 69 C125 72, 122 75, 120 78 C119 76, 117 74, 115 72 Z" />
            </svg>
          </div>

          {/* Large Expressive Typography */}
          <h2 className={`our-vision-standalone-title ${language === 'bn' ? 'our-vision-title-bn font-artistic-bn' : 'font-cinzel'}`}>
            {language === 'bn' ? (
              <span className="vision-calligraphy-title">
                <span className="vision-calligraphy-word">আমাদের</span>
                <span className="vision-calligraphy-word">ভিশন</span>
              </span>
            ) : (
              <span className="vision-calligraphy-title en">OUR VISION</span>
            )}
          </h2>
        </div>
        
        <p className="vision-tagline font-serif-bn">
          {language === 'bn' 
            ? 'মাটি ও মানুষের সার্বভৌম মেলবন্ধনে সমৃদ্ধ ভবিষ্যৎ' 
            : 'Sovereign Agricultural Intelligence for Soil and Delta Farmers'}
        </p>
        <div className="our-vision-title-accent" />
      </div>

      <div className="reveal-focus our-vision-card glass-card">
        <div className="our-vision-grid">
          
          {/* Left Side: Rural Bangladesh Landscape with Cheerful Farmer */}
          <div className="our-vision-visual-col group">
            <img 
              src={farmerVisionImg} 
              alt="বাংলার কৃষক ও গ্রামীণ ফসলের মাঠ" 
              className="our-vision-img"
            />
            <div className="our-vision-vignette-side" />
          </div>

          {/* Right Side: Manifesto & 3 Pillars */}
          <div className="our-vision-text-col">
            <h2 className="vision-quote font-serif-bn">
              {language === 'bn' 
                ? '"কৃষকের স্বপ্নেই অঙ্কুরিত হোক আগামীর সমৃদ্ধি।"'
                : '“Let tomorrow’s prosperity take root in the dreams of farmers.”'}
            </h2>

            <div className="vision-manifesto font-serif-bn">
              <p className="vision-p">
                {language === 'bn'
                  ? 'অঙ্কুর (Onkur) কেবল একটি ডিজিটাল প্ল্যাটফর্ম নয়—এটি বাংলাদেশের কৃষিকে আরও বুদ্ধিদীপ্ত, আধুনিক ও টেকসই করে তোলার একটি উদ্যোগ।'
                  : 'Onkur is more than a digital platform—it is an initiative to make agriculture in Bangladesh smarter, more modern, and more sustainable.'}
              </p>

              <p className="vision-p">
                {language === 'bn'
                  ? 'আমাদের লক্ষ্য কৃষকের হাতে সঠিক সময়ে সঠিক তথ্য পৌঁছে দেওয়া, যাতে তিনি আবহাওয়া, ফসলের রোগবালাই, মাটির অবস্থা ও বাজারদর সম্পর্কে জেনে আরও আত্মবিশ্বাসের সঙ্গে সিদ্ধান্ত নিতে পারেন।'
                  : 'Our mission is to put the right information into farmers’ hands at the right time, empowering them to make informed and confident decisions based on weather conditions, crop diseases, soil health, and market prices.'}
              </p>

              <p className="vision-p">
                {language === 'bn'
                  ? 'কৃত্রিম বুদ্ধিমত্তা ও তথ্যপ্রযুক্তির সহায়তায় আমরা চাই কৃষক আগেভাগেই সম্ভাব্য ঝুঁকি বুঝতে পারবেন, ফসলের ক্ষতি কমাতে পারবেন এবং সার, কীটনাশক ও অন্যান্য সম্পদের যথাযথ ব্যবহার নিশ্চিত করতে পারবেন।'
                  : 'Through artificial intelligence and information technology, we aim to help farmers anticipate potential risks, minimize crop losses, and ensure the responsible use of fertilizers, pesticides, and other agricultural resources.'}
              </p>

              <p className="vision-p">
                {language === 'bn'
                  ? 'আমরা বিশ্বাস করি, কৃষকের জ্ঞান ও অভিজ্ঞতার সঙ্গে আধুনিক প্রযুক্তির সমন্বয়ই গড়ে তুলতে পারে আগামীর সম্ভাবনাময় কৃষি।'
                  : 'We believe that combining farmers’ knowledge and experience with modern technology can unlock the full potential of agriculture and shape a more promising future.'}
              </p>

              <div className="vision-dream-callout">
                <p className="vision-dream-text">
                  {language === 'bn' ? (
                    <>
                      <strong>আমাদের স্বপ্ন—</strong>একটি বাংলাদেশ, যেখানে প্রযুক্তির ছোঁয়ায় কৃষি হবে আরও লাভজনক, প্রকৃতি হবে আরও সুরক্ষিত এবং কৃষকের ভবিষ্যৎ হবে আরও সমৃদ্ধ।
                    </>
                  ) : (
                    <>
                      <strong>Our vision is a Bangladesh where technology makes farming more profitable, protects our natural environment, and creates a more prosperous future for every farmer.</strong>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* 3 Pillars Grid */}
            <div className="vision-pillars-grid">
              
              <div className="vision-pillar-item">
                <h4 className="pillar-title font-serif-bn">
                  {language === 'bn' ? 'খাদ্য নিরাপত্তা' : 'Food Security'}
                </h4>
                <p className="pillar-text font-serif-bn">
                  {language === 'bn' ? 'ফসলের অপচয় রোধ ও সর্বোচ্চ ফলন বৃদ্ধি' : 'Prevent yield loss & boost crop resilience'}
                </p>
              </div>

              <div className="vision-pillar-item">
                <h4 className="pillar-title font-serif-bn">
                  {language === 'bn' ? 'বিষমুক্ত চাষাবাদ' : 'Safe Agriculture'}
                </h4>
                <p className="pillar-text font-serif-bn">
                  {language === 'bn' ? 'পরিমিত ও নিরাপদ স্প্রে গাইডেন্স' : 'Precision spray & organic soil stewardship'}
                </p>
              </div>

              <div className="vision-pillar-item">
                <h4 className="pillar-title font-serif-bn">
                  {language === 'bn' ? 'ন্যায্য বাজারমূল্য' : 'Fair Market Return'}
                </h4>
                <p className="pillar-text font-serif-bn">
                  {language === 'bn' ? 'মধ্যস্বত্বভোগী ছাড়া রিয়েল-টাইম তথ্য' : 'Direct wholesale mandi telemetry without middlemen'}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

