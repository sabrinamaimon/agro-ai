import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, Calendar, RefreshCw, ShoppingBag, PlusCircle, Phone, MapPin, Tag } from 'lucide-react';
import { checkMarketAnomaly, fetchMarketBenchmarks } from '../services/api';

export default function PriceChecker({ language, cropType, onPriceCheckComplete }) {
  const [activeMarketView, setActiveMarketView] = useState('checker'); // 'checker' | 'marketplace'
  const [marketFilter, setMarketFilter] = useState('all');
  const [showAddListing, setShowAddListing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('vegetable');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const [produceListings, setProduceListings] = useState([
    {
      id: 1,
      titleBn: 'তাজা ডায়মন্ড আলু (মাঠ থেকে সরাসরি পাইকারি)',
      titleEn: 'Fresh Diamond Potato (Direct Farm Wholesale)',
      category: 'vegetable',
      categoryBn: 'তাজা সবজি',
      quantity: '৫০ মণ',
      price: '৳২২ / কেজি',
      location: 'গাবতলী, বগুড়া',
      seller: 'মো: রফিকুল ইসলাম',
      phone: '01712-345678',
      verified: true
    },
    {
      id: 2,
      titleBn: 'বিএডিসি অনুমোদিত ব্রি ধান ২৮ খাঁটি বীজ',
      titleEn: 'BADC Certified BRRI Dhan-28 High-Yield Seeds',
      category: 'seed',
      categoryBn: 'প্রত্যয়িত বীজ',
      quantity: '২৫ বস্তা (১০ কেজি ব্যাগ)',
      price: '৳৫৫০ / বস্তা',
      location: 'রংপুর সদর',
      seller: 'কৃষক বন্ধু বীজ বিতান',
      phone: '01823-456789',
      verified: true
    },
    {
      id: 3,
      titleBn: 'সুস্বাদু হিমসাগর আম (গাছপাকা প্রি-অর্ডার)',
      titleEn: 'Direct Harvest Himsagar Mango',
      category: 'fruit',
      categoryBn: 'মৌসুমি ফল',
      quantity: '১৫০ মণ',
      price: '৳৮৫ / কেজি',
      location: 'শিবগঞ্জ, চাঁপাইনবাবগঞ্জ',
      seller: 'আমজাদ হোসেন',
      phone: '01911-223344',
      verified: true
    },
    {
      id: 4,
      titleBn: 'বারি টমেটো-৮ হাইব্রিড বীজ ও চারা',
      titleEn: 'BARI Tomato-8 Certified Seed Packets',
      category: 'seed',
      categoryBn: 'প্রত্যয়িত বীজ',
      quantity: '৪০ প্যাকেট (১০ গ্রাম)',
      price: '৳১৮০ / প্যাকেট',
      location: 'যশোর সদর',
      seller: 'মাটি ও মানুষ কৃষি কেন্দ্র',
      phone: '01755-667788',
      verified: true
    }
  ]);

  const [benchmarks, setBenchmarks] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(cropType || 'Potato (আলু)');
  
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

  const handleAddListingSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice.trim()) return;

    const newEntry = {
      id: Date.now(),
      titleBn: newTitle,
      titleEn: newTitle,
      category: newCategory,
      categoryBn: newCategory === 'vegetable' ? 'তাজা সবজি' : newCategory === 'fruit' ? 'মৌসুমি ফল' : 'প্রত্যয়িত বীজ',
      quantity: newQty || 'পর্যাপ্ত',
      price: newPrice,
      location: newLoc || 'স্থানীয় আড়ত',
      seller: 'কৃষক ভাই',
      phone: newPhone || '01700-000000',
      verified: true
    };

    setProduceListings([newEntry, ...produceListings]);
    setNewTitle('');
    setNewQty('');
    setNewPrice('');
    setNewLoc('');
    setNewPhone('');
    setShowAddListing(false);
  };

  const filteredListings = marketFilter === 'all' 
    ? produceListings 
    : produceListings.filter(p => p.category === marketFilter);

  const activeBenchmark = benchmarks.find(b => b.crop === selectedCrop);

  return (
    <div className="card task-card">
      {/* Sub-Navigation Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
        <button
          type="button"
          onClick={() => setActiveMarketView('checker')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: activeMarketView === 'checker' ? '1.5px solid #059669' : '1px solid #CBD5E1',
            background: activeMarketView === 'checker' ? '#ECFDF5' : '#FFFFFF',
            color: activeMarketView === 'checker' ? '#065F46' : '#475569',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <TrendingUp size={16} />
          <span>{language === 'bn' ? 'পাইকারি দর যাচাই' : 'Check Fair Price'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMarketView('marketplace')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: activeMarketView === 'marketplace' ? '1.5px solid #059669' : '1px solid #CBD5E1',
            background: activeMarketView === 'marketplace' ? '#ECFDF5' : '#FFFFFF',
            color: activeMarketView === 'marketplace' ? '#065F46' : '#475569',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <ShoppingBag size={16} />
          <span>{language === 'bn' ? 'ফার্মমার্কেট (ফসল ও বীজ বেচাকেনা)' : 'FarmMarket (Produce & Seeds)'}</span>
        </button>
      </div>

      {activeMarketView === 'checker' ? (
        <>
          <div className="card-header">
            <h2>{language === 'bn' ? 'সঠিক পাইকারি দাম যাচাই করুন' : 'Check the fair price'}</h2>
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
                  {b.crop}: <strong>৳{language === 'bn' ? toBengaliDigits(b.averagePrice) : b.averagePrice}</strong>
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
                  <option key={b.id} value={b.crop}>
                    {b.crop} ({language === 'bn' ? `গড়: ৳${toBengaliDigits(b.averagePrice)}/${b.unit || 'কেজি'}` : `Avg: ৳${b.averagePrice}/${b.unit || 'kg'}`})
                  </option>
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
                      {language === 'bn' 
                        ? `${toBengaliDigits(priceAnalysis.undercutPercentage)}% কম দাম` 
                        : `${priceAnalysis.undercutPercentage}% lower`}
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
        </>
      ) : (
        /* FarmMarket Hub: Direct Produce & Certified Seeds */
        <div className="farm-market-section animate-fade-in">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2>{language === 'bn' ? 'কৃষক হাট ও প্রত্যয়িত বীজ বাজার' : 'FarmMarket: Direct Produce & Seeds'}</h2>
              <p className="card-desc mt-1">
                {language === 'bn'
                  ? 'মধ্যস্বত্বভোগী ছাড়া সরাসরি কৃষকের মাঠের তাজা শাকসবজি, ফলমূল এবং অনুমোদিত বীজ ক্রয়-বিক্রয়ের উন্মুক্ত হাট।'
                  : 'Direct farmer-to-buyer exchange for fresh vegetables, seasonal fruits, and certified seeds.'}
              </p>
            </div>
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddListing(!showAddListing)}
            >
              <PlusCircle size={16} />
              <span>{language === 'bn' ? 'বিজ্ঞাপন দিন' : 'Post Listing'}</span>
            </button>
          </div>

          {/* Add Listing Form Modal / Accordion */}
          {showAddListing && (
            <form onSubmit={handleAddListingSubmit} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #CBD5E1', marginTop: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: '#0F172A' }}>
                {language === 'bn' ? 'নতুন পণ্য বা বীজের তথ্য দিন' : 'Add New Produce/Seed Listing'}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label className="text-xs text-muted block mb-1">{language === 'bn' ? 'পণ্যের নাম' : 'Title'}</label>
                  <input className="input-field" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. তাজা বাঁধাকপি বা ব্রি ধান ২৮" required />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">{language === 'bn' ? 'ধরন' : 'Category'}</label>
                  <select className="input-field" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="vegetable">{language === 'bn' ? 'তাজা শাকসবজি' : 'Fresh Vegetables'}</option>
                    <option value="fruit">{language === 'bn' ? 'ফলমূল' : 'Fruits'}</option>
                    <option value="seed">{language === 'bn' ? 'প্রত্যয়িত বীজ' : 'Certified Seeds'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">{language === 'bn' ? 'পরিমাণ' : 'Quantity'}</label>
                  <input className="input-field" value={newQty} onChange={(e) => setNewQty(e.target.value)} placeholder="e.g. ৫০ মণ বা ২০ বস্তা" />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">{language === 'bn' ? 'দাম' : 'Price'}</label>
                  <input className="input-field" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. ৳২৫/কেজি" required />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">{language === 'bn' ? 'এলাকা/উপজেলা' : 'Location'}</label>
                  <input className="input-field" value={newLoc} onChange={(e) => setNewLoc(e.target.value)} placeholder="e.g. শিবগঞ্জ, বগুড়া" />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">{language === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}</label>
                  <input className="input-field" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="e.g. 01712-XXXXXX" />
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary btn-sm">{language === 'bn' ? 'বিজ্ঞাপন প্রকাশ করুন' : 'Submit Listing'}</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddListing(false)}>{language === 'bn' ? 'বাতিল' : 'Cancel'}</button>
              </div>
            </form>
          )}

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', labelBn: 'সকল পণ্য ও বীজ', labelEn: 'All Items' },
              { id: 'vegetable', labelBn: '🥦 তাজা সবজি', labelEn: 'Vegetables' },
              { id: 'fruit', labelBn: '🥭 ফলমূল', labelEn: 'Fruits' },
              { id: 'seed', labelBn: '🌱 প্রত্যয়িত বীজ', labelEn: 'Certified Seeds' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setMarketFilter(f.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  border: marketFilter === f.id ? '1.5px solid #059669' : '1px solid #CBD5E1',
                  background: marketFilter === f.id ? '#059669' : '#FFFFFF',
                  color: marketFilter === f.id ? '#FFFFFF' : '#334155',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {language === 'bn' ? f.labelBn : f.labelEn}
              </button>
            ))}
          </div>

          {/* Product Listings Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {filteredListings.map(item => (
              <div key={item.id} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', background: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#ECFDF5', color: '#065F46', fontWeight: 600 }}>
                      {item.categoryBn}
                    </span>
                    <strong style={{ color: '#059669', fontSize: '1rem' }}>{item.price}</strong>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', color: '#0F172A', marginBottom: '0.35rem', lineHeight: '1.4' }}>
                    {language === 'bn' ? item.titleBn : item.titleEn}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <Tag size={13} />
                    <span>{language === 'bn' ? `মজুদ: ${item.quantity}` : `Stock: ${item.quantity}`}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={13} />
                    <span>{item.location}</span>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>{item.seller}</span>
                  <a 
                    href={`tel:${item.phone}`} 
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', borderColor: '#059669', color: '#059669' }}
                  >
                    <Phone size={13} />
                    <span>{language === 'bn' ? 'সরাসরি কল' : 'Call Seller'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
