import React, { useState, useRef } from 'react';
import { Volume2, Download, Share2, FileText, CheckCircle, AlertOctagon, Sparkles, ArrowRight } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { requestAudioTTS } from '../services/api';

export default function CropPassport({ language, intake, diagnosis, price, setActiveTab }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioRef = useRef(null);

  if (!diagnosis) {
    return (
      <div className="card task-card placeholder-card">
        <FileText size={48} color="#059669" />
        <h3 className="mt-2">{language === 'bn' ? 'ডিজিটাল ক্রপ পাসপোর্ট (Digital Field Passport)' : 'Digital Crop Passport'}</h3>
        <p className="text-gray mt-1">
          {language === 'bn' 
            ? 'ডিজিটাল ক্রপ পাসপোর্ট ও বাংলা অডিও ব্রিফিং পেতে প্রথমে রোগ শনাক্তকরণ (Task 2) সম্পন্ন করুন।'
            : 'Please run Task 2 (Visual Crop Disease Detection) to generate your verified digital field passport.'}
        </p>
        {setActiveTab && (
          <button className="btn btn-primary mt-3" onClick={() => setActiveTab('task2')}>
            <span>{language === 'bn' ? 'রোগ নির্ণয় করতে যান (Go to Scanner)' : 'Go to Leaf Scanner'}</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    );
  }

  const activeDiagnosis = diagnosis;

  const fallbackSpeech = (textToSpeak) => {
    if (!('speechSynthesis' in window)) {
      alert(language === 'bn' ? 'ব্রাউজার অডিও ভয়েস সমর্থিত নয়।' : 'Speech synthesis not supported in browser.');
      setIsPlayingAudio(false);
      setIsGeneratingAudio(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => { setIsPlayingAudio(false); setIsGeneratingAudio(false); };
    utterance.onerror = () => { setIsPlayingAudio(false); setIsGeneratingAudio(false); };
    window.speechSynthesis.speak(utterance);
  };

  const playBengaliAudio = async () => {
    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = language === 'bn'
      ? `জরুরী কৃষি পরামর্শ: আপনার ${activeDiagnosis.cropType} খেতে ${activeDiagnosis.name} শনাক্ত হয়েছে। পাতার ক্ষতির পরিমাণ শতকরা ${activeDiagnosis.damagePercentage} ভাগ। প্রস্তাবিত প্রতিকার: ${activeDiagnosis.chemicalRemedy}। স্প্রে পরামর্শ: ${activeDiagnosis.sprayAdvice}। ফসল কাটার পূর্বে ন্যূনতম ${activeDiagnosis.phiDays} দিন স্প্রে বন্ধ রাখুন।`
      : `Critical Advisory: Diagnosed ${activeDiagnosis.name} on ${activeDiagnosis.cropType} with ${activeDiagnosis.damagePercentage}% surface damage. Recommended chemical treatment: ${activeDiagnosis.chemicalRemedy}. ${activeDiagnosis.sprayAdvice}. Maintain mandatory ${activeDiagnosis.phiDays} days pre-harvest interval.`;

    setIsGeneratingAudio(true);

    try {
      const ttsResult = await requestAudioTTS(textToSpeak, language);
      setIsGeneratingAudio(false);
      if (ttsResult && ttsResult.audio_url) {
        const audioUrl = ttsResult.audio_url.startsWith('http') 
          ? ttsResult.audio_url 
          : `http://localhost:8000${ttsResult.audio_url}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        setIsPlayingAudio(true);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          fallbackSpeech(textToSpeak);
        };
        await audio.play();
        return;
      }
    } catch (e) {
      console.warn("Edge-TTS unavailable, falling back to browser speech", e);
      setIsGeneratingAudio(false);
    }

    setIsPlayingAudio(true);
    fallbackSpeech(textToSpeak);
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
    const text = `*Agro-AI Field Health Card*%0A🌾 Crop: ${activeDiagnosis.cropType}%0A🦠 Pathology: ${activeDiagnosis.name}%0A⚠️ Damage: ${activeDiagnosis.damagePercentage}%%0A💊 Chemical: ${activeDiagnosis.chemicalRemedy}%0A🕒 Spray: ${activeDiagnosis.sprayAdvice}`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="card task-card">
      <div className="card-header">
        <h2>{language === 'bn' ? 'বাংলা অডিও ব্রিফিং ও ডিজিটাল ক্রপ পাসপোর্ট' : 'Bengali Audio Advisory & Digital Crop Passport'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'বাংলা প্রাকৃতিক কণ্ঠে অডিও পরামর্শ শুনুন এবং মাঠে ব্যবহারের জন্য ডিজিটাল ফিল্ড কার্ড ডাউনলোড বা শেয়ার করুন।'
          : 'Listen to natural Bengali audio briefing and download or share your verified Digital Field Health Card.'}
      </p>

      {/* Audio Briefing Player Widget */}
      <div className="audio-player-widget">
        <button 
          className={`btn ${isPlayingAudio ? 'btn-danger' : 'btn-success'}`}
          onClick={playBengaliAudio}
          disabled={isGeneratingAudio}
        >
          {isGeneratingAudio ? (
            <Sparkles className="spin" size={20} />
          ) : (
            <Volume2 size={20} className={isPlayingAudio ? 'pulse' : ''} />
          )}
          <span>
            {isGeneratingAudio 
              ? (language === 'bn' ? 'অডিও তৈরি হচ্ছে...' : 'Generating Voice...')
              : isPlayingAudio 
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
          <div className="passport-qr-wrapper">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`AgroAI-Report-${activeDiagnosis.name}-${activeDiagnosis.severity}`)}`} 
              alt="Scan Report QR Code" 
              className="passport-qr-code" 
            />
            <span className="passport-id">ID: #AGRO-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
        </div>

        <div className="passport-grid mt-3">
          <div className="p-item">
            <span className="p-label">FARMER / LOCATION</span>
            <span className="p-val">{intake?.geographic_union || activeDiagnosis.union || 'Rangpur Sadar, Bangladesh'}</span>
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

        {activeDiagnosis?.annotated_image && (
          <div className="passport-image-preview mt-3" style={{ textAlign: 'center' }}>
            <img 
              src={activeDiagnosis.annotated_image} 
              alt="Lesion Bounding Overlays" 
              style={{ maxHeight: '160px', borderRadius: '8px', border: '1px solid #10B981', display: 'inline-block' }} 
            />
            <p className="text-xs text-gray mt-1">OpenCV Physical Lesion Bounding Overlay</p>
          </div>
        )}

        <div className="passport-box mt-3">
          <h5>DOSAGE & WEATHER SPRAY SCHEDULE</h5>
          <p className="text-sm">{activeDiagnosis.chemicalRemedy}</p>
          <p className="text-xs text-danger mt-1">⚠️ {activeDiagnosis.sprayAdvice}</p>
        </div>

        <div className="passport-footer mt-3">
          <span>Official AI Field Diagnostic Certificate</span>
          <span>Verified by Agro-AI System</span>
        </div>
      </div>
    </div>
  );
}
