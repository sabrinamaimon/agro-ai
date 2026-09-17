import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Leaf, 
  FlaskConical, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  RefreshCw, 
  ShieldAlert, 
  Sun, 
  Sparkles, 
  ChevronRight, 
  Camera,
  Calendar,
  Waves,
  Navigation
} from 'lucide-react';
import { fetchWeatherAdvisory } from '../services/api';

export default function AdvisoryPanel({ 
  language, 
  diagnosis, 
  gpsLocation, 
  onOpenGpsModal, 
  setActiveTab 
}) {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const loadWeather = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const lat = gpsLocation?.lat;
      const lon = gpsLocation?.lon;
      const data = await fetchWeatherAdvisory('GPS', language, lat, lon);
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to load weather advisory:', err);
      setFetchError(language === 'bn' ? 'আবহাওয়া তথ্য লোড করতে সমস্যা হয়েছে।' : 'Failed to load weather data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [gpsLocation, language]);

  const locationDisplay = gpsLocation?.areaName 
    ? gpsLocation.areaName
    : (weatherData?.city || (gpsLocation ? `${gpsLocation.lat?.toFixed(4)}° N, ${gpsLocation.lon?.toFixed(4)}° E` : (language === 'bn' ? 'মাঠের জিপিএস চালু করুন' : 'Enable Field GPS')));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'safe':
      case 'favorable':
        return {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          text: '#065F46',
          label: language === 'bn' ? 'অনুকূল ও নিরাপদ' : 'Favorable / Safe',
          icon: CheckCircle
        };
      case 'warning':
      case 'caution':
      case 'irrigate':
      case 'medium':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          text: '#92400E',
          label: language === 'bn' ? 'সতর্কতা প্রয়োজন' : 'Caution Advised',
          icon: AlertTriangle
        };
      case 'danger':
      case 'pause':
      case 'high':
        return {
          bg: '#FEF2F2',
          border: '#FECACA',
          text: '#991B1B',
          label: language === 'bn' ? 'উচ্চ ঝুঁকি / স্থগিত রাখুন' : 'High Risk / Hold Off',
          icon: ShieldAlert
        };
      default:
        return {
          bg: '#F3F4F6',
          border: '#E5E7EB',
          text: '#374151',
          label: language === 'bn' ? 'স্বাভাবিক' : 'Normal',
          icon: CheckCircle
        };
    }
  };

  return (
    <div className="card task-card weather-panel-container animate-fade-in">
      {/* Top Header with GPS Calibrate and Refresh */}
      <div className="weather-panel-header">
        <div className="header-title-block">
          <h2>
            {language === 'bn' 
              ? 'মাঠের কৃষি আবহাওয়া ও পূর্বাভাস' 
              : 'Field Agro Weather & Advisory'}
          </h2>
          <p className="header-desc">
            {language === 'bn' 
              ? 'আপনার ফসলের মাঠের তাৎক্ষণিক আবহাওয়া ও সঠিক কৃষি পরামর্শ' 
              : 'Real-time field weather forecasts and crop care advisory'}
          </p>
        </div>

        <div className="header-actions-block">
          <button 
            type="button" 
            className="location-selector-btn"
            onClick={onOpenGpsModal}
            title={language === 'bn' ? 'বর্তমান অবস্থান পরিবর্তন করুন' : 'Change Location'}
          >
            <Navigation size={16} className="text-emerald" />
            <span className="location-btn-text">{locationDisplay}</span>
            <span className="location-change-tag">
              {gpsLocation ? (language === 'bn' ? 'জিপিএস পরিবর্তন' : 'GPS') : (language === 'bn' ? 'জিপিএস চালু করুন' : 'Enable GPS')}
            </span>
          </button>

          <button 
            type="button" 
            className="refresh-btn" 
            onClick={loadWeather} 
            disabled={isLoading}
            title={language === 'bn' ? 'রিফ্রেশ করুন' : 'Refresh Weather'}
          >
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* GPS Notice Banner if GPS is not yet enabled */}
      {!gpsLocation && (
        <div className="gps-notice-banner mt-3" onClick={onOpenGpsModal}>
          <div className="notice-left">
            <Navigation size={22} className="text-emerald animate-pulse" />
            <div className="notice-text">
              <strong>{language === 'bn' ? 'তাৎক্ষণিক আবহাওয়ার আপডেট জানতে আপনার জিপিএস চালু করুন' : 'Enable GPS for real-time weather updates'}</strong>
              <p>
                {language === 'bn' 
                  ? 'আপনার এলাকার সঠিক তাপমাত্রা, বৃষ্টিপাত ও স্প্রে করার উপযুক্ত সময় জানতে জিপিএস চালু করুন।' 
                  : 'Get accurate local rainfall, temperature, and spray advisory for your field.'}
              </p>
            </div>
          </div>
          <button type="button" className="btn-activate-gps">
            <Navigation size={15} />
            <span>{language === 'bn' ? 'জিপিএস চালু করুন' : 'Enable GPS'}</span>
          </button>
        </div>
      )}

      {isLoading && !weatherData && (
        <div className="weather-loading-skeleton mt-3">
          <div className="skeleton-loader-text">
            <RefreshCw size={24} className="spin text-emerald" />
            <span>{language === 'bn' ? 'আবহাওয়া তথ্য লোড হচ্ছে...' : 'Loading weather data...'}</span>
          </div>
        </div>
      )}

      {fetchError && !weatherData && (
        <div className="alert-strip warning mt-3">
          <AlertTriangle size={18} />
          <span>{fetchError}</span>
          <button type="button" className="btn-retry" onClick={loadWeather}>
            {language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
          </button>
        </div>
      )}

      {weatherData && (
        <>
          {/* Location Badge */}
          <div className="microclimate-field-badge mt-3">
            <div className="badge-left">
              <MapPin size={16} className="text-emerald" />
              <span className="badge-title">
                {language === 'bn' ? 'বর্তমান অবস্থান:' : 'Current Location:'}
              </span>
              <strong className="badge-coords">
                {weatherData.lat?.toFixed(4)}° N, {weatherData.lon?.toFixed(4)}° E
              </strong>
            </div>
            <span className="badge-subtext">
              {language === 'bn' 
                ? 'আপনার এলাকার তাৎক্ষণিক আবহাওয়ার সরাসরি আপডেট' 
                : 'Direct real-time weather updates for your area'}
            </span>
          </div>

          {/* Main Weather Hero Card */}
          <div className="weather-hero-card mt-2">
            <div className="hero-left">
              <div className="weather-icon-large">
                <span className="emoji-icon">{weatherData.conditionIcon || '⛅'}</span>
              </div>
              <div className="weather-main-details">
                <div className="temp-row">
                  <span className="current-temp">{weatherData.temperature}°C</span>
                  <span className="feels-like">
                    {language === 'bn' 
                      ? `অনুভূত হচ্ছে: ${weatherData.feelsLike}°C` 
                      : `Feels like: ${weatherData.feelsLike}°C`}
                  </span>
                </div>
                <h4 className="weather-condition-title">{weatherData.condition}</h4>
                <p className="weather-rain-forecast">
                  <CloudRain size={15} />
                  <span>{weatherData.rainForecast}</span>
                </p>
              </div>
            </div>

            <div className="hero-right-stats">
              <div className="stat-box">
                <div className="stat-label">
                  <Droplets size={16} className="text-blue" />
                  <span>{language === 'bn' ? 'আর্দ্রতা' : 'Humidity'}</span>
                </div>
                <strong className="stat-value">{weatherData.humidity}%</strong>
                <span className="stat-sub">{weatherData.humidity >= 80 ? (language === 'bn' ? 'উচ্চ' : 'High') : (language === 'bn' ? 'স্বাভাবিক' : 'Normal')}</span>
              </div>

              <div className="stat-box">
                <div className="stat-label">
                  <Wind size={16} className="text-teal" />
                  <span>{language === 'bn' ? 'বাতাসের গতি' : 'Wind Speed'}</span>
                </div>
                <strong className="stat-value">{weatherData.windSpeed} <small>কিমি/ঘণ্টা</small></strong>
                <span className="stat-sub">{weatherData.windSpeed > 15 ? (language === 'bn' ? 'দমকা' : 'Gusty') : (language === 'bn' ? 'শান্ত' : 'Calm')}</span>
              </div>

              <div className="stat-box">
                <div className="stat-label">
                  <Clock size={16} className="text-purple" />
                  <span>{language === 'bn' ? 'আপডেট সময়' : 'Updated'}</span>
                </div>
                <strong className="stat-value">{weatherData.updatedAt || 'এখন'}</strong>
                <span className="stat-sub">{language === 'bn' ? 'লাইভ ডাটা' : 'Live Data'}</span>
              </div>
            </div>
          </div>

          {/* 4 Agricultural Intelligence Advisories */}
          <div className="agro-advisories-section mt-4">
            <h3 className="section-title">
              <Sparkles size={20} className="text-emerald" />
              <span>{language === 'bn' ? 'জরুরি মাঠ পর্যায়ের কৃষি নির্দেশনা' : 'Critical Field Agronomic Advisories'}</span>
            </h3>

            <div className="agro-cards-grid mt-3">
              {/* 1. Spray Safety Advisory */}
              {weatherData.advisories?.spray && (() => {
                const spray = weatherData.advisories.spray;
                const badge = getStatusBadge(spray.status);
                const BadgeIcon = badge.icon;
                return (
                  <div key="spray" className={`advisory-card status-${spray.status}`}>
                    <div className="card-top">
                      <div className="advisory-title-group">
                        <CloudRain size={20} className="card-icon" />
                        <h4>{spray.title}</h4>
                      </div>
                      <span 
                        className="status-pill"
                        style={{ backgroundColor: badge.bg, borderColor: badge.border, color: badge.text }}
                      >
                        <BadgeIcon size={13} />
                        {badge.label}
                      </span>
                    </div>
                    <p className="advisory-desc">{spray.desc}</p>
                    <div className="advisory-footer">
                      <span className="footer-tag">
                        {language === 'bn' ? 'বাতাস: ' : 'Wind: '}{weatherData.windSpeed} কিমি/ঘণ্টা
                      </span>
                      <span className="footer-tag">
                        {language === 'bn' ? 'বৃষ্টির ঝুঁকি: ' : 'Rain Risk: '}
                        {weatherData.rainInHours > 0 && weatherData.rainInHours <= 6 
                          ? (language === 'bn' ? `${weatherData.rainInHours} ঘণ্টার মধ্যে` : `In ${weatherData.rainInHours} hrs`)
                          : (language === 'bn' ? 'নেই' : 'Low')}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* 2. Irrigation Advisory */}
              {weatherData.advisories?.irrigation && (() => {
                const irr = weatherData.advisories.irrigation;
                const badge = getStatusBadge(irr.status);
                const BadgeIcon = badge.icon;
                return (
                  <div key="irrigation" className={`advisory-card status-${irr.status}`}>
                    <div className="card-top">
                      <div className="advisory-title-group">
                        <Waves size={20} className="card-icon" />
                        <h4>{irr.title}</h4>
                      </div>
                      <span 
                        className="status-pill"
                        style={{ backgroundColor: badge.bg, borderColor: badge.border, color: badge.text }}
                      >
                        <BadgeIcon size={13} />
                        {badge.label}
                      </span>
                    </div>
                    <p className="advisory-desc">{irr.desc}</p>
                    <div className="advisory-footer">
                      <span className="footer-tag">
                        {language === 'bn' ? 'মাটির আর্দ্রতা চাহিদা' : 'Moisture Need'}
                      </span>
                      <span className="footer-tag">
                        {language === 'bn' ? '৪৮ ঘণ্টার বৃষ্টিপাত পর্যবেক্ষণ' : '48h Rain Radar'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* 3. Harvesting & Drying Advisory */}
              {weatherData.advisories?.harvestDrying && (() => {
                const hrv = weatherData.advisories.harvestDrying;
                const badge = getStatusBadge(hrv.status);
                const BadgeIcon = badge.icon;
                return (
                  <div key="harvest" className={`advisory-card status-${hrv.status}`}>
                    <div className="card-top">
                      <div className="advisory-title-group">
                        <Sun size={20} className="card-icon" />
                        <h4>{hrv.title}</h4>
                      </div>
                      <span 
                        className="status-pill"
                        style={{ backgroundColor: badge.bg, borderColor: badge.border, color: badge.text }}
                      >
                        <BadgeIcon size={13} />
                        {badge.label}
                      </span>
                    </div>
                    <p className="advisory-desc">{hrv.desc}</p>
                    <div className="advisory-footer">
                      <span className="footer-tag">
                        {language === 'bn' ? 'রোদে শুকানোর সুযোগ' : 'Sun Drying Viability'}
                      </span>
                      <span className="footer-tag">
                        {language === 'bn' ? 'মাড়াই ও গুদামজাতকরণ' : 'Threshing & Storage'}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* 4. Disease Hazard Index */}
              {weatherData.advisories?.diseaseRisk && (() => {
                const dis = weatherData.advisories.diseaseRisk;
                const badge = getStatusBadge(dis.status);
                const BadgeIcon = badge.icon;
                return (
                  <div key="diseaseRisk" className={`advisory-card status-${dis.status}`}>
                    <div className="card-top">
                      <div className="advisory-title-group">
                        <ShieldAlert size={20} className="card-icon" />
                        <h4>{dis.title}</h4>
                      </div>
                      <span 
                        className="status-pill"
                        style={{ backgroundColor: badge.bg, borderColor: badge.border, color: badge.text }}
                      >
                        <BadgeIcon size={13} />
                        {badge.label}
                      </span>
                    </div>
                    <p className="advisory-desc">{dis.desc}</p>
                    <div className="advisory-footer">
                      <span className="footer-tag">
                        {language === 'bn' ? 'আর্দ্রতা: ' : 'RH: '}{weatherData.humidity}%
                      </span>
                      <span className="footer-tag">
                        {language === 'bn' ? 'ছত্রাক স্পোর বিস্তার অনুকূল' : 'Fungal Proliferation'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 24-Hour Hourly Weather Strip */}
          {weatherData.hourlyForecast && weatherData.hourlyForecast.length > 0 && (
            <div className="hourly-forecast-section mt-4">
              <div className="section-header-sub">
                <h4>
                  <Clock size={18} className="text-emerald" />
                  <span>{language === 'bn' ? 'আগামী ২৪ ঘণ্টার আবহাওয়া পরিক্রমা' : 'Next 24 Hours Agro Timeline'}</span>
                </h4>
                <span className="scroll-hint-text">
                  {language === 'bn' ? 'স্ক্রোল করুন ➔' : 'Scroll ➔'}
                </span>
              </div>

              <div className="hourly-strip-scroll">
                {weatherData.hourlyForecast.map((hour, idx) => (
                  <div key={idx} className="hourly-card">
                    <span className="hour-time">{hour.time}</span>
                    <span className="hour-icon">{hour.icon}</span>
                    <strong className="hour-temp">{hour.temp}°</strong>
                    <div className="hour-meta">
                      <span className="hour-rain" title="বৃষ্টির সম্ভাবনা">
                        <CloudRain size={12} />
                        {hour.rainProb}%
                      </span>
                      <span className="hour-hum" title="আর্দ্রতা">
                        <Droplets size={12} />
                        {hour.humidity}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5-Day Agro Daily Forecast */}
          {weatherData.dailyForecast && weatherData.dailyForecast.length > 0 && (
            <div className="daily-forecast-section mt-4">
              <div className="section-header-sub">
                <h4>
                  <Calendar size={18} className="text-emerald" />
                  <span>{language === 'bn' ? 'আগামী ৫ দিনের কৃষি আবহাওয়া পূর্বাভাস' : '5-Day Agricultural Weather Forecast'}</span>
                </h4>
              </div>

              <div className="daily-grid-cards">
                {weatherData.dailyForecast.map((day, idx) => (
                  <div key={idx} className={`daily-card ${idx === 0 ? 'today' : ''}`}>
                    <div className="daily-card-header">
                      <strong className="day-name">{day.day}</strong>
                      <span className="day-date">{day.date.split('-').slice(1).join('/')}</span>
                    </div>
                    <div className="daily-icon-wrap">
                      <span className="daily-icon">{day.icon}</span>
                      <span className="daily-condition">{day.condition}</span>
                    </div>
                    <div className="daily-temp-row">
                      <span className="max-temp">{day.maxTemp}°C</span>
                      <span className="min-temp">{day.minTemp}°C</span>
                    </div>
                    <div className="daily-rain-row">
                      <span className="daily-rain-prob">
                        <CloudRain size={13} />
                        {day.rainProb}% {language === 'bn' ? 'বৃষ্টির সম্ভাবনা' : 'Rain'}
                      </span>
                      {day.precipMm > 0 && (
                        <span className="daily-precip-sum">
                          {day.precipMm} {language === 'bn' ? 'মিমি' : 'mm'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Crop Disease Treatment Section */}
          {diagnosis ? (
            <div className="diagnosis-treatment-box mt-4">
              <div className="diagnosis-box-header">
                <Leaf size={20} className="text-emerald" />
                <div>
                  <h4>
                    {language === 'bn' 
                      ? `শনাক্তকৃত রোগ: ${diagnosis.name} (${diagnosis.cropType || 'ফসলের চিকিৎসা'})` 
                      : `Target Diagnosis: ${diagnosis.name}`}
                  </h4>
                  <p className="subtext">
                    {language === 'bn' 
                      ? 'বর্তমান আবহাওয়ার ওপর ভিত্তি করে সুনির্দিষ্ট জৈব ও রাসায়নিক প্রতিকার ব্যবস্থা' 
                      : 'Weather-aligned organic & chemical treatment instructions'}
                  </p>
                </div>
              </div>

              <div className="grid-2 mt-3">
                <div className="remedy-card organic">
                  <div className="remedy-title">
                    <Leaf size={18} color="#10B981" />
                    <span>{language === 'bn' ? 'জৈব বা প্রাকৃতিক প্রতিকার (Organic Control)' : 'Non-Chemical Organic Control'}</span>
                  </div>
                  <p>{diagnosis.organicRemedy}</p>
                </div>

                <div className="remedy-card chemical">
                  <div className="remedy-title">
                    <FlaskConical size={18} color="#3B82F6" />
                    <span>{language === 'bn' ? 'রাসায়নিক স্প্রে মাত্রা (Chemical Dosage)' : 'Chemical Dosage & Spray'}</span>
                  </div>
                  <p>{diagnosis.chemicalRemedy}</p>
                </div>
              </div>

              <div className="safety-schedule-box mt-3">
                <div className="schedule-header">
                  <Clock size={18} color="#EF4444" />
                  <span>{language === 'bn' ? 'আবহাওয়া-সামঞ্জস্যপূর্ণ স্প্রে সতর্কতা' : 'Weather-Adjusted Spray Alert'}</span>
                </div>
                <div className="alert-strip warning">
                  <AlertTriangle size={18} />
                  <span>{diagnosis.sprayAdvice || weatherData.spraySafety}</span>
                </div>
                {diagnosis.phiDays && (
                  <div className="phi-badge mt-2">
                    <CheckCircle size={16} color="#10B981" />
                    <span>
                      PHI (Pre-Harvest Interval): <strong>{diagnosis.phiDays} {language === 'bn' ? 'দিন ফসল কাটা নিষেধ' : 'Days mandatory waiting time before harvest'}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="scan-invitation-banner mt-4">
              <div className="invite-content">
                <div className="invite-icon">
                  <Camera size={26} className="text-emerald" />
                </div>
                <div className="invite-text">
                  <h4>{language === 'bn' ? 'আপনার ফসলে কোনো রোগবালাই দেখা দিচ্ছে?' : 'Noticing symptoms on your crops?'}</h4>
                  <p>
                    {language === 'bn' 
                      ? 'আক্রান্ত পাতা, কাণ্ড বা ফলের ছবি স্ক্যান করুন। তাৎক্ষণিক এআই রোগ নির্ণয় ও আবহাওয়ার সাথে সামঞ্জস্যপূর্ণ সঠিক স্প্রে প্রেসক্রিপশন পান।' 
                      : 'Scan affected leaves, stems, or fruits for instant AI diagnosis and weather-synchronized spray prescriptions.'}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-scan-action"
                onClick={() => setActiveTab && setActiveTab('task2')}
              >
                <span>{language === 'bn' ? 'রোগ নির্ণয় করুন' : 'Diagnose Crop Now'}</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

