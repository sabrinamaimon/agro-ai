import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
import { processVoiceIntake } from '../services/api';

export default function VoiceIntake({ language, onIntakeComplete }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedSchema, setExtractedSchema] = useState(null);

  const sampleQueries = [
    { bn: 'আমার আলু খেতের পাতায় কালো বাদামী দাগ পড়েছে ও গাছ নেতিয়ে পড়ছে', en: 'My potato crop leaves have blackish brown spots and plants are wilting' },
    { bn: 'ধানের পাতায় হলুদ লালচে ছোপ ছোপ দাগ ও ডগা মরা রোগ দেখা দিয়েছে', en: 'Rice crop leaves have yellow reddish spots and tip dieback disease' },
    { bn: 'টমেটো গাছে সাদা মাছি পোকার আক্রমণ ও ফল পচা রোগ শুরু হয়েছে', en: 'Tomato plants have whitefly attack and fruit rot starting' }
  ];

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(language === 'bn' 
        ? 'আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই। অনুগ্রহ করে ক্রোম ব্রাউজার ব্যবহার করুন অথবা লিখে দিন।' 
        : 'Browser voice recognition not supported. Please use Google Chrome or type your query.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      handleProcessTranscript(speechResult);
    };

    recognition.start();
  };

  const handleProcessTranscript = async (textToProcess) => {
    const query = textToProcess || transcript;
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await processVoiceIntake(query, language);
      setExtractedSchema(data);
      if (onIntakeComplete) onIntakeComplete(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sampleText) => {
    setTranscript(sampleText);
    handleProcessTranscript(sampleText);
  };

  return (
    <div className="card task-card">
      <div className="card-header">
        <h2>{language === 'bn' ? 'ভয়েস ইনপুট ও সমস্যা শনাক্তকরণ (Voice Query Intake)' : 'Voice Query Intake & Intent Extraction'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn' 
          ? 'আপনার ফসলের সমস্যা বাংলায় বা ইংরেজিতে মুখে বলুন, নমুনা প্রশ্ন চাপুন অথবা নিচে লিখে জানান।' 
          : 'Dictate crop symptoms in spoken Bengali or English, pick a sample query, or type below.'}
      </p>

      {/* Sample Query Chips for Fast Demo */}
      <div className="sample-chips-wrapper mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MessageCircle size={15} />
          {language === 'bn' ? 'নমুনা বাংলা ভয়েস ইনপুট (দ্রুত পরীক্ষার জন্য ক্লিক করুন):' : 'Sample Voice Queries (Click to test):'}
        </span>
        <div className="chips-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {sampleQueries.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              className="sample-chip-btn"
              onClick={() => handleSelectSample(language === 'bn' ? sample.bn : sample.en)}
              style={{
                background: 'var(--bg-accent)',
                border: '1px solid #A7F3D0',
                borderRadius: '20px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.82rem',
                color: 'var(--primary-dark)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              💬 "{language === 'bn' ? sample.bn : sample.en}"
            </button>
          ))}
        </div>
      </div>

      <div className="voice-input-group">
        <button 
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          onClick={startListening}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          <span>
            {isListening 
              ? (language === 'bn' ? 'শুনছি... বলুন' : 'Listening...') 
              : (language === 'bn' ? 'মাইকে চাপ দিয়ে কথা বলুন (Mic)' : 'Tap to Dictate')}
          </span>
        </button>

        <div className="text-entry-row">
          <input 
            type="text" 
            className="input-field"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={language === 'bn' ? 'অথবা এখানে লিখুন: "আমার আলুর পাতায় দাগ..."' : 'Or type: "Potato leaves have white spots..."'}
          />
          <button 
            className="btn btn-primary"
            onClick={() => handleProcessTranscript()}
            disabled={loading || !transcript.trim()}
          >
            {loading ? <Sparkles className="spin" size={18} /> : <Send size={18} />}
            <span>{language === 'bn' ? 'বিশ্লেষণ করুন' : 'Extract Intent'}</span>
          </button>
        </div>
      </div>

      {extractedSchema && (
        <div className="result-box mt-4">
          <div className="result-header">
            <CheckCircle2 color="#10B981" size={20} />
            <h4>{language === 'bn' ? 'শনাক্তকৃত বিষয় ও তথ্যের বিবরণ (Extracted Intent)' : 'Extracted Intent JSON'}</h4>
          </div>

          <div className="grid-2">
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'ফসলের নাম' : 'Crop Type'}</span>
              <span className="data-value">{extractedSchema.crop_type}</span>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'রোপণের সময়' : 'Est. Planting Date'}</span>
              <span className="data-value">{extractedSchema.estimated_planting_date}</span>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'ক্ষতির বিবরণ' : 'Observed Damage'}</span>
              <span className="data-value">{extractedSchema.observed_damage_description}</span>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'ইউনিয়ন / এলাকা' : 'Geographic Union'}</span>
              <span className="data-value">{extractedSchema.geographic_union}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
