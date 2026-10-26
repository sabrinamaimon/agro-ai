import React from 'react';
import macroLeafImg from '../assets/macro-leaf.jpg';
import furrowedFieldImg from '../assets/furrowed-field.jpg';
import morningDewImg from '../assets/morning-dew-field.jpg';
import goldenWheatImg from '../assets/golden-wheat.jpg';

/**
 * Section-to-Asset & Atmospheric Ambient Mapping
 * Maps each specific sub-module to its assigned asset, glow tones, and gradient scrims.
 */
export const SUBPAGE_ATMOSPHERES = {
  // 1. Crop Health & Disease Scanner / Pest Detection
  task2: {
    key: 'crop-health',
    asset: macroLeafImg,
    alt: 'High-detail green leaf macro texture',
    badgeBn: 'উদ্ভিদ স্বাস্থ্য ও রোগ নির্ণয় স্ক্যানার',
    badgeEn: 'Crop Health & Pathology Lens',
    accentGlow: 'rgba(16, 185, 129, 0.18)', // Emerald / Forest green
    secondaryGlow: 'rgba(5, 150, 105, 0.12)',
    highSunCompensation: false,
    themeTone: 'emerald'
  },
  task1: {
    key: 'crop-health',
    asset: macroLeafImg,
    alt: 'High-detail green leaf macro texture',
    badgeBn: 'ভয়েস ও এআই রোগ ডায়াগনোসিস',
    badgeEn: 'Voice & AI Agro Diagnostic Lens',
    accentGlow: 'rgba(16, 185, 129, 0.18)',
    secondaryGlow: 'rgba(5, 150, 105, 0.12)',
    highSunCompensation: false,
    themeTone: 'emerald'
  },
  aichat: {
    key: 'crop-health',
    asset: macroLeafImg,
    alt: 'High-detail green leaf macro texture',
    badgeBn: 'ভয়েস ও এআই প্রম্পট ল্যাব',
    badgeEn: 'Voice & AI Agro Consultation Hub',
    accentGlow: 'rgba(16, 185, 129, 0.18)',
    secondaryGlow: 'rgba(5, 150, 105, 0.12)',
    highSunCompensation: false,
    themeTone: 'emerald'
  },

  // 2. Soil Analysis & Nutrient Tracking (NPK/Moisture)
  fertilizer: {
    key: 'soil-nutrient',
    asset: furrowedFieldImg,
    alt: 'Plowed agricultural furrowed field rows under open sky',
    badgeBn: 'মাটির পুষ্টি ও সুষম সার পরিমাপক',
    badgeEn: 'Soil Chemistry & NPK Calibration',
    accentGlow: 'rgba(217, 119, 6, 0.15)', // Earth amber / Warm olive
    secondaryGlow: 'rgba(180, 83, 9, 0.12)',
    highSunCompensation: true, // Daytime outdoor open sky compensation
    themeTone: 'amber-earth'
  },

  // 3. Weather Telemetry, Irrigation & Sensor Hub
  task3: {
    key: 'weather-telemetry',
    asset: morningDewImg,
    alt: 'Sunrise field with sparkling dewdrops',
    badgeBn: 'আবহাওয়া টেলিমেট্রি ও স্প্রে রাডার',
    badgeEn: 'Weather Telemetry & Microclimate Radar',
    accentGlow: 'rgba(20, 184, 166, 0.18)', // Soft golden-teal / Morning sky
    secondaryGlow: 'rgba(245, 158, 11, 0.14)',
    highSunCompensation: true, // Sunrise daylight compensation
    themeTone: 'golden-teal'
  },

  // 4. Yield Prediction, Market Advisory & Harvest Planning
  task4: {
    key: 'yield-market',
    asset: goldenWheatImg,
    alt: 'Sunlit ripe golden wheat canopy',
    badgeBn: 'পাইকারি মোকাম ও বাজারদর বুদ্ধিমত্তা',
    badgeEn: 'Mandi Market Intelligence & Pricing',
    accentGlow: 'rgba(245, 158, 11, 0.18)', // Warm golden-hour amber
    secondaryGlow: 'rgba(217, 119, 6, 0.14)',
    highSunCompensation: false,
    themeTone: 'golden-hour'
  },
  task5: {
    key: 'yield-market',
    asset: goldenWheatImg,
    alt: 'Sunlit ripe golden wheat canopy',
    badgeBn: 'সার্টিফাইড ডিজিটাল ক্রপ পাসপোর্ট',
    badgeEn: 'Certified Harvest & Crop Health Passport',
    accentGlow: 'rgba(245, 158, 11, 0.18)',
    secondaryGlow: 'rgba(217, 119, 6, 0.14)',
    highSunCompensation: false,
    themeTone: 'golden-hour'
  }
};

/**
 * AtmosphericBackground Component
 * Renders an optimized, ambient full-bleed backdrop blur with dynamic 
 * gradient scrims and radial glow blobs tailored for each module.
 */
export default function AtmosphericBackground({ activeTab = 'task2' }) {
  const config = SUBPAGE_ATMOSPHERES[activeTab] || SUBPAGE_ATMOSPHERES.task2;

  return (
    <div 
      className="atmospheric-backdrop-shell fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* 1. Full-Bleed Blurred & Color-Calibrated Base Photo */}
      <img
        src={config.asset}
        alt={config.alt}
        className="atmospheric-backdrop-img w-full h-full object-cover scale-105"
      />

      {/* 2. High-Sun / Outdoor Daylight Scrim Compensation */}
      {config.highSunCompensation ? (
        <div className="atmospheric-scrim-highsun" />
      ) : (
        <div className="atmospheric-scrim-standard" />
      )}

      {/* 3. Deep Base Vignette Layer (Aligns with Homepage Theme) */}
      <div className="atmospheric-vignette-base" />

      {/* 4. Top-Right Ambient Radial Glow Blob */}
      <div
        className="atmospheric-glow-top-right"
        style={{
          background: `radial-gradient(circle, ${config.accentGlow} 0%, transparent 68%)`
        }}
      />

      {/* 5. Bottom-Left Ambient Radial Glow Blob */}
      <div
        className="atmospheric-glow-bottom-left"
        style={{
          background: `radial-gradient(circle, ${config.secondaryGlow} 0%, transparent 68%)`
        }}
      />

      {/* 6. Subtle Micro-Atmosphere Grain Scrim */}
      <div className="atmospheric-fine-mesh" />
    </div>
  );
}
