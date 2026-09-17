import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { checkMarketAnomaly, fetchMarketBenchmarks } from '../services/api';

export default function PriceChecker({ language, cropType, onPriceCheckComplete }) {
  const [benchmarks, setBenchmarks] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(cropType || 'Potato (আলু)');
  const getCropDisplayName = (fullName) => {
    const match = fullName.match(/^(.*)\s\(([^()]+)\)$/);
    if (!match) return fullName;
    return language === 'bn' ? match[2] : match[1];
  };
  const toBengaliDigits = (num) => {
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (d) => bn[d]);
  };
  const [offeredPrice, setOfferedPrice] = useState('20');
  const [loading, setLoading] = useState(false);
  const [loadingBenchmarks, setLoadingBenchmarks] = useState(true);
  const [priceAnalysis, setPriceAnalysis] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadBenchmarks = async () => {
      try {
        setLoadingBenchmarks(true);
        const data = await fetchMarketBenchmarks();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setBenchmarks(data);
          // If cropType was passed, try to match it
          if (cropType) {
            const found = data.find(b => b.crop.toLowerCase().includes(cropType.toLowerCase()) || cropType.toLowerCase().includes(b.id));
            if (found) setSelectedCrop(found.crop);
          } else if (!selectedCrop) {
            setSelectedCrop(data[0].crop);
          }
        }
      } catch (err) {
        console.error('Error fetching market benchmarks:', err);
      } finally {
        if (isMounted) setLoadingBenchmarks(false);
      }
    };
    loadBenchmarks();
    return () => { isMounted = false; };
  }, [cropType]);

  const handleCheckAnomaly = async (e) => {
    e.preventDefault();
    if (!offeredPrice) return;
    setLoading(true);
    try {
      const result = await checkMarketAnomaly(selectedCrop, parseFloat(offeredPrice));
      setPriceAnalysis(result);
      if (onPriceCheckComplete) onPriceCheckComplete(result);
    } catch (err) {
      console.error('Market anomaly check failed:', err);
      alert(language === 'bn' ? 'বাজার দর যাচাই করতে সমস্যা হয়েছে।' : 'Failed to analyze market rate.');
    } finally {
      setLoading(false);
    }
  };

  const activeBenchmark = benchmarks.find(b => b.crop === selectedCrop);

  return (
    <div className="card task-card">
      <div className="card-header">
        <h2>{language === 'bn' ? 'সঠিক দাম যাচাই করুন' : 'Check the fair price'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'সরকারি বাজারদরের সাথে আপনার পাওয়া দাম মিলিয়ে দেখুন। কেউ যদি আপনাকে কম দাম দিতে চায়, আমরা সাথে সাথে আপনাকে জানিয়ে দেব।'
          : 'Check the price you were offered against the official market rate. If anyone tries to give you a lower price, we will let you know right away.'}
      </p>

      {/* Live Market Rates Strip */}
      <div className="dam-strip mb-4">
        <span className="text-xs text-muted font-bold">
          {language === 'bn' ? 'সরকারি পাইকারি বাজারদর :' : 'Government Wholesale Benchmarks :'}
        </span>
        <div className="dam-badge-row mt-1">
          {benchmarks.map(b => (
            <span
              key={b.id}
              className={`badge-crop ${selectedCrop === b.crop ? 'active' : ''}`}
              onClick={() => setSelectedCrop(b.crop)}
              style={{ cursor: 'pointer' }}
            >
              {getCropDisplayName(b.crop)}: <strong>৳{language === 'bn' ? toBengaliDigits(b.averagePrice) : b.averagePrice}</strong>
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleCheckAnomaly} className="price-form">
        <div className="form-group">
          <label className="input-label">{language === 'bn' ? 'ফসলের নাম' : 'Select Crop'}</label>
          <select
            className="input-field"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            disabled={loadingBenchmarks}
          >
            {benchmarks.map((b) => (
              <option key={b.id} value={b.crop}>{getCropDisplayName(b.crop)} (গড়: ৳{language === 'bn' ? toBengaliDigits(b.averagePrice) : b.averagePrice}/{b.unit || 'কেজি'})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="input-label">{language === 'bn' ? 'আড়তদার/ফড়িয়ার অফার দাম (৳/কেজি)' : 'Middleman Offered Price (৳/kg)'}</label>
          <div className="price-input-row">
            <input
              type="number"
              step="0.5"
              className="input-field"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(e.target.value)}
              placeholder="e.g. 20"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <TrendingUp size={18} />
              <span>{loading ? (language === 'bn' ? 'বিশ্লেষণ চলছে...' : 'Analyzing...') : (language === 'bn' ? 'যাচাই করুন' : 'Analyze Rate')}</span>
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
                : (language === 'bn' ? 'ন্যায্য বাজার মূল্য (Fair Market Offer)' : 'Fair Market Offer')}
            </h4>
          </div>

          <div className="grid-2 mt-3">
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'আড়তদারের অফার' : 'Offered Rate'}</span>
              <span className={`data-value ${priceAnalysis.isUndercut ? 'danger' : 'success'}`}>
                ৳{language === 'bn' ? toBengaliDigits(priceAnalysis.offeredPrice) : priceAnalysis.offeredPrice} / {language === 'bn' ? 'কেজি' : 'kg'}
              </span>
            </div>

            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'পাইকারি বেঞ্চমার্ক গাণিতিক গড়' : 'Wholesale Benchmark Rate'}</span>
              <span className="data-value highlight">
                ৳{language === 'bn' ? toBengaliDigits(priceAnalysis.benchmarkPrice) : priceAnalysis.benchmarkPrice} / {language === 'bn' ? 'কেজি' : 'kg'}
              </span>
            </div>

            {priceAnalysis.isUndercut && (
              <div className="data-item">
                <span className="data-label">{language === 'bn' ? 'মূল্য বৈষম্যের হার' : 'Undercut Percentage'}</span>
                <span className="data-value danger">
                  {language === 'bn' ? toBengaliDigits(priceAnalysis.undercutPercentage) : priceAnalysis.undercutPercentage}% কম দাম
                </span>
              </div>
            )}

            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'বাজারের অস্থিরতা' : 'Market Volatility'}</span>
              <span className="data-value">
                {priceAnalysis.volatility}
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
