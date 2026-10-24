import React, { useState } from 'react';
import { Sprout, Calculator, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function FertilizerCalculator({ language }) {
  const [crop, setCrop] = useState('potato');
  const [landSize, setLandSize] = useState('10'); // in Decimals (শতক)
  const [soilType, setSoilType] = useState('loam');

  const toDigits = (num) => {
    if (language !== 'bn') return String(num);
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (d) => bn[d]);
  };

  const calculateFertilizer = () => {
    const decimals = parseFloat(landSize) || 10;
    
    let ureaBase = 1.2; // kg per decimal
    let tspBase = 0.8;
    let mopBase = 0.9;

    if (crop === 'rice') {
      ureaBase = 1.0; tspBase = 0.5; mopBase = 0.6;
    } else if (crop === 'tomato') {
      ureaBase = 1.5; tspBase = 1.0; mopBase = 1.1;
    }

    if (soilType === 'sandy') {
      ureaBase *= 1.15; // Requires slightly more urea due to leaching
    }

    return {
      urea: (decimals * ureaBase).toFixed(1),
      tsp: (decimals * tspBase).toFixed(1),
      mop: (decimals * mopBase).toFixed(1),
      zinc: (decimals * 0.1).toFixed(1)
    };
  };

  const result = calculateFertilizer();

  return (
    <div className="card task-card">
      <div className="card-header">
        <Calculator color="#059669" size={24} />
        <h2>{language === 'bn' ? 'মাটি ও সার মাত্রা ক্যালকুলেটর' : 'Soil & Fertilizer Dosage Calculator'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'আপনার জমির পরিমাণ ও মাটির ধরণ অনুযায়ী সঠিক সার (ইউরিয়া, টিএসপি, পটাশ) নির্ধারণ করুন।'
          : 'Calculate exact N-P-K fertilizer requirements (Urea, TSP, Potash) based on land size and soil type.'}
      </p>

      <div className="grid-2">
        <div className="form-group">
          <label className="input-label">{language === 'bn' ? 'শস্য নির্বাচন করুন' : 'Select Crop'}</label>
          <select className="input-field" value={crop} onChange={(e) => setCrop(e.target.value)}>
            <option value="potato">{language === 'bn' ? 'আলু (Potato)' : 'Potato'}</option>
            <option value="rice">{language === 'bn' ? 'ধান (Rice)' : 'Rice'}</option>
            <option value="tomato">{language === 'bn' ? 'টমেটো (Tomato)' : 'Tomato'}</option>
          </select>
        </div>

        <div className="form-group">
          <label className="input-label">{language === 'bn' ? 'জমির পরিমাণ (শতক / Decimal)' : 'Land Size (Decimals)'}</label>
          <input 
            type="number" 
            className="input-field"
            value={landSize}
            onChange={(e) => setLandSize(e.target.value)}
            placeholder="e.g. 10"
          />
        </div>

        <div className="form-group full-width">
          <label className="input-label">{language === 'bn' ? 'মাটির ধরণ' : 'Soil Type'}</label>
          <select className="input-field" value={soilType} onChange={(e) => setSoilType(e.target.value)}>
            <option value="loam">{language === 'bn' ? 'দোআঁশ মাটি (Loam Soil - Ideal)' : 'Loam Soil'}</option>
            <option value="clay">{language === 'bn' ? 'এটেল মাটি (Clay Soil)' : 'Clay Soil'}</option>
            <option value="sandy">{language === 'bn' ? 'বেলে মাটি (Sandy Soil)' : 'Sandy Soil'}</option>
          </select>
        </div>
      </div>

      {/* Calculated Fertilizer Result Card */}
      <div className="result-box mt-4">
        <div className="result-header">
          <CheckCircle2 color="#059669" size={22} />
          <h4>{language === 'bn' ? 'সুপারিশকৃত সারের পরিমাণ' : 'Recommended Fertilizer Dosage'}</h4>
        </div>

        <div className="grid-4 mt-3">
          <div className="stat-card">
            <div className="stat-icon green"><Sprout size={20} /></div>
            <div>
              <h3>{toDigits(result.urea)} {language === 'bn' ? 'কেজি' : 'kg'}</h3>
              <p>{language === 'bn' ? 'ইউরিয়া (Urea)' : 'Urea (N)'}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon amber"><Sprout size={20} /></div>
            <div>
              <h3>{toDigits(result.tsp)} {language === 'bn' ? 'কেজি' : 'kg'}</h3>
              <p>{language === 'bn' ? 'টিএসপি (TSP)' : 'TSP (P)'}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue"><Sprout size={20} /></div>
            <div>
              <h3>{toDigits(result.mop)} {language === 'bn' ? 'কেজি' : 'kg'}</h3>
              <p>{language === 'bn' ? 'এমওপি/পটাশ (MOP)' : 'MOP Potash (K)'}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon emerald"><Sprout size={20} /></div>
            <div>
              <h3>{toDigits(result.zinc)} {language === 'bn' ? 'কেজি' : 'kg'}</h3>
              <p>{language === 'bn' ? 'জিংক (Zinc)' : 'Zinc Sulphate'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
