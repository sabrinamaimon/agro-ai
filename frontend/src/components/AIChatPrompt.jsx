import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, Volume2, Copy, Check, CornerDownLeft } from 'lucide-react';
import { sendAgroChatPrompt } from '../services/api';

export default function AIChatPrompt({ language }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: language === 'bn' 
        ? 'স্বাগতম! আমি আপনার Agro-AI সহকারী। ফসল, সার, কীটনাশক বা রোগবালাই নিয়ে যেকোনো প্রশ্ন লিখে ফেলুন, আমি সাথে সাথে সমাধান দিচ্ছি।'
        : 'Welcome! I am your Agro-AI agricultural assistant. Ask me anything about your crops, fertilizers, pesticides, or diseases.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const samplePrompts = language === 'bn' ? [
    'আলুর ব্লাইট রোগের সবচেয়ে কার্যকর চিকিৎসা কী?',
    'ধানের জমিতে কতদিন পর কোন সার দিতে হয়?',
    'টমেটোর পাতা কোঁকড়ানো রোগের প্রাকৃতিক ও রাসায়নিক প্রতিকার কী?',
    'বেগুনের ডগা ও ফল ছিদ্রকারী পোকার কীটনাশক ডোজ কত?'
  ] : [
    'How to treat Potato Late Blight organically and chemically?',
    'What is the ideal fertilizer schedule for Boro Rice?',
    'How to prevent and cure Tomato Leaf Curl Virus in Bangladesh?',
    'What is the dosage for Eggplant shoot and fruit borer?'
  ];

  // Auto-scroll to bottom whenever messages update or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleInputChange = (e) => {
    setInputPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const handleSendPrompt = async (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgList = [...messages, { sender: 'user', text: query, time: currentTime }];
    setMessages(newMsgList);
    setInputPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLoading(true);

    try {
      const data = await sendAgroChatPrompt(query, language);
      setMessages([...newMsgList, { 
        sender: 'ai', 
        text: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([...newMsgList, { 
        sender: 'ai', 
        text: language === 'bn' 
          ? 'দুঃখিত, এআই প্রতিক্রিয়া পেতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' 
          : 'Sorry, failed to fetch AI response. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="card task-card ai-chat-container ai-chat-card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: '#ECFDF5',
            border: '1.5px solid #A7F3D0',
            borderRadius: '12px',
            padding: '0.45rem',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageSquare size={22} />
          </div>
          <h2 style={{ margin: 0 }}>{language === 'bn' ? 'এআই কৃষি চ্যাট ও পরামর্শ' : 'AI Agro Chat & Advisory'}</h2>
        </div>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'আপনার ফসল, সার, কীটনাশক, মাটি কিংবা রোগবালাই নিয়ে যেকোনো প্রশ্ন লিখুন। আমাদের এআই সাথে সাথে সঠিক বৈজ্ঞানিক পরামর্শ দেবে।'
          : 'Ask any questions about your crops, fertilizer schedule, pesticide dosage, or soil care. Get instant expert solutions.'}
      </p>

      {/* Suggested Prompt Chips */}
      <div className="sample-btn-group mb-3">
        {samplePrompts.map((p, idx) => (
          <button 
            key={idx} 
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleSendPrompt(p)}
            disabled={loading}
          >
            <Sparkles size={14} color="#059669" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Messenger-Style Chat Messages Log */}
      <div className="chat-messages-box">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={index} className={`chat-message-row ${isUser ? 'user-row' : 'ai-row'}`}>
              {/* Rich Avatar */}
              <div className="chat-rich-avatar">
                {isUser ? (
                  <div className="avatar-icon-wrapper user" title={language === 'bn' ? 'আপনি' : 'You'}>
                    <User size={19} />
                  </div>
                ) : (
                  <div className="avatar-icon-wrapper ai" title="Agro-AI Assistant">
                    <Bot size={20} />
                    <span className="online-indicator" title="Active" />
                  </div>
                )}
              </div>

              {/* Message Content Bubble */}
              <div className={`chat-bubble-container ${isUser ? 'user-container' : 'ai-container'}`}>
                <div className="chat-sender-label">
                  <span className="sender-name">
                    {isUser ? (
                      language === 'bn' ? 'আপনি' : 'You'
                    ) : (
                      <>
                        <span>Agro-AI</span>
                        <span className="ai-badge-tiny">{language === 'bn' ? 'সহকারী' : 'AI'}</span>
                      </>
                    )}
                  </span>
                  {msg.time && <span className="message-time">{msg.time}</span>}
                </div>

                <div className={`chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
                  <p className="message-text">{msg.text}</p>
                </div>

                {/* AI Action toolbar: Audio + Copy */}
                {!isUser && (
                  <div className="ai-message-actions">
                    <button 
                      type="button" 
                      className="bubble-action-btn"
                      onClick={() => speakText(msg.text)}
                      title={language === 'bn' ? 'অডিও শুনুন' : 'Listen audio'}
                    >
                      <Volume2 size={13} />
                      <span>{language === 'bn' ? 'শুনুন' : 'Listen'}</span>
                    </button>
                    <button 
                      type="button" 
                      className="bubble-action-btn"
                      onClick={() => copyToClipboard(msg.text, index)}
                      title={language === 'bn' ? 'কপি করুন' : 'Copy'}
                    >
                      {copiedIndex === index ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                      <span>{copiedIndex === index ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="chat-message-row ai-row">
            <div className="chat-rich-avatar">
              <div className="avatar-icon-wrapper ai">
                <Bot size={20} />
                <span className="online-indicator" />
              </div>
            </div>
            <div className="chat-bubble-container ai-container">
              <div className="chat-sender-label">
                <span className="sender-name">
                  <span>Agro-AI</span>
                  <span className="ai-badge-tiny">{language === 'bn' ? 'সহকারী' : 'AI'}</span>
                </span>
              </div>
              <div className="chat-bubble ai-bubble loading-bubble">
                <Sparkles className="spin" size={17} />
                <span>{language === 'bn' ? 'পরামর্শ তৈরি হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...' : 'AI is reasoning with agronomic models...'}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Spacious Modern Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }} className="chat-modern-input-wrapper mt-3">
        <textarea 
          ref={textareaRef}
          rows={2}
          className="chat-textarea" 
          placeholder={language === 'bn' ? 'আপনার কৃষি বিষয়ক প্রশ্ন বিস্তারিতভাবে এখানে লিখুন...' : 'Type your detailed agricultural question here...'}
          value={inputPrompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <div className="chat-input-bottom-bar">
          <span className="input-shortcut-hint">
            <CornerDownLeft size={13} />
            <span>{language === 'bn' ? 'Enter চাপলে পাঠানো হবে, Shift+Enter এ নতুন লাইন' : 'Press Enter to send, Shift+Enter for new line'}</span>
          </span>
          <button 
            type="submit" 
            className="btn-chat-send" 
            disabled={loading || !inputPrompt.trim()}
          >
            {loading ? <Sparkles className="spin" size={16} /> : <Send size={16} />}
            <span>{language === 'bn' ? 'পাঠান' : 'Send'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
