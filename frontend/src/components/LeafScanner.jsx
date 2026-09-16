import React, { useState } from 'react';
import { Camera, Upload, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';
import { diagnoseCropImage } from '../services/api';
import { SAMPLE_CROPS } from '../mockData/sampleCrops';

export default function LeafScanner({ language, onDiagnosisComplete }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    runDiagnosis(file, null);
  };

  const handleSampleClick = (sample) => {
    setSelectedImage(null);
    setPreviewUrl(sample.image);
    runDiagnosis(null, sample.id);
  };

  const runDiagnosis = async (file, sampleId) => {
    setLoading(true);
    try {
      const result = await diagnoseCropImage(file, sampleId);
      setDiagnosisResult(result);
      if (onDiagnosisComplete) onDiagnosisComplete(result);
    } catch (err) {
      console.error(err);
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
        <h2>{language === 'bn' ? 'দৃশ্যমান রোগ শনাক্তকরণ ও ক্ষতির মাত্রা (Visual CV Scanner)' : 'Visual Crop Disease Detection'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'আক্রান্ত পাতা বা ফলের ছবি তুলুন/আপলোড করুন অথবা নিচের ডেমো স্যাম্পলে ক্লিক করুন।'
          : 'Upload leaf photo to identify pathogen, surface damage %, and severity rating.'}
      </p>

      {/* Quick Demo Sample Selector */}
      <div className="demo-samples-bar mb-3">
        <span className="text-sm text-gray">{language === 'bn' ? 'ডেমো স্যাম্পল (Quick Demo):' : 'Quick Demo Samples:'}</span>
        <div className="sample-btn-group">
          {SAMPLE_CROPS.map((sample) => (
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
                    ? (language === 'bn' ? 'ক্ষত চিহ্নিত ওভারলে (Bounding Box)' : 'Lesion Bounding Overlays') 
                    : (language === 'bn' ? 'নতুন ছবি চয়ন করুন' : 'Change Image')}
                </span>
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <Upload size={40} color="#10B981" />
              <p>{language === 'bn' ? 'আক্রান্ত পাতার ছবি এখানে দিন' : 'Drag & drop leaf photo or click to upload'}</p>
              <span className="text-sm text-gray">PNG, JPG or JPEG format</span>
            </div>
          )}
        </label>
      </div>

      {loading && (
        <div className="loading-spinner">
          <Sparkles className="spin" size={24} color="#10B981" />
          <span>{language === 'bn' ? 'কম্পিউটার ভিশন AI দ্বারা বিশ্লেষণ চলছে...' : 'Running Computer Vision AI analysis...'}</span>
        </div>
      )}

      {diagnosisResult && !loading && (
        <div className="result-box mt-4">
          <div className="result-header">
            <ShieldAlert color="#EF4444" size={22} />
            <h4>{language === 'bn' ? 'রোগ নির্ণয় ফলাফল (CV Pathogen Detection)' : 'Disease Detection Results'}</h4>
            <span className={getSeverityBadgeClass(diagnosisResult.severity)}>
              {diagnosisResult.severity} Severity
            </span>
          </div>

          <div className="grid-2 mt-3">
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'রোগের নাম (Pathogen)' : 'Identified Pathogen'}</span>
              <span className="data-value highlight">{diagnosisResult.name}</span>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'ক্ষতির ক্ষেত্রফল (%)' : 'Surface Damage %'}</span>
              <span className="data-value danger">{diagnosisResult.damagePercentage}% Surface Area</span>
            </div>
            <div className="data-item full-width">
              <span className="data-label">{language === 'bn' ? 'বিজ্ঞানের নাম (Scientific Name)' : 'Scientific Pathogen'}</span>
              <span className="data-value italic">{diagnosisResult.pathogen}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
