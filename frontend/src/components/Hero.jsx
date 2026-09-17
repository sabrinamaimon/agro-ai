import React from 'react';
import { Sprout, Mic, Camera, TrendingUp, ShieldCheck, ArrowRight, Sun, CloudRain, Award, Activity, Sparkles } from 'lucide-react';
import farmerImg from '../assets/farmer.png';

export default function Hero({ language, setActiveTab, onLoadDemo }) {
  const cropsList = [
    { nameBn: 'আলু (Potato)', nameEn: 'Potato', disease: 'Late Blight', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
    { nameBn: 'ধান (Rice)', nameEn: 'Rice', disease: 'Rice Blast', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { nameBn: 'টমেটো (Tomato)', nameEn: 'Tomato', disease: 'Leaf Curl Virus', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80' },
    { nameBn: 'গম (Wheat)', nameEn: 'Wheat', disease: 'Wheat Rust', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' }
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

      {/* Quick Judge Demo Tour Banner */}
      <div className="card judge-demo-banner" style={{
        background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
        border: '1.5px solid #A7F3D0',
        borderRadius: '16px',
        padding: '1.1rem 1.4rem',
        marginTop: '1.25rem',
        boxShadow: '0 4px 16px rgba(5, 150, 105, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '0.55rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.08rem', color: '#065F46', fontWeight: 700 }}>
                {language === 'bn' ? '⚡ ১-ক্লিকে সম্পূর্ণ হ্যাকাথন ডেমো (One-Click Judge Demo)' : '⚡ One-Click End-to-End Judge Demo'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#047857' }}>
                {language === 'bn' 
                  ? 'একটি ক্লিকেই ৫টি টাস্কের সমন্বিত ফলাফল ও ভেরিফাইড ডিজিটাল ক্রপ পাসপোর্ট দেখতে সিনারিও বেছে নিন:'
                  : 'Instantly simulate all 5 integrated tasks and inspect verified digital crop passport:'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => onLoadDemo && onLoadDemo('rice')}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                borderRadius: '10px',
                padding: '0.6rem 1.15rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 3px 10px rgba(5, 150, 105, 0.25)',
                fontSize: '0.92rem'
              }}
            >
              <span>🌾 {language === 'bn' ? 'ধানের ব্লাস্ট রোগ ডেমো' : 'Rice Blast Demo'}</span>
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              className="btn btn-sm"
              onClick={() => onLoadDemo && onLoadDemo('potato')}
              style={{
                background: '#FFFFFF',
                color: '#065F46',
                border: '1.5px solid #A7F3D0',
                fontWeight: 600,
                borderRadius: '10px',
                padding: '0.6rem 1.15rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.92rem',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
              }}
            >
              <span>🥔 {language === 'bn' ? 'আলুর নাবি ধসা ডেমো' : 'Potato Blight Demo'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Impact & Agriculture Statistics Bar */}
      <div className="stats-bar grid-4 mt-4">
        <div className="stat-card">
          <div className="stat-icon emerald"><Sprout size={24} /></div>
          <div>
            <h3>৪০%+</h3>
            <p>{language === 'bn' ? 'জাতীয় শ্রমশক্তি কৃষি নির্ভর' : 'National Workforce in Farming'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber"><Activity size={24} /></div>
          <div>
            <h3>৩০%</h3>
            <p>{language === 'bn' ? 'ফসল অপচয় রোধ' : 'Yield Loss Prevention'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue"><CloudRain size={24} /></div>
          <div>
            <h3>২৪/৭</h3>
            <p>{language === 'bn' ? 'জলবায়ু ভিত্তিক স্প্রে অ্যালার্ট' : 'Climate Spray Advisory'}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><Award size={24} /></div>
          <div>
            <h3>১০০%</h3>
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
            <div className="crop-card" key={idx}>
              <img 
                src={crop.img} 
                alt={crop.nameEn} 
                className="crop-img" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80';
                }}
              />
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
