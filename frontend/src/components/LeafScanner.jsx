import React, { useState, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, ShieldAlert, Sparkles, Sprout, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { diagnoseCropImage } from '../services/api';
import CropSearchSelect from './CropSearchSelect';

const DEMO_SAMPLES = [
  { id: 'mango-anthracnose', name: 'আমের অ্যানথ্রাকনোজ (Mango)', image: '/samples/potato_late_blight.jpg', crop: 'Mango (আম)' },
  { id: 'potato-blight', name: 'আলুর নাবী ধসা (Potato)', image: '/samples/potato_late_blight.jpg', crop: 'Potato (আলু)' },
  { id: 'rice-blast', name: 'ধানের ব্লাস্ট (Rice)', image: '/samples/rice_blast.jpg', crop: 'Rice / Paddy (ধান)' }
];

export default function LeafScanner({ language, intakeCrop, intakeUnion, onDiagnosisComplete }) {
  const [selectedCrop, setSelectedCrop] = useState(intakeCrop || 'Mango (আম)');
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

  const runDiagnosis = async (file, sampleId, cropToUse) => {
    const activeCrop = cropToUse || selectedCrop;
    setLoading(true);
    setErrorMessage(null);
    try {
      const unionParam = intakeUnion || 'Rangpur Sadar';
      const result = await diagnoseCropImage(file, sampleId, activeCrop, unionParam, language);
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
        <h2>{language === 'bn' ? 'দৃশ্যমান রোগ শনাক্তকরণ ও ক্ষতির মাত্রা (Precision Crop Vision)' : 'Visual Crop Disease Detection & CV Engine'}</h2>
      </div>

      <p className="card-desc">
        {language === 'bn'
          ? 'যেকোনো কৃষি ফসলের আক্রান্ত পাতা বা ফলের ছবি দিন। প্রথমে নিচের তালিকা থেকে ফসল নির্বাচন করুন, এআই মডেল ওই ফসলের বাস্তব রোগ নির্ভুলভাবে শনাক্ত করবে।'
          : 'Select your crop first from the list, then upload a leaf photo. OpenCV measures lesion damage % and Groq AI diagnoses the exact pathogen strictly for that crop.'}
      </p>

      {/* Step 1: Comprehensive Searchable Crop Selector */}
      <CropSearchSelect 
        language={language} 
        selectedCrop={selectedCrop} 
        onSelectCrop={(formattedName) => setSelectedCrop(formattedName)} 
      />

      {/* Step 2: Upload or Capture Photo */}
      <div className="mt-3">
        <label className="input-label font-bold text-base mb-2">
          <ImageIcon size={18} color="#059669" />
          <span>
            {language === 'bn' 
              ? `২. ${selectedCrop ? `"${selectedCrop}" এর` : ''} আক্রান্ত পাতা/ফলের ছবি আপলোড করুন:` 
              : `2. Upload leaf photo for ${selectedCrop || 'selected crop'}:`}
          </span>
        </label>

        {/* Demo Samples Selector */}
        <div className="demo-samples-bar mb-3">
          <span className="text-xs text-muted font-semibold">{language === 'bn' ? 'নমুনা পরীক্ষা (Demo Samples):' : 'Demo Samples:'}</span>
          <div className="sample-btn-group">
            {DEMO_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                type="button"
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
                <img src={diagnosisResult?.annotated_image || previewUrl} alt="Crop leaf" className="leaf-preview-img" />
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
                <p>{language === 'bn' ? 'এখানে ছবি ক্লিক করে আপলোড করুন বা ড্র্যাগ করুন' : 'Drag & drop leaf photo or click to upload'}</p>
                <span className="text-sm text-gray">PNG, JPG or JPEG format ({selectedCrop ? selectedCrop : 'যেকোনো ফসল'})</span>
              </div>
            )}
          </label>
        </div>
      </div>

      {loading && (
        <div className="loading-spinner mt-4">
          <Sparkles className="spin" size={24} color="#10B981" />
          <span>
            {language === 'bn' 
              ? `${selectedCrop || 'ফসল'}-এর কম্পিউটার ভিশন ও Groq 120B এআই দ্বারা নির্ভুল বিশ্লেষণ চলছে...` 
              : `Running precision Computer Vision & Groq 120B analysis for ${selectedCrop || 'crop'}...`}
          </span>
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
            <h4>{language === 'bn' ? `রোগ নির্ণয় ফলাফল: ${diagnosisResult.cropType}` : `Diagnostic Results: ${diagnosisResult.cropType}`}</h4>
            <span className={getSeverityBadgeClass(diagnosisResult.severity)}>
              {diagnosisResult.severity === 'Mild' ? (language === 'bn' ? 'হালকা (Mild)' : 'Mild') :
               diagnosisResult.severity === 'Moderate' ? (language === 'bn' ? 'মাঝারি (Moderate)' : 'Moderate') :
               diagnosisResult.severity === 'Severe' ? (language === 'bn' ? 'তীব্র (Severe)' : 'Severe') :
               diagnosisResult.severity === 'Critical' ? (language === 'bn' ? 'মারাত্মক (Critical)' : 'Critical') :
               diagnosisResult.severity} {language === 'bn' ? 'মাত্রা' : 'Severity'}
            </span>
          </div>

          <div className="grid-2 mt-3">
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'শনাক্তকৃত রোগ (Diagnosed Pathology)' : 'Diagnosed Pathology'}</span>
              <span className="data-value highlight">{diagnosisResult.name}</span>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'আক্রান্ত ক্ষেত্রফল (CV Damage %)' : 'Physical Surface Damage'}</span>
              <span className="data-value danger">{diagnosisResult.damagePercentage}% {language === 'bn' ? 'ক্ষেত্রফল আক্রান্ত' : 'Surface Area'}</span>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'ফসলের নাম (Target Crop)' : 'Crop Name'}</span>
              <span className="data-value">{diagnosisResult.cropType}</span>
            </div>
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'প্যাথোজেন জীবাণু (Pathogen)' : 'Scientific Pathogen'}</span>
              <span className="data-value italic">{diagnosisResult.pathogen}</span>
            </div>
            <div className="data-item full-width">
              <span className="data-label">{language === 'bn' ? 'শনাক্তকৃত ক্ষত গুচ্ছ (Lesion Spots)' : 'Lesion Clusters Pinpointed'}</span>
              <span className="data-value">{diagnosisResult.bounding_boxes?.length || 0} টি ক্ষত ক্লাস্টার (OpenCV Contours)</span>
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
