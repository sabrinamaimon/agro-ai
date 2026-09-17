import React, { useState, useMemo } from 'react';
import { Search, X, Check, Sprout, Filter } from 'lucide-react';
import { BANGLADESH_CROPS, CROP_CATEGORIES, POPULAR_BANGLADESH_CROPS } from '../data/bangladeshCrops';

export default function CropSearchSelect({ language, selectedCrop, onSelectCrop }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  // Filter crops based on search query and category
  const filteredCrops = useMemo(() => {
    return BANGLADESH_CROPS.filter(crop => {
      const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
      const queryLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !queryLower || 
        crop.nameBn.includes(queryLower) || 
        crop.nameEn.toLowerCase().includes(queryLower) ||
        crop.commonDiseases.some(d => d.toLowerCase().includes(queryLower));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const popularCropsList = useMemo(() => {
    return BANGLADESH_CROPS.filter(c => POPULAR_BANGLADESH_CROPS.includes(c.id));
  }, []);

  const handleSelect = (crop) => {
    const formatted = `${crop.nameEn} (${crop.nameBn})`;
    onSelectCrop(formatted, crop);
    setIsOpen(false);
  };

  const handleClearSelection = (e) => {
    e.stopPropagation();
    onSelectCrop(null, null);
  };

  return (
    <div className="crop-search-select-wrapper">
      <label className="input-label font-bold text-base mb-2">
        <Sprout size={18} color="#059669" />
        <span>
          {language === 'bn' 
            ? '১. কোন ফসলের রোগ নির্ণয় করতে চান? (ফসল খুঁজুন ও নির্বাচন করুন)' 
            : '1. Select Target Crop to Diagnose (Search & Filter):'}
        </span>
      </label>

      {/* Selected Crop Pill Banner */}
      {selectedCrop ? (
        <div className="selected-crop-banner">
          <div className="selected-crop-info">
            <span className="check-badge"><Check size={16} /></span>
            <span className="selected-text">
              {language === 'bn' ? 'নির্বাচিত ফসল (Target Crop): ' : 'Target Crop: '}
              <strong>{selectedCrop}</strong>
            </span>
          </div>
          <button 
            type="button" 
            className="btn-change-crop"
            onClick={() => setIsOpen(!isOpen)}
          >
            {language === 'bn' ? (isOpen ? 'তালিকা বন্ধ করুন' : 'ফসল পরিবর্তন করুন') : (isOpen ? 'Close' : 'Change Crop')}
          </button>
        </div>
      ) : (
        <div className="no-crop-alert">
          <span>⚠️ {language === 'bn' ? 'সঠিক রোগ নির্ণয়ের জন্য নিচের তালিকা থেকে ফসল নির্বাচন করুন:' : 'Please select your crop below for precise diagnosis:'}</span>
        </div>
      )}

      {/* Popular Quick-Select Chips */}
      <div className="popular-crops-strip mt-2">
        <span className="text-xs text-muted font-semibold">
          {language === 'bn' ? 'জনপ্রিয় ফসল (Quick Select):' : 'Popular Crops:'}
        </span>
        <div className="crop-chips-row">
          {popularCropsList.map(c => {
            const formatted = `${c.nameEn} (${c.nameBn})`;
            const isSelected = selectedCrop === formatted;
            return (
              <button
                type="button"
                key={c.id}
                className={`crop-chip-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelect(c)}
              >
                <span>{c.icon}</span>
                <span>{language === 'bn' ? c.nameBn : c.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Category Filter Box (Shows if isOpen or no crop selected) */}
      {(isOpen || !selectedCrop) && (
        <div className="crop-dropdown-panel mt-3">
          {/* Search Input Bar */}
          <div className="crop-search-input-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="crop-search-input"
              placeholder={language === 'bn' ? 'ফসল খুঁজুন (যেমন: আম, কলা, টমেটো, মরিচ, ধান, লেবু...)' : 'Search crop (e.g. Mango, Banana, Tomato, Chilli, Rice)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="category-tabs-row">
            {CROP_CATEGORIES.map(cat => (
              <button
                type="button"
                key={cat.id}
                className={`cat-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </button>
            ))}
          </div>

          {/* Filtered Crops Grid */}
          <div className="crops-scroll-grid">
            {filteredCrops.length === 0 ? (
              <div className="no-crops-found">
                <p>{language === 'bn' ? `"${searchQuery}" নামে কোনো ফসল পাওয়া যায়নি।` : `No crops found matching "${searchQuery}".`}</p>
              </div>
            ) : (
              filteredCrops.map(crop => {
                const formatted = `${crop.nameEn} (${crop.nameBn})`;
                const isSelected = selectedCrop === formatted;
                return (
                  <div 
                    key={crop.id}
                    className={`crop-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(crop)}
                  >
                    <span className="crop-card-icon">{crop.icon}</span>
                    <div className="crop-card-details">
                      <strong className="crop-card-name">{language === 'bn' ? crop.nameBn : crop.nameEn}</strong>
                      <span className="crop-card-alt">{language === 'bn' ? crop.nameEn : crop.nameBn}</span>
                    </div>
                    {isSelected && <span className="crop-card-check"><Check size={16} /></span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
