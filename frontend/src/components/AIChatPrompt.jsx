import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, Volume2 } from 'lucide-react';
import { processVoiceIntake } from '../services/api';

export default function AIChatPrompt({ language }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: language === 'bn' 
        ? 'সালাম! আমি আপনার Agro-AI সহকারী। ফসল, সার বা কৃষি সম্পর্কিত যেকোনো প্রম্পট বা প্রশ্ন টাইপ করুন।' 
        : 'Hello! I am your Agro-AI assistant. Ask me any question or prompt regarding crops, fertilizers, or pest control.'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = language === 'bn' ? [
    'আলুর ব্লাইট রোগের চিকিৎসা কী?',
    'ধানের জমিতে কতদিন পর পানি দিতে হয়?',
    'টমেটোর পাতা কোঁকড়ানো রোগের প্রাকৃতিক প্রতিকার কী?'
  ] : [
    'How to treat Potato Late Blight organically?',
    'What is the ideal fertilizer schedule for Boro Rice?',
    'How to prevent Tomato Leaf Curl Virus?'
  ];

  const handleSendPrompt = async (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const newMsgList = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgList);
    setInputPrompt('');
    setLoading(true);

    try {
      // Simulate/call Gemini AI prompt reasoning
      setTimeout(() => {
        let aiAnswer = '';
        if (query.includes('আলু') || query.toLowerCase().includes('potato')) {
          aiAnswer = language === 'bn'
            ? 'আলুর লেট ব্লাইট প্রতিরোধে আক্রান্ত পাতা পুড়িয়ে ফেলুন এবং ম্যানকোজেব ৭৫% ডাব্লিউপি (২.৫ গ্রাম/লিটার পানি) স্প্রে করুন। বৃষ্টির সম্ভাবনা থাকলে স্প্রে বন্ধ রাখুন।'
            : 'For Potato Late Blight, remove infected leaves immediately and apply Mancozeb 75% WP @ 2.5g/L. Avoid spraying before rain.';
        } else if (query.includes('ধান') || query.toLowerCase().includes('rice')) {
          aiAnswer = language === 'bn'
            ? 'ধানের জমিতে রোপণের ১০-১৫ দিন পর প্রথম কিস্তির ইউরিয়া সার প্রয়োগ করুন। অতিরিক্ত নাইট্রোজেন ব্যবহার এড়িয়ে চলুন।'
            : 'Apply first split of Urea fertilizer 10-15 days after transplanting rice. Avoid excess nitrogen.';
        } else {
          aiAnswer = language === 'bn'
            ? 'আপনার প্রশ্নের জন্য ধন্যবাদ! ভালো ফলন ও রোগ দমনে জৈব বালাইনাশক ও সুষম সার ব্যবহার করুন।'
            : 'Thank you for your prompt! Maintain balanced N-P-K fertilization and monitor crop foliage regularly.';
        }

        setMessages([...newMsgList, { sender: 'ai', text: aiAnswer }]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="card task-card">
      <div className="card-header">
        <MessageSquare color="#059669" size={24} />
        <h2>{language === 'bn' ? 'এআই কৃষি চ্যাট প্রম্পট (AI Agro Prompt)' : 'AI Agro Assistant Prompt Chat'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'কৃষি বিষয়ক যেকোনো প্রম্পট বা প্রশ্ন লিখুন, এআই সহকারী সাথে সাথে উত্তর দেবে।'
          : 'Type any custom farming prompt or agricultural query to receive instant AI guidance.'}
      </p>

      {/* Suggested Prompt Chips */}
      <div className="sample-btn-group mb-3">
        {samplePrompts.map((p, idx) => (
          <button 
            key={idx} 
            className="btn btn-outline btn-sm"
            onClick={() => handleSendPrompt(p)}
          >
            <Sparkles size={14} color="#059669" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="chat-messages-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble-row ${msg.sender}`}>
            <div className="chat-avatar">
              {msg.sender === 'ai' ? <Bot size={18} color="#059669" /> : <User size={18} color="#2563EB" />}
            </div>
            <div className="chat-bubble">
              <p>{msg.text}</p>
              {msg.sender === 'ai' && (
                <button className="speak-btn mt-1" onClick={() => speakText(msg.text)}>
                  <Volume2 size={14} />
                  <span>{language === 'bn' ? 'শুনুন' : 'Listen'}</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble-row ai">
            <div className="chat-avatar"><Bot size={18} color="#059669" /></div>
            <div className="chat-bubble loading-bubble">
              <Sparkles className="spin" size={16} />
              <span>{language === 'bn' ? 'এআই প্রম্পট প্রসেস করছে...' : 'Gemini AI processing prompt...'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Prompt Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }}
        className="prompt-input-form mt-3"
      >
        <input 
          type="text" 
          className="input-field"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={language === 'bn' ? 'এখানে আপনার প্রশ্ন বা প্রম্পট লিখুন...' : 'Type your prompt here...'}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !inputPrompt.trim()}>
          <Send size={18} />
          <span>{language === 'bn' ? 'পাঠান' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
}
