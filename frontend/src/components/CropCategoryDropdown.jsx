import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Layers, Search, X, Sparkles } from 'lucide-react';
import { CROP_CATEGORIES } from '../data/bangladeshCrops';

export default function CropCategoryDropdown({ language, selectedCategory, onSelectCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on click outside or Escape
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

  // Autofocus on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const currentCategory = CROP_CATEGORIES.find(c => c.id === selectedCategory);

  const filteredCategories = CROP_CATEGORIES.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return c.nameBn.toLowerCase().includes(q) ||
           c.nameEn.toLowerCase().includes(q) ||
           c.sampleBn.toLowerCase().includes(q) ||
           c.sampleEn.toLowerCase().includes(q);
  });

  const handleSelect = (catId) => {
    onSelectCategory(catId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSelectCategory(null);
  };

  return (
    <div className="crop-category-dropdown-container" ref={dropdownRef}>
      {/* Dropdown Trigger Box */}
      <button
        type="button"
        className={`category-dropdown-trigger ${isOpen ? 'open' : ''} ${selectedCategory ? 'has-value' : 'empty'}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
      >
        <div className="trigger-left">
          {currentCategory ? (
            <>
              <span className="selected-category-icon">{currentCategory.icon}</span>
              <div className="selected-category-text">
                <span className="category-main-name">
                  {language === 'bn' ? currentCategory.nameBn : currentCategory.nameEn}
                </span>
                <span className="category-sub-sample">
                  {language === 'bn' ? `অন্তর্ভুক্ত: ${currentCategory.sampleBn}` : `Includes: ${currentCategory.sampleEn}`}
                </span>
              </div>
            </>
          ) : (
            <div className="trigger-placeholder">
              <Layers size={18} className="placeholder-icon" />
              <span>
                {language === 'bn'
                  ? '-- আপনার ফসলের ধরন নির্বাচন করুন (শস্য, সবজি, ফল, মসলা...) --'
                  : '-- Select Crop Category (Cereals, Vegetables, Fruits, Spices...) --'}
              </span>
            </div>
          )}
        </div>

        <div className="trigger-right">
          {selectedCategory && (
            <span
              className="trigger-clear-btn"
              onClick={handleClear}
              title={language === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
            >
              <X size={15} />
            </span>
          )}
          <ChevronDown size={18} className={`trigger-chevron ${isOpen ? 'rotated' : ''}`} />
        </div>
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="category-dropdown-panel animate-fade-in">
          <div className="dropdown-search-wrapper">
            <Search size={16} className="dropdown-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="dropdown-search-input"
              placeholder={language === 'bn' ? 'ফসলের ধরন খুঁজুন (শস্য, সবজি, ফল, মসলা, তেলবীজ)...' : 'Search category...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          <div className="dropdown-count-strip">
            <span>
              {language === 'bn'
                ? 'নিচের তালিকা থেকে আপনার ফসলের ক্যাটাগরি বেছে নিন:'
                : 'Select your crop category from the list:'}
            </span>
          </div>

          <div className="category-options-list">
            {filteredCategories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`category-option-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(cat.id)}
                >
                  <span className="cat-item-icon">{cat.icon}</span>
                  <div className="cat-item-info">
                    <div className="cat-item-title-row">
                      <strong className="cat-item-title">{language === 'bn' ? cat.nameBn : cat.nameEn}</strong>
                      <span className="cat-item-subtitle-en">({language === 'bn' ? cat.nameEn : cat.nameBn})</span>
                    </div>
                    <span className="cat-item-sample">
                      {language === 'bn' ? cat.sampleBn : cat.sampleEn}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="cat-item-check">
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
