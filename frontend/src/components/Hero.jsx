import React from 'react';
import { Sprout, Mic, Camera, TrendingUp, ShieldCheck, ArrowRight, Sun, CloudRain, Award, Activity } from 'lucide-react';
import farmerImg from '../assets/farmer.png';

export default function Hero({ language, setActiveTab }) {
  const cropsList = [
    { nameBn: 'আলু (Potato)', nameEn: 'Potato', disease: 'Late Blight', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', tagBn: '৯৬% নির্ভুল', tagEn: '96% Accurate' },
    { nameBn: 'ধান (Rice)', nameEn: 'Rice', disease: 'Rice Blast', img: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80', tagBn: '৯৮% নির্ভুল', tagEn: '98% Accurate' },
    { nameBn: 'টমেটো (Tomato)', nameEn: 'Tomato', disease: 'Leaf Curl Virus', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80', tagBn: '৯৫% নির্ভুল', tagEn: '95% Accurate' },
    { nameBn: 'গম (Wheat)', nameEn: 'Wheat', disease: 'Wheat Rust', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80', tagBn: '৯৪% নির্ভুল', tagEn: '94% Accurate' },
    { nameBn: 'ভুট্টা (Maize)', nameEn: 'Maize', disease: 'Leaf Blight', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80', tagBn: '৯৩% নির্ভুল', tagEn: '93% Accurate' }
  ];

  return (
    <div className="home-hub">
      {/* Main Hero Banner */}
      <div className="hero-section">
        <div className="hero-content text-left">
          <div className="hero-badge">
            <Sprout size={16} color="#059669" />
            <span>{language === 'bn' ? 'স্মার্ট এআই কৃষি সহকারী' : 'AI-Driven Smart Agriculture Platform'}</span>
          </div>

          <h1 className="hero-title">
            {language === 'bn' ? (
              <>কৃষকের বিশ্বস্ত বন্ধু<br /><span className="text-green">Agro-AI</span></>
            ) : (
              <>Empowering Agriculture with <span className="text-green">Agro-AI</span></>
            )}
          </h1>

          <p className="hero-subtitle">
            {language === 'bn'
              ? 'কৃষি কর্মকর্তা ও প্রান্তিক কৃষকদের জন্য এআই চালিত রোগ নির্ণয়, জলবায়ু পূর্বাভাস এবং শস্যের ন্যায্য বাজার দর সেবা।'
              : 'Empowering smallholder farmers and extension officers with instant AI plant diagnostics, climate resilience, and market price intelligence.'}
          </p>
        </div>

        <div className="hero-image-container">
          <img 
            src={farmerImg} 
            alt="Bangladeshi Farmer Smiling" 
            className="happy-farmer-img"
          />
        </div>
      </div>

      {/* Impact & Agriculture Statistics Bar */}
      <div className="stats-bar grid-4 mt-4">
        <div className="stat-card">
          <div className="stat-icon emerald"><Sprout size={24} /></div>
          <div>
            <h3>{language === 'bn' ? '৪০%+' : '40%+'}</h3>
            <p>{language === 'bn' ? 'জাতীয় শ্রমশক্তি কৃষি নির্ভর' : 'National Workforce in Farming'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber"><Activity size={24} /></div>
          <div>
            <h3>{language === 'bn' ? '৩০%' : '30%'}</h3>
            <p>{language === 'bn' ? 'ফসল অপচয় রোধ' : 'Yield Loss Prevention'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue"><CloudRain size={24} /></div>
          <div>
            <h3>{language === 'bn' ? '২৪/৭' : '24/7'}</h3>
            <p>{language === 'bn' ? 'জলবায়ু ভিত্তিক স্প্রে অ্যালার্ট' : 'Climate Spray Advisory'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><Award size={24} /></div>
          <div>
            <h3>{language === 'bn' ? '১০০%' : '100%'}</h3>
            <p>{language === 'bn' ? 'ফ্রি ডিজিটাল পাসপোর্টিং' : 'Free Digital Field Passports'}</p>
          </div>
        </div>
      </div>

      {/* Supported Crops Showcase */}
      <div className="card mt-4">
        <div className="card-header">
          <Sprout color="#059669" size={24} />
          <h2>{language === 'bn' ? 'সমর্থিত প্রধান শস্যসমূহ (Supported Crops)' : 'Supported Crops & Common Pathology'}</h2>
        </div>

        <p className="card-desc">
          {language === 'bn'
            ? 'আমাদের এআই ভিশন মডেল বাংলাদেশের প্রধান প্রধান শস্যের রোগ নিখুঁতভাবে শনাক্ত করতে পারে।'
            : 'Our Computer Vision AI recognizes pathogen damage across major Bangladeshi field crops.'}
        </p>

        <div className="crops-grid">
          {cropsList.map((crop, idx) => (
            <div 
              className="crop-card interactive-card" 
              key={idx}
              onClick={() => setActiveTab('task2')}
              title={language === 'bn' ? `${crop.nameBn} রোগ স্ক্যান করতে ক্লিক করুন` : `Click to scan ${crop.nameEn}`}
              style={{ cursor: 'pointer' }}
            >
              <div className="crop-img-wrap">
                <img 
                  src={crop.img} 
                  alt={crop.nameEn} 
                  className="crop-img" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <span className="crop-accuracy-badge">{language === 'bn' ? crop.tagBn : crop.tagEn}</span>
              </div>
              <div className="crop-info">
                <h4>{language === 'bn' ? crop.nameBn : crop.nameEn}</h4>
                <span className="text-xs text-muted">Pathology: {crop.disease}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
