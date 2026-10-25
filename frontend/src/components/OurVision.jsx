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
      {/* Standalone Section Header above the whole card (no box) */}
      <div className="reveal-focus our-vision-section-header">
        <h3 className="our-vision-standalone-title font-cinzel">
          OUR VISION & MISSION
        </h3>
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

