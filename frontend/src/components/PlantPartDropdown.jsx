import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Layers, Search, X } from 'lucide-react';

const PLANT_PARTS = [
  { id: 'leaf', nameBn: 'পাতা (Leaf / Foliage)', nameEn: 'Leaf / Foliage', descBn: 'পাতার দাগ, ব্লাইট, মোজাইক, গুঁড়া রোগ', icon: '🍃' },
  { id: 'fruit', nameBn: 'ফল ও কন্দ (Fruit / Tuber)', nameEn: 'Fruit / Tuber', descBn: 'ফল পচা, অ্যানথ্রাকনোজ, ফলের ছিদ্র বা পচন', icon: '🍎' },
  { id: 'stem', nameBn: 'গাছের কাণ্ড ও ডাল (Stem & Trunk)', nameEn: 'Stem & Trunk', descBn: 'ডাইব্যাক, কাণ্ড পচা, আঠা ঝরা, বাকল ফাটা', icon: '🪵' },
  { id: 'root', nameBn: 'গোড়া ও মূল (Root & Collar)', nameEn: 'Root & Collar', descBn: 'গোড়া পচা, শেকড় শুকিয়ে যাওয়া, শিকড় পচা', icon: '🌱' },
  { id: 'auto', nameBn: 'স্বয়ংক্রিয় শনাক্তকরণ (Auto-Detect)', nameEn: 'Auto-Detect', descBn: 'ছবির ক্ষত দেখে এআই স্বয়ংক্রিয়ভাবে শনাক্ত করবে', icon: '🔍' }
];

export default function PlantPartDropdown({ language, selectedPart, onSelectPart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentPart = PLANT_PARTS.find(p => p.id === selectedPart);

  const filteredParts = PLANT_PARTS.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return p.nameBn.toLowerCase().includes(q) || 
           p.nameEn.toLowerCase().includes(q) ||
           p.descBn.toLowerCase().includes(q);
  });

  const handleSelect = (partId) => {
    onSelectPart(partId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="plant-part-dropdown-container" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className={`part-dropdown-trigger ${isOpen ? 'open' : ''} ${selectedPart ? 'has-value' : 'empty'}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
      >
        <div className="trigger-left">
          {currentPart ? (
            <>
              <span className="part-trigger-icon">{currentPart.icon}</span>
              <div className="part-trigger-labels">
                <span className="part-main-name">
                  {language === 'bn' ? currentPart.nameBn : currentPart.nameEn}
                </span>
                <span className="part-sub-desc">
                  {language === 'bn' ? currentPart.descBn : currentPart.nameEn}
                </span>
              </div>
            </>
          ) : (
            <div className="trigger-placeholder">
              <Layers size={18} className="placeholder-icon" />
              <span>
                {language === 'bn' 
                  ? '-- আক্রান্ত উদ্ভিদাংশ নির্বাচন করুন (যেমন: পাতা, ফল, কাণ্ড) --' 
                  : '-- Select Plant Part / Organ --'}
              </span>
            </div>
          )}
        </div>

        <div className="trigger-right">
          <ChevronDown size={18} className={`trigger-chevron ${isOpen ? 'rotated' : ''}`} />
        </div>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="part-dropdown-panel animate-fade-in">
          {/* Quick Search */}
          <div className="dropdown-search-wrapper">
            <Search size={16} className="dropdown-search-icon" />
            <input
              type="text"
              className="dropdown-search-input"
              placeholder={language === 'bn' ? 'অংশ খুঁজুন (পাতা, ফল, কাণ্ড, গোড়া)...' : 'Search part (Leaf, Fruit, Stem, Root)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button 
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="part-options-list">
            {filteredParts.map(part => {
              const isSelected = selectedPart === part.id;
              return (
                <div
                  key={part.id}
                  className={`part-option-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(part.id)}
                >
                  <span className="part-item-icon">{part.icon}</span>
                  <div className="part-item-info">
                    <strong className="part-item-title">{language === 'bn' ? part.nameBn : part.nameEn}</strong>
                    <span className="part-item-subtitle">{part.descBn}</span>
                  </div>
                  {isSelected && (
                    <span className="part-item-check">
                      <Check size={16} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
