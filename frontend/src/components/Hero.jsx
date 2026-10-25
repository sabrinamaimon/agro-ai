import React, { useState, useEffect } from 'react';
import { Camera, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import onkurCalligraphy from '../assets/onkur-calligraphy-gold.png';

export default function Hero({ language, setActiveTab }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const cropsData = [
    {
      nameBn: 'ধান (Rice)',
      nameEn: 'Rice',
      seasonBn: 'বোরো ধান মৌসুম',
      seasonEn: 'Boro Rice Season',
      diseaseBn: 'ব্লাস্ট ও মাজরা পোকা প্রতিরোধ',
      diseaseEn: 'Blast & Stem Borer Prevention',
      accuracyBn: '৯৮% একুরেট',
      accuracyEn: '98% Accurate',
      bgImg: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2200&q=85',
      headlineBn: 'মাটি থেকে মুঠোয়,<br /><span class="italic text-champagne">ফসলের বিশ্বস্ত অঙ্কুর।</span>',
      headlineEn: 'From Living Soil to Hand,<br /><span class="italic text-champagne">The Trusted Sprout.</span>',
      sublineBn: 'পদ্মা-যমুনার উর্বর পলিমাটির ঐতিহ্য আর আধুনিক কৃত্রিম বুদ্ধিমত্তার নিখুঁত সুরক্ষায় প্রতিটি শস্যের সুস্থ ফলন নিশ্চিতকরণ।',
      sublineEn: 'Empowering farmers with AI plant pathology, real-time climate telemetry, and certified harvest security across the Bengal delta.',
      scanBtnBn: 'ধানের রোগ স্ক্যান',
      scanBtnEn: 'Scan Rice Pathology'
    },
    {
      nameBn: 'আলু (Potato)',
      nameEn: 'Potato',
      seasonBn: 'রবি আলু চাষাবাদ',
      seasonEn: 'Rabi Potato Harvest',
      diseaseBn: 'লেইট ব্লাইট ও দাদ রোগ স্ক্যান',
      diseaseEn: 'Late Blight & Scab Detection',
      accuracyBn: '৯৬% একুরেট',
      accuracyEn: '96% Accurate',
      bgImg: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=2200&q=85',
      headlineBn: 'কুয়াশায় আলুর ব্লাইট রোধে,<br /><span class="italic text-champagne">আধুনিক প্যাথোলজি ভিশন।</span>',
      headlineEn: 'Combating Potato Blight,<br /><span class="italic text-champagne">With Modern Pathology AI.</span>',
      sublineBn: 'কুয়াশায় আলু গাছের আগাম ও নাবি ধসা রোগ প্রাথমিক পর্যায়ে শনাক্ত করে ছত্রাকনাশকের সঠিক মাত্রা নির্ধারণ।',
      sublineEn: 'Detect early and late blight in potato canopies during dense winter fog with precise fungicide guidance.',
      scanBtnBn: 'আলুর রোগ স্ক্যান',
      scanBtnEn: 'Scan Potato Pathology'
    },
    {
      nameBn: 'টমেটো (Tomato)',
      nameEn: 'Tomato',
      seasonBn: 'শীতকালীন সবজি সুরক্ষা',
      seasonEn: 'Winter Vegetable Shield',
      diseaseBn: 'লিফ কার্ল ভাইরাস ও আর্লি ব্লাইট',
      diseaseEn: 'Leaf Curl Virus & Early Blight',
      accuracyBn: '৯৫% একুরেট',
      accuracyEn: '95% Accurate',
      bgImg: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=2200&q=85',
      headlineBn: 'টমেটোর পাতা কোঁকড়ানো রোধে,<br /><span class="italic text-champagne">সঠিক সময়ে জৈব সুরক্ষা।</span>',
      headlineEn: 'Guarding Vegetable Crops,<br /><span class="italic text-champagne">Timely Organic Defense.</span>',
      sublineBn: 'সাদা মাছি বাহিত ভাইরাস আক্রমণ থেকে বাঁচতে মাঠ পর্যায়ের বাস্তবসম্মত সুরক্ষা ও পুষ্টি ব্যবস্থাপনা।',
      sublineEn: 'Protect high-value vegetable yields against whitefly-borne viral leaf curl and nutrient stress.',
      scanBtnBn: 'টমেটোর রোগ স্ক্যান',
      scanBtnEn: 'Scan Tomato Pathology'
    },
    {
      nameBn: 'গম (Wheat)',
      nameEn: 'Wheat',
      seasonBn: 'রবি গম উৎপাদন',
      seasonEn: 'Rabi Wheat Production',
      diseaseBn: 'পাতার মরিচা ও পাতা ঝলসানো',
      diseaseEn: 'Wheat Rust & Leaf Blight',
      accuracyBn: '৯৪% একুরেট',
      accuracyEn: '94% Accurate',
      bgImg: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=2200&q=85',
      headlineBn: 'সোনার গমের শিষ,<br /><span class="italic text-champagne">সার্বভৌম খাদ্য নিরাপত্তা।</span>',
      headlineEn: 'Golden Grain Canopies,<br /><span class="italic text-champagne">Sovereign Food Security.</span>',
      sublineBn: 'মাটির আর্দ্রতা ও তাপমাত্রা বিশ্লেষণ করে গমের ছত্রাকজনিত মরিচা রোগ প্রতিরোধ ও সর্বোচ্চ ফলন বৃদ্ধি।',
      sublineEn: 'Analyze soil moisture and ambient humidity to prevent fungal wheat rust and maximize grain yield.',
      scanBtnBn: 'গমের রোগ স্ক্যান',
      scanBtnEn: 'Scan Wheat Pathology'
    },
    {
      nameBn: 'ভুট্টা (Maize)',
      nameEn: 'Maize',
      seasonBn: 'উচ্চফলনশীল ভুট্টা বলয়',
      seasonEn: 'High-Yield Maize Belt',
      diseaseBn: 'ফল আর্মিওয়ার্ম ও কাণ্ড পচা',
      diseaseEn: 'Fall Armyworm & Stalk Rot',
      accuracyBn: '৯৩% একুরেট',
      accuracyEn: '93% Accurate',
      bgImg: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=2200&q=85',
      headlineBn: 'ভুট্টার উচ্চ ফলন ও মান সুরক্ষায়,<br /><span class="italic text-champagne">বুদ্ধিমান রোগ নির্ণয় ল্যাব।</span>',
      headlineEn: 'Securing Maize Fields,<br /><span class="italic text-champagne">Intelligent Plant Pathology.</span>',
      sublineBn: 'বিধ্বংসী ফল আর্মিওয়ার্মের লার্ভা আক্রমণ থেকে শুরু করে শিকড় পচন রোধে বৈজ্ঞানিক স্প্রে গাইডেন্স।',
      sublineEn: 'Actionable spray timing against devastating Fall Armyworm larvae and collar rot pathogens.',
      scanBtnBn: 'ভুট্টার রোগ স্ক্যান',
      scanBtnEn: 'Scan Maize Pathology'
    }
  ];

  const totalSlides = cropsData.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [totalSlides]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeCrop = cropsData[currentSlide];

  return (
    <div className="onkur-fullscreen-hero">
      {/* Fullscreen Sliding Track */}
      <div 
        className="hero-slide-track"
        style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
      >
        {cropsData.map((crop, idx) => (
          <div 
            key={idx} 
            className={`hero-slide-pane ${idx === currentSlide ? 'active' : ''}`}
          >
            <img 
              src={crop.bgImg} 
              alt={crop.nameEn} 
              className="hero-slide-img" 
            />
            {/* Cinematic Gradient Overlays */}
            <div className="hero-slide-overlay-top" />
            <div className="hero-slide-overlay-left" />
            <div className="hero-slide-overlay-bottom" />
          </div>
        ))}
      </div>

      

      {/* Main Spacious Hero Stage */}
      <div className="hero-stage-content">
        <div className="hero-stage-left">
          {/* Grand Handcrafted Calligraphy */}
          <div className="hero-calligraphy-wrap">
            <img 
              src={onkurCalligraphy} 
              alt="অঙ্কুর ক্যালিগ্রাফি" 
              className="hero-calligraphy-img" 
            />
          </div>

          {/* Dynamic Headline */}
          <div className="hero-headline-block">
            <h1 
              className="hero-main-title font-serif-bn"
              dangerouslySetInnerHTML={{ __html: language === 'bn' ? activeCrop.headlineBn : activeCrop.headlineEn }}
            />
            <p className="hero-main-desc font-serif-bn">
              {language === 'bn' ? activeCrop.sublineBn : activeCrop.sublineEn}
            </p>
          </div>

          {/* Action Capsule */}
          <div className="hero-action-buttons">
            <button 
              type="button" 
              className="btn-hero-primary"
              onClick={() => setActiveTab('task2')}
            >
              <Camera size={16} />
              <span>{language === 'bn' ? activeCrop.scanBtnBn : activeCrop.scanBtnEn}</span>
            </button>

            <button 
              type="button" 
              className="btn-hero-secondary"
              onClick={() => setActiveTab('task5')}
            >
              <FileText size={15} />
              <span>{language === 'bn' ? 'ডিজিটাল ক্রপ পাসপোর্ট ↗' : 'Digital Crop Passport ↗'}</span>
            </button>
          </div>
        </div>

        {/* Right Corner: Architectural Crop Focus Stamp & Controls */}
        <div className="hero-stage-right-stamp">
          <div className="corner-crop-chip">
            <div className="corner-crop-title font-serif-bn">
              {language === 'bn' ? activeCrop.nameBn : activeCrop.nameEn} • {language === 'bn' ? activeCrop.accuracyBn : activeCrop.accuracyEn}
            </div>
            <div className="corner-crop-pathology">
              {language === 'bn' ? activeCrop.diseaseBn : activeCrop.diseaseEn}
            </div>
          </div>

          {/* Floating Slide Navigation Controls */}
          <div className="hero-crop-nav-row">
            <button 
              type="button" 
              onClick={prevSlide} 
              className="btn-crop-slide" 
              aria-label="Previous Crop"
              title={language === 'bn' ? 'পূর্ববর্তী ফসল' : 'Previous Crop'}
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="hero-crop-dots">
              {cropsData.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`crop-nav-dot ${idx === currentSlide ? 'active' : ''}`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <button 
              type="button" 
              onClick={nextSlide} 
              className="btn-crop-slide" 
              aria-label="Next Crop"
              title={language === 'bn' ? 'পরবর্তী ফসল' : 'Next Crop'}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

