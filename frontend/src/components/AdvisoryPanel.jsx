import React from 'react';
import { CloudRain, Thermometer, Droplets, Leaf, FlaskConical, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdvisoryPanel({ language, diagnosis, weather }) {
  if (!diagnosis) {
    return (
      <div className="card task-card placeholder-card">
        <h3>{language === 'bn' ? 'মাল্টিমোডাল এগ্রোনোমিক ইঞ্জিন (LLM Reasoning)' : 'Multimodal Agronomic Engine'}</h3>
        <p className="text-gray">
          {language === 'bn' 
            ? 'পরামর্শ পেতে প্রথমে রোগ শনাক্তকরণ সম্পন্ন করুন।' 
            : 'Complete crop diagnosis to generate tailored weather & treatment advice.'}
        </p>
      </div>
    );
  }

  const currentWeather = weather || diagnosis.weather;

  return (
    <div className="card task-card">
      <div className="card-header">
        <h2>{language === 'bn' ? 'মাল্টিমোডাল এগ্রোনোমিক সিদ্ধান্ত ও প্রতিকার' : 'Multimodal Agronomic Reasoning Engine'}</h2>
      </div>

      {/* Hyperlocal Weather Header */}
      <div className="weather-widget">
        <div className="weather-item">
          <Thermometer size={18} color="#F59E0B" />
          <span>{currentWeather?.temperature}°C {language === 'bn' ? 'তাপমাত্রা' : 'Temp'}</span>
        </div>
        <div className="weather-item">
          <Droplets size={18} color="#3B82F6" />
          <span>{currentWeather?.humidity}% {language === 'bn' ? 'আর্দ্রতা' : 'Humidity'}</span>
        </div>
        <div className="weather-item">
          <CloudRain size={18} color="#6366F1" />
          <span>{currentWeather?.condition}</span>
        </div>
      </div>

      {/* Environmental Root Cause */}
      <div className="advisory-section mt-3">
        <h4>{language === 'bn' ? 'মূল কারণ ও আবহাওয়া সংবেদনশীলতা' : 'Probable Root Cause & Climate Trigger'}</h4>
        <p className="root-cause-text">
          {language === 'bn'
            ? `বর্তমান উচ্চ আর্দ্রতা (${currentWeather?.humidity}%) এবং অনুকূল তাপমাত্রার কারণে ${diagnosis.name} ছত্রাক দ্রুত ছড়াচ্ছে।`
            : `Fungal spore multiplication accelerated due to high humidity (${currentWeather?.humidity}%) and warm weather.`}
        </p>
      </div>

      {/* Tiered Intervention Plan */}
      <div className="grid-2 mt-3">
        {/* Organic Non-Chemical Controls */}
        <div className="remedy-card organic">
          <div className="remedy-title">
            <Leaf size={18} color="#10B981" />
            <span>{language === 'bn' ? 'জৈব বা প্রাকৃতিক প্রতিকার (Organic Control)' : 'Non-Chemical Organic Control'}</span>
          </div>
          <p>{diagnosis.organicRemedy}</p>
        </div>

        {/* Chemical Pesticide Dosages */}
        <div className="remedy-card chemical">
          <div className="remedy-title">
            <FlaskConical size={18} color="#3B82F6" />
            <span>{language === 'bn' ? 'রাসায়নিক স্প্রে মাত্রা (Exact Chemical Dosage)' : 'Chemical Dosage & Spray'}</span>
          </div>
          <p>{diagnosis.chemicalRemedy}</p>
        </div>
      </div>

      {/* Safety & Pre-Harvest Interval (PHI) + Spraying Schedule */}
      <div className="safety-schedule-box mt-3">
        <div className="schedule-header">
          <Clock size={18} color="#EF4444" />
          <span>{language === 'bn' ? 'আবহাওয়া-সামঞ্জস্যপূর্ণ স্প্রে সময়সূচী ও সতর্কতা' : 'Weather-Adjusted Spraying Schedule'}</span>
        </div>
        <div className="alert-strip warning">
          <AlertTriangle size={18} />
          <span>{diagnosis.sprayAdvice}</span>
        </div>
        <div className="phi-badge mt-2">
          <CheckCircle size={16} color="#10B981" />
          <span>PHI (Pre-Harvest Interval): <strong>{diagnosis.phiDays} {language === 'bn' ? 'দিন ফসল কাটা নিষেধ' : 'Days mandatory waiting time before harvest'}</strong></span>
        </div>
      </div>
    </div>
  );
}
