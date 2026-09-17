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
            <Navigation size={24} className="text-emerald animate-pulse" />
          </div>
          <div className="gps-header-text">
            <h3>
              {language === 'bn' ? 'তাৎক্ষণিক আবহাওয়া আপডেট' : 'Real-Time Weather Updates'}
            </h3>
            <p>
              {language === 'bn' 
                ? 'আপনার এলাকার তাৎক্ষণিক আবহাওয়ার আপডেট ও সঠিক পূর্বাভাস জানতে জিপিএস চালু করুন।' 
                : 'Enable GPS to receive instant weather updates, rain alerts, and precise spraying guidance for your location.'}
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
              ? (language === 'bn' ? 'বর্তমান অবস্থান খোঁজা হচ্ছে...' : 'Locating your current position...') 
              : activeGps 
                ? (language === 'bn' ? 'বর্তমান অবস্থান সক্রিয় রয়েছে' : 'Location synced successfully') 
                : (language === 'bn' ? 'লোকেশন সনাক্ত করতে নিচের বাটনে চাপুন' : 'Click below to detect location')}
          </span>
        </div>

        {/* Error Alert Strip */}
        {errorMsg && (
          <div className="gps-error-box mt-3">
            <AlertCircle size={20} className="text-danger flex-shrink-0" />
            <div className="gps-error-text">
              <strong>{language === 'bn' ? 'পারমিশন প্রয়োজন:' : 'Permission Required:'}</strong>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Detected Location Box */}
        {activeGps && !isDetecting && (
          <div className="gps-success-box mt-3">
            <div className="success-header">
              <CheckCircle2 size={18} className="text-emerald" />
              <strong>{language === 'bn' ? 'আপনার বর্তমান এলাকা' : 'Your Current Area'}</strong>
            </div>
            <div className="gps-coords-display mt-2">
              <div className="coord-row">
                <span className="coord-label">{language === 'bn' ? 'স্থান:' : 'Location:'}</span>
                <strong className="coord-val area-name">{activeGps.areaName}</strong>
              </div>
              <div className="coord-row">
                <span className="coord-label">{language === 'bn' ? 'কোঅর্ডিনেট:' : 'Coords:'}</span>
                <span className="coord-val">{activeGps.lat?.toFixed(4)}° N, {activeGps.lon?.toFixed(4)}° E</span>
              </div>
              {activeGps.accuracy && (
                <div className="coord-row">
                  <span className="coord-label">{language === 'bn' ? 'নির্ভুল মাত্রা:' : 'Accuracy:'}</span>
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
                ? (language === 'bn' ? 'অবস্থান খোঁজা হচ্ছে...' : 'Detecting Location...') 
                : activeGps 
                  ? (language === 'bn' ? 'অবস্থান আপডেট করুন' : 'Update Location') 
                  : (language === 'bn' ? 'জিপিএস চালু করুন' : 'Enable GPS')}
            </span>
          </button>
          
          <div className="gps-privacy-note mt-2">
            <ShieldCheck size={14} className="text-emerald" />
            <span>
              {language === 'bn' 
                ? 'আপনার অবস্থান সম্পূর্ণ নিরাপদ এবং শুধুমাত্র আবহাওয়ার পূর্বাভাসের জন্য ব্যবহৃত হবে।' 
                : 'Your location is kept secure and used solely for accurate local weather forecasting.'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
