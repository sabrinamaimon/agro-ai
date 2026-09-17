import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { checkMarketAnomaly, fetchMarketBenchmarks } from '../services/api';

export default function PriceChecker({ language, cropType, onPriceCheckComplete }) {
  const [benchmarks, setBenchmarks] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(cropType || 'Potato (আলু)');
  const [offeredPrice, setOfferedPrice] = useState('20');
  const [loading, setLoading] = useState(false);
  const [loadingBenchmarks, setLoadingBenchmarks] = useState(true);
  const [priceAnalysis, setPriceAnalysis] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadBenchmarks = async () => {
      try {
        setLoadingBenchmarks(true);
        const data = await fetchMarketBenchmarks(language);
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setBenchmarks(data);
          // If cropType was passed, try to match it
          if (cropType) {
            const found = data.find(b => b.crop.toLowerCase().includes(cropType.toLowerCase()) || cropType.toLowerCase().includes(b.id));
            if (found) setSelectedCrop(found.crop);
          } else if (!selectedCrop || !data.some(b => b.crop === selectedCrop)) {
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
  }, [cropType, language]);

  const formatVolatility = (vol) => {
    if (!vol) return '';
    if (language !== 'bn') {
      if (vol.includes('উচ্চ') || vol.toLowerCase().includes('high')) return 'High';
      if (vol.includes('মাঝারি') || vol.toLowerCase().includes('medium')) return 'Medium';
      if (vol.includes('স্বাভাবিক') || vol.toLowerCase().includes('low')) return 'Low';
      return vol;
    }
    const lower = vol.toLowerCase();
    if (vol.includes('উচ্চ') || lower.includes('high')) return 'উচ্চ (High)';
    if (vol.includes('মাঝারি') || lower.includes('medium')) return 'মাঝারি (Medium)';
    if (vol.includes('স্বাভাবিক') || lower.includes('low')) return 'স্বাভাবিক / কম (Low)';
    return vol;
  };

  const formatSellingWindow = (win) => {
    if (!win) return '';
    if (language !== 'bn') {
      if (win.includes('৪ থেকে ৬') || win.toLowerCase().includes('wait 4 to 6')) {
        return 'Wait 4 to 6 days for local wholesale mandi rate recovery';
      }
      if (win.includes('২ থেকে ৩') || win.toLowerCase().includes('wait 2 to 3')) {
        return 'Wait 2 to 3 days for fair market rate';
      }
      if (win.includes('এখনই') || win.toLowerCase().includes('sell now')) {
        return 'Optimal selling window: Sell now or within next 48 hours';
      }
      return win;
    }
    if (win.includes('৪ থেকে ৬') || win.toLowerCase().includes('wait 4 to 6')) {
      return 'স্থানীয় পাইকারি আড়তে দর স্বাভাবিক হতে ৪ থেকে ৬ দিন অপেক্ষা করুন';
    }
    if (win.includes('২ থেকে ৩') || win.toLowerCase().includes('wait 2 to 3')) {
      return 'ন্যায্য বাজার মূল্যের জন্য ২ থেকে ৩ দিন অপেক্ষা করার পরামর্শ';
    }
    if (win.includes('এখনই') || win.toLowerCase().includes('sell now')) {
      return 'সর্বোত্তম বিক্রির সময়: এখনই অথবা আগামী ৪৮ ঘণ্টার মধ্যে বিক্রি করুন';
    }
    return win;
  };

  const handleCheckAnomaly = async (e) => {
    e.preventDefault();
    if (!offeredPrice) return;
    setLoading(true);
    try {
      const result = await checkMarketAnomaly(selectedCrop, parseFloat(offeredPrice), language);
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
        <h2>{language === 'bn' ? 'বাজার মূল্য বৈষম্য ও বিক্রি উইন্ডো (DAM Live Data)' : 'Market Price Anomaly & Selling Window'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'কৃষি বিপণন অধিদপ্তর (DAM) এর পাইকারি বেঞ্চমার্ক হারের সাথে আড়তদারের দাম যাচাই করুন এবং মেশিন লার্নিং দ্বারা কম দামের ঝুঁকি শনাক্ত করুন।'
          : 'Detect middleman price undercuts using live Department of Agricultural Marketing (DAM) benchmarks and ML Isolation Forest.'}
      </p>

      {/* Live Market Rates Strip */}
      <div className="dam-strip mb-4">
        <span className="text-xs text-muted font-bold">
          {language === 'bn' ? 'সরকারি পাইকারি বাজারদর (DAM Live Benchmarks):' : 'Government Wholesale Benchmarks (DAM):'}
        </span>
        <div className="dam-badge-row mt-1">
          {benchmarks.map(b => (
            <span 
              key={b.id} 
              className={`badge-crop ${selectedCrop === b.crop ? 'active' : ''}`}
              onClick={() => setSelectedCrop(b.crop)}
              style={{ cursor: 'pointer' }}
            >
              {b.crop}: <strong>৳{b.averagePrice}</strong>
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
              <option key={b.id} value={b.crop}>{b.crop} (গড়: ৳{b.averagePrice}/{b.unit || 'কেজি'})</option>
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
                ৳{priceAnalysis.offeredPrice} / {language === 'bn' ? 'কেজি' : 'kg'}
              </span>
            </div>

            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'পাইকারি বেঞ্চমার্ক গাণিতিক গড়' : 'Wholesale Benchmark Rate'}</span>
              <span className="data-value highlight">
                ৳{priceAnalysis.benchmarkPrice} / {language === 'bn' ? 'কেজি' : 'kg'}
              </span>
            </div>

            {priceAnalysis.isUndercut && (
              <div className="data-item">
                <span className="data-label">{language === 'bn' ? 'মূল্য বৈষম্যের হার' : 'Undercut Percentage'}</span>
                <span className="data-value danger">
                  {priceAnalysis.undercutPercentage}% {language === 'bn' ? 'কম দাম' : 'lower'}
                </span>
              </div>
            )}

            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'বাজারের অস্থিরতা' : 'Market Volatility'}</span>
              <span className="data-value">
                {formatVolatility(priceAnalysis.volatility)}
              </span>
            </div>

            <div className="data-item full-width">
              <span className="data-label">{language === 'bn' ? 'সর্বোত্তম বিক্রি উইন্ডো (Optimal 7-Day Window)' : 'Optimal 7-Day Selling Window'}</span>
              <div className="window-pill">
                <Calendar size={16} />
                <span>{formatSellingWindow(priceAnalysis.optimalSellingWindow)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
