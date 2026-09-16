import React from 'react';
import { Sprout, Mic, Camera, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Hero({ language, setActiveTab }) {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <Sprout size={16} color="#059669" />
          <span>{language === 'bn' ? 'স্মার্ট এআই কৃষি সহকারী' : 'Smart AI Agricultural Assistant'}</span>
        </div>

        <h1 className="hero-title">
          {language === 'bn' ? (
            <>কৃষকের বিশ্বস্ত বন্ধু <span className="text-green">Agro-AI</span></>
          ) : (
            <>Empowering Farmers with <span className="text-green">Agro-AI</span></>
          )}
        </h1>

        <p className="hero-subtitle">
          {language === 'bn'
            ? 'বাংলা ভয়েস নির্দেশনায় শস্যের রোগ নির্ণয়, আবহাওয়ার আগাম সতর্কবার্তা, আর সঠিক বাজার দর জানুন মুহূর্তেই।'
            : 'Instant crop disease diagnosis, climate-resilient farming advice, and fair market price insights tailored for Bangladesh.'}
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => setActiveTab('task2')}>
            <Camera size={20} />
            <span>{language === 'bn' ? 'রোগ নির্ণয় করুন (Scan Leaf)' : 'Diagnose Crop Leaf'}</span>
            <ArrowRight size={18} />
          </button>

          <button className="btn btn-outline btn-lg" onClick={() => setActiveTab('task1')}>
            <Mic size={20} />
            <span>{language === 'bn' ? 'মুখে বলুন (Voice Input)' : 'Voice Dictation'}</span>
          </button>
        </div>

        <div className="hero-features">
          <div className="feature-item">
            <Mic size={20} className="feature-icon" />
            <div>
              <h4>{language === 'bn' ? 'বাংলা ভয়েস ইনপুট' : 'Voice Dictation'}</h4>
              <p>{language === 'bn' ? 'মুখে বললেই তথ্য গ্রহণ' : 'Bengali Speech-to-Text'}</p>
            </div>
          </div>

          <div className="feature-item">
            <Camera size={20} className="feature-icon" />
            <div>
              <h4>{language === 'bn' ? 'কম্পিউটার ভিশন' : 'AI Leaf Scanner'}</h4>
              <p>{language === 'bn' ? 'মুহূর্তে রোগ ও ক্ষতির মাত্রা' : 'Pathogen & Severity %'}</p>
            </div>
          </div>

          <div className="feature-item">
            <TrendingUp size={20} className="feature-icon" />
            <div>
              <h4>{language === 'bn' ? 'বাজার দর যাচাই' : 'Market Price Check'}</h4>
              <p>{language === 'bn' ? 'ফড়িয়া দাম ও বিক্রির উইন্ডো' : 'Undercut Price Alerts'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
