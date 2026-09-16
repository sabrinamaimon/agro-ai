import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { processVoiceIntake } from '../services/api';

export default function VoiceIntake({ language, onIntakeComplete }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedSchema, setExtractedSchema] = useState(null);

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

  return (
    <div className="card task-card">
      <div className="card-header">
        <h2>{language === 'bn' ? 'ভয়েস অনুসন্ধান ও তথ্য নির্যাস (Intake & Intent)' : 'Voice Query Intake & Intent Extraction'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn' 
          ? 'আপনার ফসলের সমস্যা বাংলায় বা ইংরেজিতে মুখে বলুন অথবা নিচে লিখে জানান।' 
          : 'Dictate crop symptoms in spoken Bengali or English to extract structured intent.'}
      </p>

      <div className="voice-input-group">
        <button 
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          onClick={startListening}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          <span>
            {isListening 
              ? (language === 'bn' ? 'শুনছি... বলুন' : 'Listening...') 
              : (language === 'bn' ? 'মুখে বলতে ক্লিক করুন (Mic)' : 'Tap to Dictate')}
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
            <h4>{language === 'bn' ? 'এক্সট্র্যাক্ট করা তথ্য (Structured Intent JSON)' : 'Extracted JSON Schema'}</h4>
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
