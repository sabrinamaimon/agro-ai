import React, { useState, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, ShieldAlert, Sparkles, Sprout, CheckCircle2 } from 'lucide-react';
import { diagnoseCropImage } from '../services/api';

const REAL_SAMPLES = [
  { id: 'potato-blight', name: 'আলুর নাবী ধসা (Potato Late Blight)', image: '/samples/potato_late_blight.jpg', crop: 'Potato (আলু)' },
  { id: 'rice-blast', name: 'ধানের ব্লাস্ট রোগ (Rice Blast)', image: '/samples/rice_blast.jpg', crop: 'Rice (ধান)' }
];

const CROP_CHOICES = [
  { value: 'auto', labelBn: 'স্বয়ংক্রিয় শনাক্তকরণ (Auto-Detect AI)', labelEn: 'Auto-Detect by AI' },
  { value: 'Potato (আলু)', labelBn: 'আলু (Potato)', labelEn: 'Potato' },
  { value: 'Rice (ধান)', labelBn: 'ধান (Rice)', labelEn: 'Rice' },
  { value: 'Tomato (টমেটো)', labelBn: 'টমেটো (Tomato)', labelEn: 'Tomato' },
  { value: 'Wheat (গম)', labelBn: 'গম (Wheat)', labelEn: 'Wheat' },
  { value: 'Onion (পেঁয়াজ)', labelBn: 'পেঁয়াজ (Onion)', labelEn: 'Onion' },
  { value: 'Brinjal (বেগুন)', labelBn: 'বেগুন (Brinjal)', labelEn: 'Brinjal' },
  { value: 'Jute (পাট)', labelBn: 'পাট (Jute)', labelEn: 'Jute' },
  { value: 'Maize (ভুট্টা)', labelBn: 'ভুট্টা (Maize)', labelEn: 'Maize' }
];

