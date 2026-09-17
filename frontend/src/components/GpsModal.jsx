import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, X, AlertCircle, CheckCircle2, RefreshCw, Satellite, ShieldCheck, Compass } from 'lucide-react';
import { fetchWeatherAdvisory } from '../services/api';

export default function GpsModal({ isOpen, onClose, currentGps, onGpsDetected, language }) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [detectedData, setDetectedData] = useState(null);

  useEffect(() => {
    if (isOpen && !currentGps) {
      handleDetectGps();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setErrorMsg(
        language === 'bn' 
          ? 'আপনার ব্রাউজার বা ডিভাইসে জিপিএস সমর্থন করে না।' 
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }

    setIsDetecting(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        try {
          // Immediately fetch hyper-local reverse geocode & weather data from backend
          const weather = await fetchWeatherAdvisory('GPS', language, latitude, longitude);
          const gpsObj = {
            lat: latitude,
            lon: longitude,
            accuracy: Math.round(accuracy),
            areaName: weather.city || `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
            areaNameEn: weather.cityEn || `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
            union: weather.union || '',
            upazila: weather.upazila || '',
            district: weather.district || '',
            isGps: true,
            timestamp: Date.now()
          };
          setDetectedData(gpsObj);
          setIsDetecting(false);
          onGpsDetected(gpsObj);
          setTimeout(() => {
            onClose();
          }, 1200);
        } catch (err) {
          console.warn('Backend geocode error:', err);
          const gpsObj = {
            lat: latitude,
            lon: longitude,
            accuracy: Math.round(accuracy),
            areaName: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
            areaNameEn: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
            isGps: true,
            timestamp: Date.now()
          };
          setDetectedData(gpsObj);
          setIsDetecting(false);
          onGpsDetected(gpsObj);
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      },
      (err) => {
        setIsDetecting(false);
        console.warn('Geolocation error:', err);
        if (err.code === 1) { // PERMISSION_DENIED
          setErrorMsg(
            language === 'bn'
              ? 'লোকেশন পারমিশন ব্লক করা আছে। ব্রাউজারের অ্যাড্রেস বারের তালা (🔒) আইকনে ক্লিক করে Location ' +
                '"Allow" বা অনুমোদন করুন।'
              : 'Location permission denied. Please allow location access from your browser address bar (🔒).'
          );
        } else if (err.code === 2) { // POSITION_UNAVAILABLE
          setErrorMsg(
            language === 'bn'
              ? 'ডিভাইসের জিপিএস সিগন্যাল পাওয়া যাচ্ছে না। ফোনের লোকেশন/GPS অন আছে কিনা নিশ্চিত করুন।'
              : 'GPS position unavailable. Please ensure your device GPS/location is turned on.'
          );
        } else {
          setErrorMsg(
            language === 'bn'
              ? 'জিপিএস সংযোগে সময় শেষ হয়ে গেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
              : 'GPS request timed out. Please try again.'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const activeGps = detectedData || currentGps;

  return (
    <div className="location-modal-backdrop animate-fade-in" onClick={activeGps ? onClose : undefined}>
      <div className="gps-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="gps-modal-header">
          <div className="gps-radar-icon-box">
            <Satellite size={24} className="text-emerald animate-pulse" />
          </div>
          <div className="gps-header-text">
            <h3>
              {language === 'bn' ? 'হাইপারলোকাল জিপিএস ফিল্ড লোকেশন' : 'Hyperlocal GPS Field Location'}
            </h3>
            <p>
              {language === 'bn' 
                ? 'একই জেলার ভেতরেও কয়েক কিলোমিটার দূরত্বে আবহাওয়া ভিন্ন হতে পারে। আপনার ফসলের মাঠের সঠিক মাইক্রোক্লাইমেট পূর্বাভাসের জন্য সরাসরি স্যাটেলাইট জিপিএস প্রয়োজন।' 
                : 'Weather varies across micro-regions. Real-time satellite GPS delivers accurate field-level microclimate forecasts.'}
            </p>
          </div>
          {activeGps && (
            <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Radar Visual */}
        <div className="gps-radar-visual mt-3">
          <div className={`radar-scanner-circle ${isDetecting ? 'scanning' : ''}`}>
            <div className="radar-sweep" />
            <div className="radar-center-dot">
              <Navigation size={22} className={isDetecting ? 'spin' : ''} />
            </div>
          </div>
          <span className="gps-radar-caption">
            {isDetecting 
              ? (language === 'bn' ? 'স্যাটেলাইট থেকে মাঠের সঠিক কোঅর্ডিনেট নেওয়া হচ্ছে...' : 'Acquiring pinpoint satellite GPS coordinates...') 
              : activeGps 
                ? (language === 'bn' ? 'জিপিএস সফলভাবে সক্রিয় রয়েছে' : 'GPS Location Active & Synced') 
                : (language === 'bn' ? 'ফিল্ড জিপিএস সেন্সর প্রস্তুত' : 'Ready to calibrate GPS sensor')}
          </span>
        </div>

        {/* Error Alert Strip */}
        {errorMsg && (
          <div className="gps-error-box mt-3">
            <AlertCircle size={20} className="text-danger flex-shrink-0" />
            <div className="gps-error-text">
              <strong>{language === 'bn' ? 'পারমিশন সমস্যা:' : 'Permission Notice:'}</strong>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Detected Location Box */}
        {activeGps && !isDetecting && (
          <div className="gps-success-box mt-3">
            <div className="success-header">
              <CheckCircle2 size={18} className="text-emerald" />
              <strong>{language === 'bn' ? 'মাঠের রিয়েল-টাইম জিপিএস তথ্য' : 'Verified Field Coordinates'}</strong>
            </div>
            <div className="gps-coords-display mt-2">
              <div className="coord-row">
                <span className="coord-label">{language === 'bn' ? 'অবস্থান:' : 'Area:'}</span>
                <strong className="coord-val area-name">{activeGps.areaName}</strong>
              </div>
              <div className="coord-row">
                <span className="coord-label">{language === 'bn' ? 'কোঅর্ডিনেট:' : 'Coords:'}</span>
                <span className="coord-val">{activeGps.lat?.toFixed(5)}° N, {activeGps.lon?.toFixed(5)}° E</span>
              </div>
              {activeGps.accuracy && (
                <div className="coord-row">
                  <span className="coord-label">{language === 'bn' ? 'নিখুঁত মাত্রা:' : 'Accuracy:'}</span>
                  <span className="coord-val accuracy-badge">±{activeGps.accuracy} {language === 'bn' ? 'মিটার' : 'meters'}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="gps-actions-wrapper mt-4">
          <button
            type="button"
            className="btn-gps-primary"
            onClick={handleDetectGps}
            disabled={isDetecting}
          >
            <RefreshCw size={18} className={isDetecting ? 'spin' : ''} />
            <span>
              {isDetecting 
                ? (language === 'bn' ? 'জিপিএস শনাক্ত করা হচ্ছে...' : 'Detecting GPS...') 
                : activeGps 
                  ? (language === 'bn' ? 'মাঠের অবস্থান পুনরায় আপডেট করুন' : 'Refresh / Recalibrate Field GPS') 
                  : (language === 'bn' ? 'জিপিএস দিয়ে অবস্থান শনাক্ত করুন' : 'Detect Current GPS Location')}
            </span>
          </button>
          
          <div className="gps-privacy-note mt-2">
            <ShieldCheck size={14} className="text-emerald" />
            <span>
              {language === 'bn' 
                ? 'আপনার জিপিএস শুধুমাত্র ব্রাউজারে সংরক্ষিত থাকে এবং কেবল আবহাওয়া পূর্বাভাসের জন্য ব্যবহৃত হয়।' 
                : 'Coordinates are stored securely in your browser exclusively for hyperlocal forecasts.'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
