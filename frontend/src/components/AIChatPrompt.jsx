import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, Volume2 } from 'lucide-react';
import { sendAgroChatPrompt } from '../services/api';

export default function AIChatPrompt({ language }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: language === 'bn' 
        ? 'সালাম! আমি আপনার Agro-AI সহকারী। ফসল, সার, রোগবালাই বা যেকোনো কৃষি সম্পর্কিত প্রশ্ন বা প্রম্পট লিখুন।' 
        : 'Hello! I am your Agro-AI assistant. Ask me any question or prompt regarding crops, fertilizers, or pest control.'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = language === 'bn' ? [
    'আলুর ব্লাইট রোগের সবচেয়ে কার্যকর চিকিৎসা কী?',
    'ধানের জমিতে কতদিন পর কোন সার দিতে হয়?',
    'টমেটোর পাতা কোঁকড়ানো রোগের প্রাকৃতিক ও রাসায়নিক প্রতিকার কী?'
  ] : [
    'How to treat Potato Late Blight organically and chemically?',
    'What is the ideal fertilizer schedule for Boro Rice?',
    'How to prevent and cure Tomato Leaf Curl Virus in Bangladesh?'
  ];

  const handleSendPrompt = async (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const newMsgList = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgList);
    setInputPrompt('');
    setLoading(true);

    try {
      const data = await sendAgroChatPrompt(query, language);
      setMessages([...newMsgList, { sender: 'ai', text: data.response }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([...newMsgList, { 
        sender: 'ai', 
        text: language === 'bn' 
          ? 'দুঃখিত, এআই প্রতিক্রিয়া পেতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' 
          : 'Sorry, failed to fetch AI response. Please try again.' 
      }]);
    } finally {
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
        <h2>{language === 'bn' ? 'এআই কৃষি চ্যাট প্রম্পট (Groq 120B AI Assistant)' : 'AI Agro Assistant Prompt Chat'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'কৃষি বিষয়ক যেকোনো প্রশ্ন বা প্রম্পট লিখুন—Groq এর ১২০ বিলিয়ন প্যারামিটার এআই মডেল সরাসরি সঠিক ও বৈজ্ঞানিক সমাধান প্রদান করবে।'
          : 'Ask any custom farming query—Groq 120B AI model generates live, scientifically verified agronomic guidance.'}
      </p>

      {/* Suggested Prompt Chips */}
      <div className="sample-btn-group mb-3">
        {samplePrompts.map((p, idx) => (
          <button 
            key={idx} 
            className="btn btn-outline btn-sm"
            onClick={() => handleSendPrompt(p)}
            disabled={loading}
          >
            <Sparkles size={14} color="#059669" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="chat-messages-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble-wrapper ${msg.sender}`}>
            <div className="chat-avatar">
              {msg.sender === 'ai' ? <Bot size={18} color="#10B981" /> : <User size={18} color="#3B82F6" />}
            </div>
            <div className="chat-bubble">
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              {msg.sender === 'ai' && (
                <button className="speak-btn-tiny" onClick={() => speakText(msg.text)} title="Listen in audio">
                  <Volume2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble-wrapper ai">
            <div className="chat-avatar"><Bot size={18} color="#10B981" /></div>
            <div className="chat-bubble loading-bubble">
              <Sparkles className="spin" size={16} color="#10B981" />
              <span>{language === 'bn' ? 'এআই চিন্তা করছে ও উত্তর তৈরি করছে...' : 'AI reasoning with 120B model...'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }} className="chat-input-form mt-3">
        <input 
          type="text" 
          className="input-field chat-input" 
          placeholder={language === 'bn' ? 'আপনার কৃষি বিষয়ক প্রশ্ন এখানে লিখুন...' : 'Type your agricultural query here...'}
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !inputPrompt.trim()}>
          <Send size={18} />
          <span>{language === 'bn' ? 'পাঠান' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
}
