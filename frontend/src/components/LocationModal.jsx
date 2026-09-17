import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, Search, X, Check, Globe, Sparkles } from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshDistricts';

export default function LocationModal({ isOpen, onClose, currentLocation, onSelectLocation, language }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  const filteredDistricts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return BANGLADESH_DISTRICTS;
    return BANGLADESH_DISTRICTS.filter(d => 
      d.nameBn.includes(q) || 
      d.nameEn.toLowerCase().includes(q) ||
      d.divisionBn.includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleAutoDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsError(language === 'bn' ? 'আপনার ব্রাউজারে জিপিএস সমর্থন করে না।' : 'Geolocation not supported by browser.');
      return;
    }

    setIsDetectingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Find closest district in BD
        let closest = BANGLADESH_DISTRICTS[0];
        let minDist = Infinity;
        for (const dist of BANGLADESH_DISTRICTS) {
          const d = Math.hypot(dist.lat - latitude, dist.lon - longitude);
          if (d < minDist) {
            minDist = d;
            closest = dist;
          }
        }

        const detectedLoc = {
          id: closest.id,
          nameBn: `${closest.nameBn} (বর্তমান জিপিএস অবস্থান)`,
          nameEn: `${closest.nameEn} (Current GPS)`,
          divisionBn: closest.divisionBn,
          lat: latitude,
          lon: longitude,
          isGps: true
        };

        setIsDetectingGps(false);
        onSelectLocation(detectedLoc);
        onClose();
      },
      (error) => {
        setIsDetectingGps(false);
        console.warn('Geolocation error:', error);
        setGpsError(language === 'bn' 
          ? 'লোকেশন পারমিশন পাওয়া যায়নি। নিচের তালিকা থেকে আপনার জেলা নির্বাচন করুন।' 
          : 'Location permission denied. Please select your district below.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectDistrict = (district) => {
    const selected = {
      id: district.id,
      nameBn: `${district.nameBn} সদর, ${district.nameBn}`,
      nameEn: `${district.nameEn} Sadar, ${district.nameEn}`,
      divisionBn: district.divisionBn,
      lat: district.lat,
      lon: district.lon,
      isGps: false
    };
    onSelectLocation(selected);
    onClose();
  };

  return (
    <div className="location-modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="location-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="location-modal-header">
          <div className="header-icon-box">
            <MapPin size={22} className="text-emerald" />
          </div>
          <div className="header-text-group">
            <h3 className="location-modal-title">
              {language === 'bn' ? 'আপনার এলাকা বা জেলা নির্বাচন করুন' : 'Select Your Farming Location'}
            </h3>
            <p className="location-modal-subtitle">
              {language === 'bn' 
                ? 'সঠিক আবহাওয়া পূর্বাভাস, স্প্রে নিরাপত্তা ও সেচ পরামর্শের জন্য আপনার অবস্থান নির্ধারণ করুন' 
                : 'Set location for hyperlocal weather forecasts, spraying alerts, and irrigation advisory'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* GPS Auto-Detect Button */}
        <div className="gps-action-wrapper mt-3">
          <button
            type="button"
            className="btn-gps-detect"
            onClick={handleAutoDetectGps}
            disabled={isDetectingGps}
          >
            <Navigation size={18} className={isDetectingGps ? 'spin' : ''} />
            <div className="btn-gps-text">
              <strong>
                {isDetectingGps 
                  ? (language === 'bn' ? 'জিপিএস দিয়ে অবস্থান খোঁজা হচ্ছে...' : 'Detecting GPS location...') 
                  : (language === 'bn' ? 'বর্তমান লোকেশন অটো-ডিটেক্ট করুন' : 'Auto-Detect Current Location (GPS)')}
              </strong>
              <span>
                {language === 'bn' ? 'ডিভাইসের জিপিএস ব্যবহার করে স্বয়ংক্রিয় শনাক্তকরণ' : 'Use browser GPS sensor for pinpoint accuracy'}
              </span>
            </div>
          </button>

          {gpsError && (
            <div className="gps-error-pill mt-2">
              <span>{gpsError}</span>
            </div>
          )}
        </div>

        <div className="modal-divider mt-3">
          <span>{language === 'bn' ? 'অথবা জেলা তালিকা থেকে খুঁজুন' : 'Or choose from district list'}</span>
        </div>

        {/* District Search Bar */}
        <div className="district-search-bar mt-2">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="district-search-input"
            placeholder={language === 'bn' ? 'জেলা খুঁজুন (যেমন: রংপুর, বগুড়া, দিনাজপুর, ঢাকা, যশোর)...' : 'Search district...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button type="button" className="clear-btn" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Districts Grid / List */}
        <div className="districts-list-container mt-2">
          {filteredDistricts.map(dist => {
            const isSelected = currentLocation?.id === dist.id;
            return (
              <div
                key={dist.id}
                className={`district-item-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectDistrict(dist)}
              >
                <div className="district-info">
                  <strong className="dist-name-bn">{language === 'bn' ? dist.nameBn : dist.nameEn}</strong>
                  <span className="dist-division">
                    {language === 'bn' ? `${dist.divisionBn} বিভাগ` : `${dist.nameEn} Division`}
                  </span>
                </div>
                {isSelected && (
                  <span className="dist-check">
                    <Check size={16} />
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
