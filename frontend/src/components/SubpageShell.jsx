import React from 'react';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import AtmosphericBackground, { SUBPAGE_ATMOSPHERES } from './AtmosphericBackground';

/**
 * SubpageShell
 * Unified layout shell wrapping every sub-module view.
 * Dynamically provides the contextual atmospheric backdrop blur,
 * high-sun daylight compensation, ambient radial glow blobs,
 * and high-contrast glassmorphic foundation.
 */
export default function SubpageShell({
  children,
  activeTab = 'task2',
  language = 'bn',
  setActiveTab
}) {
  const config = SUBPAGE_ATMOSPHERES[activeTab] || SUBPAGE_ATMOSPHERES.task2;

  const getToneColor = (tone) => {
    switch (tone) {
      case 'amber-earth':
        return '#F59E0B';
      case 'golden-teal':
        return '#14B8A6';
      case 'golden-hour':
        return '#F59E0B';
      case 'emerald':
      default:
        return '#10B981';
    }
  };

  const accentColor = getToneColor(config.themeTone);

  return (
    <div className="subpage-shell-wrapper">
      {/* 1. Dynamic Contextual Atmospheric Backdrop */}
      <AtmosphericBackground activeTab={activeTab} />

      {/* 2. Sleek Ambient Telemetry Ribbon */}
      <aside className="subpage-telemetry-ribbon animate-fade-in" aria-label="Section Telemetry">
        <div className="telemetry-ribbon-inner">
          <div className="telemetry-badge-cluster">
            <span 
              className="telemetry-live-dot"
              style={{ 
                backgroundColor: accentColor,
                boxShadow: `0 0 10px ${accentColor}`
              }}
            />
            <span className="telemetry-category-title font-mono">
              {language === 'bn' ? config.badgeBn : config.badgeEn}
            </span>
          </div>

          <div className="telemetry-actions-cluster">
            <button
              type="button"
              className="btn-telemetry-home font-serif-bn"
              onClick={() => setActiveTab && setActiveTab('home')}
              title={language === 'bn' ? 'হোম পেজে ফিরে যান' : 'Return to Estate Home'}
            >
              <ArrowLeft size={14} />
              <span>{language === 'bn' ? 'হোম পেজ' : 'Estate Hub'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 3. Primary Glassmorphic Content Stage */}
      <section className="subpage-main-stage animate-fade-in" aria-label="Section Content">
        {children}
      </section>
    </div>
  );
}
