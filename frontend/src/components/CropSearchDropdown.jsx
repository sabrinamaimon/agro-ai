import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Check, ChevronDown, Sprout } from 'lucide-react';
import { BANGLADESH_CROPS, CROP_CATEGORIES } from '../data/bangladeshCrops';

export default function CropSearchDropdown({ language, selectedCrop, onSelectCrop }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Autofocus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Find currently selected crop object
  const currentCropObj = useMemo(() => {
    if (!selectedCrop) return null;
    return BANGLADESH_CROPS.find(c => {
      const formatted = `${c.nameEn} (${c.nameBn})`;
      return formatted === selectedCrop || 
             selectedCrop.toLowerCase().includes(c.id) ||
             selectedCrop.includes(c.nameBn) ||
             selectedCrop.toLowerCase().includes(c.nameEn.toLowerCase());
    });
  }, [selectedCrop]);

  // Filtered crops based on search and category
  const filteredCrops = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return BANGLADESH_CROPS.filter(crop => {
      const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
      const matchesSearch = !query ||
        crop.nameBn.includes(query) ||
        crop.nameEn.toLowerCase().includes(query) ||
        crop.commonDiseases.some(d => d.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelect = (crop) => {
    const formatted = `${crop.nameEn} (${crop.nameBn})`;
    onSelectCrop(formatted, crop);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSelectCrop(null, null);
  };

  return (
    <div className="crop-search-dropdown-container" ref={dropdownRef}>
      {/* Dropdown Trigger Box */}
      <button
        type="button"
        className={`crop-dropdown-trigger ${isOpen ? 'open' : ''} ${selectedCrop ? 'has-value' : 'empty'}`}
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
      >
        <div className="trigger-left">
          {currentCropObj ? (
            <>
              <span className="selected-crop-icon">{currentCropObj.icon}</span>
              <div className="selected-crop-text">
                <span className="crop-main-name">
                  {language === 'bn' ? currentCropObj.nameBn : currentCropObj.nameEn}
                </span>
                <span className="crop-sub-name">
                  ({language === 'bn' ? currentCropObj.nameEn : currentCropObj.nameBn})
                </span>
              </div>
            </>
          ) : (
            <div className="trigger-placeholder">
              <Sprout size={18} className="placeholder-icon" />
              <span>
                {language === 'bn' 
                  ? '-- ফসল নির্বাচন করুন (তালিকা থেকে খুঁজুন) --' 
                  : '-- Select Crop to Diagnose --'}
              </span>
            </div>
          )}
        </div>

        <div className="trigger-right">
          {selectedCrop && (
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

      {/* Floating Search & Selection Modal Menu */}
      {isOpen && (
        <div className="crop-dropdown-panel animate-fade-in">
          {/* Header & Search Field */}
          <div className="dropdown-search-wrapper">
            <Search size={17} className="dropdown-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="dropdown-search-input"
              placeholder={language === 'bn' ? 'ফসল খুঁজুন (আম, ধান, টমেটো, মরিচ, বেগুন, কলা...)' : 'Search crop (Mango, Rice, Tomato, Chilli...)'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="dropdown-category-strip">
            {CROP_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`cat-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </button>
            ))}
          </div>

          {/* Results Count Strip */}
          <div className="dropdown-count-strip">
            <span>
              {language === 'bn' 
                ? `${filteredCrops.length} টি ফসল উপলব্ধ` 
                : `${filteredCrops.length} crops available`}
            </span>
          </div>

          {/* Crops List */}
          <div className="dropdown-crops-list">
            {filteredCrops.length === 0 ? (
              <div className="dropdown-empty-state">
                <p>
                  {language === 'bn' 
                    ? `"${searchQuery}" নামে কোনো ফসল পাওয়া যায়নি।` 
                    : `No crops found matching "${searchQuery}".`}
                </p>
              </div>
            ) : (
              filteredCrops.map(crop => {
                const formatted = `${crop.nameEn} (${crop.nameBn})`;
                const isSelected = selectedCrop === formatted || 
                                   (currentCropObj && currentCropObj.id === crop.id);
                return (
                  <div
                    key={crop.id}
                    className={`dropdown-crop-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(crop)}
                  >
                    <span className="crop-item-icon">{crop.icon}</span>
                    <div className="crop-item-labels">
                      <strong className="crop-item-bn">{language === 'bn' ? crop.nameBn : crop.nameEn}</strong>
                      <span className="crop-item-en">{language === 'bn' ? crop.nameEn : crop.nameBn}</span>
                    </div>
                    {isSelected && (
                      <span className="crop-item-check">
                        <Check size={16} />
                      </span>
                    )}
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