export default function LeafScanner({ language, intakeCrop, intakeUnion, onDiagnosisComplete }) {
  const [selectedCrop, setSelectedCrop] = useState(intakeCrop || 'auto');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  useEffect(() => {
    if (intakeCrop) {
      setSelectedCrop(intakeCrop);
    }
  }, [intakeCrop]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrorMessage(null);
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    runDiagnosis(file, null, selectedCrop);
  };

  const handleSampleClick = (sample) => {
    setErrorMessage(null);
    setSelectedImage(null);
    setSelectedCrop(sample.crop);
    setPreviewUrl(sample.image);
    runDiagnosis(null, sample.id, sample.crop);
  };

  const runDiagnosis = async (file, sampleId, crop) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const cropParam = crop === 'auto' ? null : crop;
      const unionParam = intakeUnion || 'Rangpur Sadar';
      const result = await diagnoseCropImage(file, sampleId, cropParam, unionParam);
      setDiagnosisResult(result);
      if (onDiagnosisComplete) onDiagnosisComplete(result);
    } catch (err) {
      console.error('Diagnosis failed:', err);
      setErrorMessage(language === 'bn' 
        ? 'AI রোগ বিশ্লেষণে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।' 
        : 'AI diagnosis failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild': return 'badge-severity mild';
      case 'moderate': return 'badge-severity moderate';
      case 'severe': return 'badge-severity severe';
      case 'critical': return 'badge-severity critical';
      default: return 'badge-severity moderate';
    }
  };

  return (
    <div className="card task-card">
      <div className="card-header">
        <h2>{language === 'bn' ? 'দৃশ্যমান রোগ শনাক্তকরণ ও ক্ষতির মাত্রা (OpenCV + Groq AI)' : 'Visual Crop Disease Detection & CV Engine'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'আক্রান্ত পাতার ছবি তুলুন বা আপলোড করুন। কম্পিউটার ভিশন পাতার ক্ষতের শতকরা ক্ষতি হিসেব করবে এবং Groq AI লাইভ রোগ নির্ণয় করবে।'
          : 'Upload a leaf photo. OpenCV measures surface lesion damage %, and Groq AI diagnoses the exact pathogen live.'}
      </p>

      {/* Crop Selector Form Row */}
      <div className="form-group mb-3">
        <label className="input-label">
          <Sprout size={16} />
          <span>{language === 'bn' ? 'ফসলের ধরণ (ঐচ্ছিক - AI অটো ডিটেক্ট করতে পারে):' : 'Crop Type (Optional - AI can auto-detect):'}</span>
        </label>
        <select 
          className="input-field"
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          {CROP_CHOICES.map(c => (
            <option key={c.value} value={c.value}>
              {language === 'bn' ? c.labelBn : c.labelEn}
            </option>
          ))}
        </select>
      </div>

      {/* Real Sample Images Selector */}
      <div className="demo-samples-bar mb-3">
        <span className="text-sm text-gray">{language === 'bn' ? 'পরীক্ষামূলক আসল নমুনা ছবি (Real Samples):' : 'Real Test Samples:'}</span>
        <div className="sample-btn-group">
          {REAL_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              className="btn btn-outline btn-sm"
              onClick={() => handleSampleClick(sample)}
            >
              <Camera size={14} />
              <span>{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="upload-box">
        <input 
          type="file" 
          accept="image/*" 
          id="leaf-upload" 
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
        <label htmlFor="leaf-upload" className="upload-label">
          {previewUrl ? (
            <div className="image-preview-wrapper">
              <img src={diagnosisResult?.annotated_image || previewUrl} alt="Infected leaf" className="leaf-preview-img" />
              <div className="overlay-tag">
                <Camera size={16} />
                <span>
                  {diagnosisResult?.annotated_image 
                    ? (language === 'bn' ? 'ক্ষত চিহ্নিত ওভারলে (OpenCV Bounding Box)' : 'OpenCV Lesion Bounding Overlays') 
                    : (language === 'bn' ? 'নতুন ছবি চয়ন করুন' : 'Change Image')}
                </span>
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <Upload size={40} color="#10B981" />
              <p>{language === 'bn' ? 'আক্রান্ত পাতার ছবি এখানে দিন বা ক্যামেরা দিয়ে তুলুন' : 'Drag & drop leaf photo or click to upload'}</p>
              <span className="text-sm text-gray">PNG, JPG or JPEG format (Real physical leaf photos)</span>
            </div>
          )}
        </label>
      </div>

      {loading && (
        <div className="loading-spinner">
          <Sparkles className="spin" size={24} color="#10B981" />
          <span>{language === 'bn' ? 'কম্পিউটার ভিশন ও Groq 120B এআই দ্বারা লাইভ বিশ্লেষণ চলছে...' : 'Running Computer Vision & Groq 120B AI live analysis...'}</span>
        </div>
      )}

      {errorMessage && (
        <div className="alert-strip warning mt-3">
          <AlertTriangle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {diagnosisResult && !loading && (
        <div className="result-box mt-4">
          <div className="result-header">
            <ShieldAlert color="#EF4444" size={22} />
            <h4>{language === 'bn' ? 'এআই রোগ নির্ণয় ফলাফল (Live Pathogen Diagnosis)' : 'Live AI Pathogen Diagnosis'}</h4>
            <span className={getSeverityBadgeClass(diagnosisResult.severity)}>
              {diagnosisResult.severity} Severity
            </span>
          </div>

          <div className="grid-2 mt-3">
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'শনাক্তকৃত রোগ (Diagnosed Disease)' : 'Identified Disease'}</span>
              <span className="data-value highlight">{diagnosisResult.name}</span>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'কম্পিউটার ভিশন ক্ষতির ক্ষেত্রফল' : 'Physical Surface Damage'}</span>
              <span className="data-value danger">{diagnosisResult.damagePercentage}% Surface Area</span>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'বৈজ্ঞানিক নাম (Scientific Pathogen)' : 'Scientific Pathogen'}</span>
              <span className="data-value italic">{diagnosisResult.pathogen}</span>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'শনাক্তকৃত ক্ষত গুচ্ছ (Lesions Detected)' : 'Lesion Clusters'}</span>
              <span className="data-value">{diagnosisResult.bounding_boxes?.length || 0} টি ক্লাস্টার</span>
            </div>
            {diagnosisResult.description && (
              <div className="data-item full-width">
                <span className="data-label">{language === 'bn' ? 'লক্ষণ ও কোষবিনাশের বিবরণ (Clinical Symptoms)' : 'Clinical Symptoms'}</span>
                <p className="text-sm mt-1">{diagnosisResult.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
