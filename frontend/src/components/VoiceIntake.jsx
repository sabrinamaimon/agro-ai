import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles, CheckCircle2, MessageCircle, MapPin, AlertCircle } from 'lucide-react';
import { processVoiceIntake } from '../services/api';

export default function VoiceIntake({ language, gpsLocation, onIntakeComplete }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [extractedSchema, setExtractedSchema] = useState(null);
  const recognitionRef = useRef(null);

  const sampleQueries = [
    { bn: 'আলুর জমিতে ভালো ফলন পেতে কি কি সার ও ইউরিয়া দিতে হবে?', en: 'What fertilizers are needed for good potato yield?' },
    { bn: 'বেগুনের গায়ে পোকা ও ডগা ছিদ্রকারী বালাই দমনে কি কীটনাশক দেব?', en: 'What pesticide should I spray for eggplant shoot and fruit borer?' },
    { bn: 'আগামীকাল কি বৃষ্টি হতে পারে, জমিতে এখন সেচ দেওয়া যাবে?', en: 'Will it rain tomorrow, is it safe to irrigate now?' },
    { bn: 'বেলে দোআঁশ মাটিতে কোন কোন ফসল সবচেয়ে ভালো ফলন দেয়?', en: 'Which crops grow best in sandy loam soil?' },
    { bn: 'কলা গাছের পাতায় কালো দাগ পড়েছে ও পাতা পুড়ে যাচ্ছে', en: 'Banana leaves have black spots and are drying up' }
  ];

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const toggleListening = () => {
    // If currently listening, toggle OFF immediately
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error('Error stopping speech recognition:', e);
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(language === 'bn' 
        ? 'আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই। অনুগ্রহ করে ক্রোম ব্রাউজার ব্যবহার করুন অথবা লিখে দিন।' 
        : 'Browser voice recognition not supported. Please use Google Chrome or type your query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition status:', event.error);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        handleProcessTranscript(speechResult);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  const handleProcessTranscript = async (textToProcess) => {
    const query = textToProcess || transcript;
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await processVoiceIntake(query, language, gpsLocation);
      setExtractedSchema(data);
      if (onIntakeComplete) onIntakeComplete(data);
    } catch (err) {
      console.error('Voice intake error:', err);
      setErrorMsg(language === 'bn' ? 'তথ্য বিশ্লেষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Failed to extract intent. Please try again.');
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
        <h2>{language === 'bn' ? 'ভয়েস কৃষি পরামর্শ ও জিজ্ঞাসা (Voice Farming Advisory)' : 'Voice Farming Advisory & Query Intake'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn' 
          ? 'ফসলের রোগবালাই, সার, কীটনাশক, জমি/মাটি কিংবা আবহাওয়া সংক্রান্ত যেকোনো প্রশ্ন মুখে বলুন বা লিখে জানান।' 
          : 'Ask any questions about crop diseases, fertilizers, pesticides, soil preparation, or weather in voice or text.'}
      </p>

      {/* GPS Location Indicator Badge */}
      <div className="voice-gps-badge mb-3" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        background: '#F0FDF4',
        border: '1px solid #BBF7D0',
        padding: '0.45rem 0.85rem',
        borderRadius: '10px',
        fontSize: '0.84rem',
        color: '#065F46',
        marginBottom: '1rem'
      }}>
        <MapPin size={16} className="text-emerald" />
        <span>
          {language === 'bn' ? 'মাঠের লোকেশন:' : 'Field Location:'}{' '}
          <strong>{gpsLocation?.areaName || (language === 'bn' ? 'জিপিএস যুক্ত নেই (আবহাওয়া পেজ থেকে চালু করুন)' : 'GPS not enabled')}</strong>
        </span>
      </div>

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
          type="button"
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          title={isListening 
            ? (language === 'bn' ? 'ভয়েস ইনপুট বন্ধ করতে আবার চাপুন' : 'Click to stop listening') 
            : (language === 'bn' ? 'মাইকে চাপ দিয়ে কথা বলুন' : 'Tap to dictate')}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          <span>
            {isListening 
              ? (language === 'bn' ? 'শুনছি... বন্ধ করতে আবার চাপুন' : 'Listening... Click to stop') 
              : (language === 'bn' ? 'মাইকে চাপ দিয়ে কথা বলুন (Mic)' : 'Tap to Dictate')}
          </span>
        </button>

        <div className="text-entry-row">
          <input 
            type="text" 
            className="input-field"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={language === 'bn' ? 'অথবা এখানে লিখুন: "আমার কলার পাতায় দাগ..."' : 'Or type: "Banana leaves have spots..."'}
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

      {errorMsg && (
        <div className="alert-strip warning mt-3">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {extractedSchema && (
        <div className="result-box mt-4">
          <div className="result-header">
            <CheckCircle2 color="#10B981" size={20} />
            <h4>{language === 'bn' ? 'শনাক্তকৃত বিষয় ও তথ্যের বিবরণ' : 'Extracted Intent & Details'}</h4>
          </div>

          {extractedSchema.query_category && (
            <div className="query-category-badge" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#ECFDF5',
              color: '#065F46',
              border: '1px solid #A7F3D0',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginTop: '0.65rem',
              marginBottom: '1rem'
            }}>
              <Sparkles size={15} color="#059669" />
              <span>{language === 'bn' ? 'বিষয়:' : 'Topic:'} <strong>{extractedSchema.query_category}</strong></span>
            </div>
          )}

          <div className="grid-2">
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'ফসলের নাম' : 'Crop Type'}</span>
              <strong className="data-value" style={{ color: '#059669', fontSize: '1.05rem' }}>{extractedSchema.crop_type}</strong>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'রোপণের সময়' : 'Est. Planting Date'}</span>
              <span className="data-value">{extractedSchema.estimated_planting_date || (language === 'bn' ? 'উল্লেখ নেই' : 'Not specified')}</span>
            </div>
            <div className="data-item">
              <span className="data-label">
                {language === 'bn' 
                  ? (extractedSchema.query_category?.includes('রোগ') || extractedSchema.query_category?.includes('বালাই') 
                      ? 'লক্ষণ ও ক্ষতির বিবরণ' 
                      : 'জিজ্ঞাসার মূল বিষয়') 
                  : 'Query / Symptom Summary'}
              </span>
              <span className="data-value">{extractedSchema.observed_damage_description}</span>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'ইউনিয়ন / এলাকা' : 'Geographic Union'}</span>
              <strong className="data-value" style={{ color: '#047857' }}>{extractedSchema.geographic_union}</strong>
            </div>
          </div>

          {extractedSchema.expert_advisory && (
            <div className="expert-advisory-card" style={{
              background: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: '12px',
              padding: '1.25rem',
              marginTop: '1.25rem',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.75rem' }}>
                <div style={{
                  background: '#059669',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={18} />
                </div>
                <h4 style={{ margin: 0, color: '#065F46', fontSize: '1.05rem', fontWeight: 700 }}>
                  {language === 'bn' ? 'কৃষি বিশেষজ্ঞের তাৎক্ষণিক পরামর্শ ও সমাধান' : 'Instant Agricultural Advisory & Solution'}
                </h4>
              </div>
              <div style={{
                color: '#1F2937',
                fontSize: '0.94rem',
                lineHeight: '1.7',
                whiteSpace: 'pre-line'
              }}>
                {extractedSchema.expert_advisory}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
