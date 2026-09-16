import React, { useState } from 'react';
import { Volume2, Download, Share2, FileText, CheckCircle, AlertOctagon, Sparkles } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function CropPassport({ language, intake, diagnosis, price }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activeDiagnosis = diagnosis || {
    name: 'Potato Late Blight (আলুর লেট ব্লাইট)',
    cropType: 'Potato (আলু)',
    severity: 'Severe',
    damagePercentage: 38,
    union: intake?.geographic_union || 'Rangpur Sadar',
    chemicalRemedy: 'Apply Mancozeb 75% WP @ 2.5g/liter of water.',
    sprayAdvice: 'DO NOT spray today due to rain in 4 hours. Spray tomorrow at 7:00 AM after foliage dries.',
    phiDays: 14,
    market: price || { offeredPrice: 20, benchmarkPrice: 28, isUndercut: true }
  };

  const playBengaliAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert(language === 'bn' ? 'ব্রাউজার অডিও ভয়েস সমর্থিত নয়।' : 'Speech synthesis not supported in browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = language === 'bn'
      ? `জরুরী কৃষি পরামর্শ: আপনার ${activeDiagnosis.cropType} খেতে ${activeDiagnosis.name} শনাক্ত হয়েছে। ${activeDiagnosis.sprayAdvice} পানির সাথে ম্যানকোজেব স্প্রে করুন। ফসল কাটার ১৪ দিন আগে স্প্রে বন্ধ রাখুন।`
      : `Critical Advisory: Detected ${activeDiagnosis.name} in your ${activeDiagnosis.cropType}. ${activeDiagnosis.sprayAdvice}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
    utterance.rate = 0.9;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const downloadPDF = () => {
    const element = document.getElementById('field-health-card');
    if (!element) return;

    const opt = {
      margin:       0.5,
      filename:     `AgroAI_Digital_Crop_Passport_${Date.now()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const shareViaWhatsApp = () => {
    const text = `*Agro-AI Field Health Card*%0A🌾 Crop: ${activeDiagnosis.cropType}%0A🦠 Pathology: ${activeDiagnosis.name}%0A⚠️ Severity: ${activeDiagnosis.severity}%0A💊 Remedy: ${activeDiagnosis.chemicalRemedy}`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="card task-card">
      <div className="card-header">
        <h2>{language === 'bn' ? 'বাংলা অডিও ব্রিফিং ও ডিজিটাল ক্রপ পাসপোর্ট' : 'Bengali Audio Advisory & Digital Crop Passport'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'বাংলা অডিও বিবরণ শুনুন এবং প্রিন্ট/ডাউনলোড যোগ্য ডিজিটাল ফিল্ড কার্ড গ্রহণ করুন।'
          : 'Listen to spoken Bengali voice briefing and download shareable Crop Passport PDF.'}
      </p>

      {/* Audio Briefing Player Widget */}
      <div className="audio-player-widget">
        <button 
          className={`btn ${isPlayingAudio ? 'btn-danger' : 'btn-success'}`}
          onClick={playBengaliAudio}
        >
          <Volume2 size={20} className={isPlayingAudio ? 'pulse' : ''} />
          <span>
            {isPlayingAudio 
              ? (language === 'bn' ? 'অডিও থামান (Stop Voice)' : 'Stop Audio') 
              : (language === 'bn' ? 'বাংলা ভয়েস ব্রিফিং শুনুন (Listen Bengali Audio)' : 'Play Spoken Bengali Audio')}
          </span>
        </button>

        <div className="action-row">
          <button className="btn btn-outline" onClick={downloadPDF}>
            <Download size={18} />
            <span>{language === 'bn' ? 'পাসপোর্ট PDF ডাউনলোড' : 'Download Passport PDF'}</span>
          </button>
          <button className="btn btn-whatsapp" onClick={shareViaWhatsApp}>
            <Share2 size={18} />
            <span>WhatsApp Share</span>
          </button>
        </div>
      </div>

      {/* Printable Digital Crop Passport Card Target */}
      <div id="field-health-card" className="crop-passport-card mt-4">
        <div className="passport-header">
          <div className="passport-brand">
            <FileText size={24} color="#059669" />
            <div>
              <h3>Agro-AI Digital Crop Passport (ফিল্ড হেলথ কার্ড)</h3>
              <p className="text-xs">Smart Agricultural Field Intelligence Document</p>
            </div>
          </div>
          <span className="passport-id">ID: #AGRO-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>

        <div className="passport-grid mt-3">
          <div className="p-item">
            <span className="p-label">FARMER / LOCATION</span>
            <span className="p-val">{intake?.geographic_union || 'Rangpur Sadar, Bangladesh'}</span>
          </div>

          <div className="p-item">
            <span className="p-label">DIAGNOSED PATHOGEN</span>
            <span className="p-val danger">{activeDiagnosis.name}</span>
          </div>

          <div className="p-item">
            <span className="p-label">DAMAGE SEVERITY</span>
            <span className="p-val warning">{activeDiagnosis.severity} ({activeDiagnosis.damagePercentage}% Surface Area)</span>
          </div>

          <div className="p-item">
            <span className="p-label">PRE-HARVEST INTERVAL</span>
            <span className="p-val success">{activeDiagnosis.phiDays} Days Mandatory PHI</span>
          </div>
        </div>

        <div className="passport-box mt-3">
          <h5>DOSAGE & WEATHER SPRAY SCHEDULE</h5>
          <p className="text-sm">{activeDiagnosis.chemicalRemedy}</p>
          <p className="text-xs text-danger mt-1">⚠️ {activeDiagnosis.sprayAdvice}</p>
        </div>

        <div className="passport-footer mt-3">
          <span>Official AI Field Diagnostic Certificate</span>
          <span>Powered by Agro-AI System</span>
        </div>
      </div>
    </div>
  );
}
