import React, { useState } from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, Calendar } from 'lucide-react';
import { checkMarketAnomaly } from '../services/api';
import { MOCK_PRICE_BENCHMARKS } from '../mockData/sampleCrops';

export default function PriceChecker({ language, cropType, onPriceCheckComplete }) {
  const [selectedCrop, setSelectedCrop] = useState(cropType || 'Potato (আলু)');
  const [offeredPrice, setOfferedPrice] = useState('20');
  const [loading, setLoading] = useState(false);
  const [priceAnalysis, setPriceAnalysis] = useState(null);

  const handleCheckAnomaly = async (e) => {
    e.preventDefault();
    if (!offeredPrice) return;
    setLoading(true);
    try {
      const result = await checkMarketAnomaly(selectedCrop, parseFloat(offeredPrice));
      setPriceAnalysis(result);
      if (onPriceCheckComplete) onPriceCheckComplete(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card task-card">
      <div className="card-header">
        <h2>{language === 'bn' ? 'বাজার মূল্য বৈষম্য ও বিক্রি উইন্ডো' : 'Market Price Anomaly Detection'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'ফড়িয়া/আড়তদারের দেওয়া দাম যাচাই করুন এবং সঠিক বিক্রির সময় নির্ধারণ করুন।'
          : 'Detect predatory middleman price undercuts and find optimal 7-day selling window.'}
      </p>

      <form onSubmit={handleCheckAnomaly} className="price-form">
        <div className="form-group">
          <label className="input-label">{language === 'bn' ? 'ফসলের নাম' : 'Select Crop'}</label>
          <select 
            className="input-field"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            {MOCK_PRICE_BENCHMARKS.map((b) => (
              <option key={b.crop} value={b.crop}>{b.crop}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="input-label">{language === 'bn' ? 'আড়তদারের অফার দাম (টাকা/কেজি)' : 'Middleman Offered Price (BDT/kg)'}</label>
          <div className="price-input-row">
            <input 
              type="number" 
              className="input-field"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(e.target.value)}
              placeholder="e.g. 20"
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <DollarSign size={18} />
              <span>{language === 'bn' ? 'যাচাই করুন' : 'Analyze Rate'}</span>
            </button>
          </div>
        </div>
      </form>

      {priceAnalysis && (
        <div className="result-box mt-4">
          <div className="result-header">
            {priceAnalysis.isUndercut ? (
              <AlertTriangle color="#EF4444" size={22} />
            ) : (
              <ShieldCheck color="#10B981" size={22} />
            )}
            <h4>
              {priceAnalysis.isUndercut 
                ? (language === 'bn' ? 'কম দামের ঝুঁকি শনাক্ত (Price Undercut Detected!)' : 'Predatory Pricing Undercut Alert!') 
                : (language === 'bn' ? 'ন্যায্য বাজার মূল্য' : 'Fair Market Offer')}
            </h4>
          </div>

          <div className="grid-2 mt-3">
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'আড়তদারের অফার' : 'Offered Rate'}</span>
              <span className={`data-value ${priceAnalysis.isUndercut ? 'danger' : 'success'}`}>
                {priceAnalysis.offeredPrice} BDT/kg
              </span>
            </div>

            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'পাইকারি বেঞ্চমার্ক গাণিতিক গড়' : 'Wholesale Benchmark Rate'}</span>
              <span className="data-value highlight">
                {priceAnalysis.benchmarkPrice} BDT/kg
              </span>
            </div>

            <div className="data-item full-width">
              <span className="data-label">{language === 'bn' ? 'সর্বোত্তম বিক্রি উইন্ডো (Optimal 7-Day Window)' : 'Optimal 7-Day Selling Window'}</span>
              <div className="window-pill">
                <Calendar size={16} />
                <span>{priceAnalysis.optimalSellingWindow}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
