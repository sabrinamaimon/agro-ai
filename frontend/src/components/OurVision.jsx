import React, { useEffect, useRef } from 'react';
import farmerVisionImg from '../assets/farmer-vision.jpg';

export default function OurVision({ language = 'bn' }) {
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
      id="our-vision" 
      ref={sectionRef} 
      className="our-vision-section"
    >
      <div className="reveal-focus our-vision-card glass-card">
        <div className="our-vision-grid">
          
          {/* Left Side: Rural Bangladesh Landscape with Cheerful Farmer */}
          <div className="our-vision-visual-col group">
            <img 
              src={farmerVisionImg} 
              alt="বাংলার কৃষক ও গ্রামীণ ফসলের মাঠ" 
              className="our-vision-img"
            />
            
            {/* Cinematic Vignettes */}
            <div className="our-vision-vignette-bottom" />
            <div className="our-vision-vignette-side" />

            {/* Bottom Floating Badge on Photo */}
            <div className="our-vision-floating-pill">
              <div className="floating-pill-header font-cinzel">
                <span>BENGAL GRASSROOTS EMPOWERMENT</span>
                <span className="live-ping-dot" />
              </div>
              <p className="floating-pill-caption font-serif-bn">
                {language === 'bn' 
                  ? 'সোনালী ধানের চারা হাতে গর্বিত বাংলার কৃষক — প্রযুক্তি ও মাটির মেলবন্ধনে রচিত হচ্ছে সার্বভৌম কৃষি বিপ্লব।'
                  : 'Empowering Bengal growers with AI diagnostics, certified harvest security, and sustainable agronomy.'}
              </p>
            </div>
          </div>

          {/* Right Side: Manifesto & 3 Pillars */}
          <div className="our-vision-text-col">
            <div className="vision-header-badge font-cinzel">
              OUR VISION & MISSION
            </div>

            <h2 className="vision-quote font-serif-bn">
              {language === 'bn' 
                ? '"কৃষকের ঘামে ভেজা ফসলের প্রতিটি দানা হোক সুরক্ষিত — এআই প্রযুক্তির নির্ভুল পাহারায়।"'
                : '"Every single grain nourished by the farmer\'s toil must thrive — guided by sovereign precision intelligence."'}
            </h2>

            <p className="vision-desc font-serif-bn">
              {language === 'bn' 
                ? 'অঙ্কুর (Onkur) কোনো সাধারণ সফটওয়্যার নয়—এটি বাংলার তৃণমূল কৃষকের জন্য একটি সার্বভৌম ডিজিটাল কৃষিদূত। আমাদের উদ্দেশ্য অতিরিক্ত রাসায়নিক সার ও কীটনাশকের অপব্যবহার রোধ করা এবং মাঠের অপচয় কমিয়ে কৃষকের ঘরে সর্বোচ্চ আর্থিক মুনাফা নিশ্চিত করা।'
                : 'Onkur is not just software; it is a sovereign digital extension companion for Bengal\'s grassroots growers. Our mission is to prevent toxic pesticide overuse, protect soil ecology, and ensure maximum financial returns for farming families.'}
            </p>

            {/* 3 Pillars Grid */}
            <div className="vision-pillars-grid">
              
              <div className="vision-pillar-item">
                <span className="pillar-icon">🌾</span>
                <h4 className="pillar-title font-serif-bn">
                  {language === 'bn' ? 'খাদ্য নিরাপত্তা' : 'Food Security'}
                </h4>
                <p className="pillar-text font-serif-bn">
                  {language === 'bn' ? 'ফসলের অপচয় রোধ ও সর্বোচ্চ ফলন বৃদ্ধি' : 'Prevent yield loss & boost crop resilience'}
                </p>
              </div>

              <div className="vision-pillar-item">
                <span className="pillar-icon">🧪</span>
                <h4 className="pillar-title font-serif-bn">
                  {language === 'bn' ? 'বিষমুক্ত চাষাবাদ' : 'Safe Agriculture'}
                </h4>
                <p className="pillar-text font-serif-bn">
                  {language === 'bn' ? 'পরিমিত ও নিরাপদ স্প্রে গাইডেন্স' : 'Precision spray & organic soil stewardship'}
                </p>
              </div>

              <div className="vision-pillar-item">
                <span className="pillar-icon">⚖️</span>
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
