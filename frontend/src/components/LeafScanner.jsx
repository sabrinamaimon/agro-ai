import React, { useState, useEffect } from 'react';
import { Upload, AlertTriangle, ShieldCheck, CheckCircle2, Image as ImageIcon, RefreshCw, ArrowRight, Eye, Trash2, Search, SlidersHorizontal, Leaf, FlaskConical, CloudRain } from 'lucide-react';
import { diagnoseCropImage } from '../services/api';
import CropSearchDropdown from './CropSearchDropdown';
import PlantPartDropdown from './PlantPartDropdown';

export default function LeafScanner({ language, intakeCrop, intakeUnion, onDiagnosisComplete }) {
  // Enforced flow states:
  // Step 1: Upload photo first
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [imageFileSize, setImageFileSize] = useState('');

  // Step 2: Target Crop (No default crop!)
  const [selectedCrop, setSelectedCrop] = useState(intakeCrop || null);

  // Step 3: Plant Part
  const [selectedPart, setSelectedPart] = useState('leaf');

  // Step 4: Loading & Diagnostics
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  // Sync if intakeCrop changes from Task 1
  useEffect(() => {
    if (intakeCrop && !selectedCrop) {
      setSelectedCrop(intakeCrop);
    }
  }, [intakeCrop]);

  // Handle Photo Selection (Does NOT auto-run analysis)
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrorMessage(null);
    setSelectedImage(file);
    setImageFileName(file.name);
    setImageFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Remove uploaded image
  const handleClearImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    setPreviewUrl(null);
    setImageFileName('');
    setImageFileSize('');
    setDiagnosisResult(null);
  };

  // Check if Step 1, Step 2, and Step 3 are satisfied
  const isFormValid = Boolean(previewUrl && selectedCrop && selectedPart);

  // Run Diagnosis ONLY when user clicks the active search button
  const handleRunSearch = async () => {
    if (!isFormValid || loading) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const unionParam = intakeUnion || 'Rangpur Sadar';
      const result = await diagnoseCropImage(
        selectedImage, 
        null, 
        selectedCrop, 
        unionParam, 
        language, 
        selectedPart
      );
      setDiagnosisResult(result);
      if (onDiagnosisComplete) onDiagnosisComplete(result);
    } catch (err) {
      console.error('Diagnosis failed:', err);
      setErrorMessage(language === 'bn' 
        ? 'রোগ বিশ্লেষণে সমস্যা হয়েছে। দয়া করে সার্ভার কানেকশন চেক করে পুনরায় চেষ্টা করুন।' 
        : 'Diagnosis failed. Please check connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const s = severity?.toLowerCase();
    if (s === 'mild') {
      return { class: 'severity-mild', labelBn: 'হালকা (Mild)', labelEn: 'Mild' };
    } else if (s === 'moderate') {
      return { class: 'severity-moderate', labelBn: 'মাঝারি (Moderate)', labelEn: 'Moderate' };
    } else if (s === 'severe') {
      return { class: 'severity-severe', labelBn: 'তীব্র (Severe)', labelEn: 'Severe' };
    } else {
      return { class: 'severity-critical', labelBn: 'মারাত্মক (Critical)', labelEn: 'Critical' };
    }
  };

  return (
    <div className="card task-card scanner-premium-card">
      {/* Header Banner */}
      <div className="card-header border-b pb-3">
        <div className="header-badge-row">
          <span className="premium-tag">
            <ShieldCheck size={15} />
            <span>{language === 'bn' ? 'উদ্ভিদ রোগতত্ত্ব ভিশন ইঞ্জিন' : 'Precision Plant Health Vision'}</span>
          </span>
        </div>
        <h2 className="mt-1">
          {language === 'bn' 
            ? 'ফসল ও উদ্ভিদ স্বাস্থ্য স্ক্যানার (পাতা, ফল ও কাণ্ড)' 
            : 'Visual Crop Health & Pathology Scanner'}
        </h2>
        <p className="card-desc mt-1">
          {language === 'bn'
            ? 'আক্রান্ত অংশের ছবি আপলোড করুন, ফসল ও অঙ্গ নির্বাচন করে অনুসন্ধান বাটনে চাপুন। উন্নত এআই দৃষ্টি মডেল ছবির লক্ষণ বিশ্লেষণ করে সঠিক রোগ নির্ণয় ও সমাধান প্রদর্শন করবে।'
            : 'Upload a clear photo of the infected plant tissue, select the crop and organ, then initiate search for verified scientific pathology diagnosis.'}
        </p>
      </div>

      {/* Main Sequential Workflow Container */}
      <div className="scanner-workflow-flow mt-4">

        {/* STEP 1: Upload Photo First */}
        <div className="workflow-step-box">
          <div className="step-header">
            <div className={`step-circle ${previewUrl ? 'completed' : 'active'}`}>
              {previewUrl ? <CheckCircle2 size={16} /> : '১'}
            </div>
            <div className="step-title-group">
              <h3 className="step-heading">
                {language === 'bn' ? '১ম ধাপ: আক্রান্ত উদ্ভিদাংশের ছবি আপলোড করুন' : 'Step 1: Upload Plant Photo'}
              </h3>
              <span className="step-subheading">
                {language === 'bn' 
                  ? 'রোগাক্রান্ত পাতা, ফল, কাণ্ড বা পুরো গাছের একটি স্পষ্ট ছবি দিন' 
                  : 'Take or upload a clear photo of the infected leaf, fruit, or stem'}
              </span>
            </div>
          </div>

          <div className="step-content">
            <div className="upload-dropzone-wrapper">
              <input 
                type="file" 
                accept="image/*" 
                id="crop-photo-upload" 
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />

              {!previewUrl ? (
                <label htmlFor="crop-photo-upload" className="dropzone-label">
                  <div className="dropzone-inner">
                    <div className="dropzone-icon-circle">
                      <Upload size={28} className="text-emerald" />
                    </div>
                    <h4 className="dropzone-title">
                      {language === 'bn' ? 'ছবি আপলোড করতে ক্লিক করুন বা ফাইল টেনে আনুন' : 'Click to browse or drag & drop leaf/fruit photo'}
                    </h4>
                    <span className="dropzone-hint">
                      {language === 'bn' 
                        ? 'সাপোর্টেড ফরম্যাট: JPG, PNG, WEBP (সর্বোচ্চ ১০ মেগাবাইট)' 
                        : 'Supported formats: JPG, PNG, WEBP (Max 10MB)'}
                    </span>
                  </div>
                </label>
              ) : (
                <div className="upload-preview-card">
                  <div className="preview-img-container">
                    <img 
                      src={diagnosisResult?.annotated_image || previewUrl} 
                      alt="Crop specimen" 
                      className="preview-img" 
                    />
                    {diagnosisResult?.annotated_image && (
                      <span className="cv-overlay-pill">
                        <Eye size={14} />
                        <span>{language === 'bn' ? 'ক্ষত চিহ্নিত বাউন্ডিং বক্স' : 'Lesion Overlays'}</span>
                      </span>
                    )}
                  </div>
                  <div className="preview-meta">
                    <div className="meta-left">
                      <strong className="meta-filename">{imageFileName || 'uploaded_specimen.jpg'}</strong>
                      <span className="meta-filesize">{imageFileSize || 'Image Ready'}</span>
                      <span className="meta-status-badge">
                        <CheckCircle2 size={14} />
                        <span>{language === 'bn' ? 'ছবি প্রস্তুত' : 'Image Loaded'}</span>
                      </span>
                    </div>
                    <div className="meta-actions">
                      <label htmlFor="crop-photo-upload" className="btn-action-outline">
                        <RefreshCw size={14} />
                        <span>{language === 'bn' ? 'পরিবর্তন' : 'Change'}</span>
                      </label>
                      <button 
                        type="button" 
                        className="btn-action-danger" 
                        onClick={handleClearImage}
                        title={language === 'bn' ? 'ছবি মুছুন' : 'Remove Image'}
                      >
                        <Trash2 size={14} />
                        <span>{language === 'bn' ? 'মুছুন' : 'Remove'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STEP 2: Select Crop via Searchable Dropdown */}
        <div className="workflow-step-box mt-3">
          <div className="step-header">
            <div className={`step-circle ${selectedCrop ? 'completed' : previewUrl ? 'active' : 'pending'}`}>
              {selectedCrop ? <CheckCircle2 size={16} /> : '২'}
            </div>
            <div className="step-title-group">
              <h3 className="step-heading">
                {language === 'bn' ? '২য় ধাপ: ফসল নির্বাচন করুন (সার্চ ড্রপডাউন)' : 'Step 2: Select Target Crop (Search Dropdown)'}
              </h3>
              <span className="step-subheading">
                {language === 'bn' 
                  ? 'কোন ফসলের ছবি আপলোড করেছেন? তালিকা থেকে খুঁজুন' 
                  : 'Which agricultural crop are you diagnosing? Search & select'}
              </span>
            </div>
          </div>

          <div className="step-content">
            <CropSearchDropdown 
              language={language}
              selectedCrop={selectedCrop}
              onSelectCrop={(cropFormatted) => {
                setSelectedCrop(cropFormatted);
                setDiagnosisResult(null); // Reset old diagnosis if crop changes
              }}
            />
          </div>
        </div>

        {/* STEP 3: Select Plant Part / Organ */}
        <div className="workflow-step-box mt-3">
          <div className="step-header">
            <div className={`step-circle ${selectedPart ? 'completed' : selectedCrop ? 'active' : 'pending'}`}>
              {selectedPart ? <CheckCircle2 size={16} /> : '৩'}
            </div>
            <div className="step-title-group">
              <h3 className="step-heading">
                {language === 'bn' ? '৩য় ধাপ: আক্রান্ত উদ্ভিদাংশ বা অঙ্গ নির্বাচন করুন' : 'Step 3: Select Infected Plant Part / Organ'}
              </h3>
              <span className="step-subheading">
                {language === 'bn' 
                  ? 'ছবিটি উদ্ভিদের কোন অংশের? পাতা, ফল, কাণ্ড নাকি শিকড়' 
                  : 'Which plant part is photographed? Leaf, fruit, stem, or root'}
              </span>
            </div>
          </div>

          <div className="step-content">
            <PlantPartDropdown 
              language={language}
              selectedPart={selectedPart}
              onSelectPart={(partId) => {
                setSelectedPart(partId);
                setDiagnosisResult(null); // Reset old diagnosis if part changes
              }}
            />
          </div>
        </div>

        {/* STEP 4: Trigger Search & Analyze Button */}
        <div className="workflow-action-box mt-4">
          <button
            type="button"
            className={`btn-diagnose-action ${isFormValid && !loading ? 'active' : 'disabled'}`}
            disabled={!isFormValid || loading}
            onClick={handleRunSearch}
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="spin" />
                <span>{language === 'bn' ? 'উন্নত এআই দৃষ্টি ও রোগতত্ত্ব বিশ্লেষণ চলছে...' : 'Running Precision AI Pathology Analysis...'}</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>
                  {language === 'bn' 
                    ? 'রোগ অনুসন্ধান ও নিখুঁত বিশ্লেষণ করুন' 
                    : 'Analyze Crop & Diagnose Pathology'}
                </span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Helper / Validation Guidance */}
          {!isFormValid && (
            <div className="action-guidance-pill mt-2">
              <AlertTriangle size={15} />
              <span>
                {!previewUrl
                  ? (language === 'bn' ? 'অনুসন্ধান সক্রিয় করতে প্রথমে ১ম ধাপে ছবি আপলোড করুন' : 'Please upload photo in Step 1 to activate search')
                  : !selectedCrop
                  ? (language === 'bn' ? 'অনুসন্ধান সক্রিয় করতে ২য় ধাপে ফসল নির্বাচন করুন' : 'Please select a crop in Step 2 to activate search')
                  : (language === 'bn' ? 'সকল ধাপ পূরণ করুন' : 'Complete all steps to search')}
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Error Notification */}
      {errorMessage && (
        <div className="alert-strip warning mt-4">
          <AlertTriangle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 5: Verified Diagnostic Result Card */}
      {diagnosisResult && !loading && (
        <div className="result-box premium-result-card mt-4 animate-fade-in">
          <div className="result-top-bar">
            <div className="result-top-left">
              <span className="result-badge-pill">
                <CheckCircle2 size={15} />
                <span>{language === 'bn' ? 'এআই রোগ বিশ্লেষণ ফলাফল' : 'AI Diagnostic Result'}</span>
              </span>
              <h3 className="result-title mt-1">
                {diagnosisResult.name}
              </h3>
              <span className="result-scientific-name">
                {diagnosisResult.pathogen}
              </span>
            </div>

            <div className="result-top-right">
              {(() => {
                const b = getSeverityBadge(diagnosisResult.severity);
                return (
                  <span className={`badge-severity-pill ${b.class}`}>
                    {language === 'bn' ? b.labelBn : b.labelEn}
                  </span>
                );
              })()}
            </div>
          </div>

          <div className="grid-2 mt-4">
            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'শনাক্তকৃত ফসল' : 'Diagnosed Crop'}</span>
              <span className="data-value font-bold">{diagnosisResult.cropType}</span>
            </div>

            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'আক্রান্ত উদ্ভিদাংশ' : 'Infected Organ'}</span>
              <span className="data-value highlight font-bold">
                {diagnosisResult.plantPart || (language === 'bn' ? 'পাতা (Leaf)' : 'Leaf')}
              </span>
            </div>

            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'শারীরিক ক্ষতির মাত্রা (Surface Damage)' : 'Surface Area Damage'}</span>
              <span className="data-value danger font-bold">
                {diagnosisResult.damagePercentage}% {language === 'bn' ? 'ক্ষেত্রফল আক্রান্ত' : 'Surface Area'}
              </span>
            </div>

            <div className="data-item">
              <span className="data-label">{language === 'bn' ? 'চিহ্নিত ক্ষত গুচ্ছ (Lesion Spots)' : 'Pinpointed Lesions'}</span>
              <span className="data-value">
                {diagnosisResult.bounding_boxes?.length || 0} টি ক্লাস্টার
              </span>
            </div>

            {diagnosisResult.description && (
              <div className="data-item full-width">
                <span className="data-label">{language === 'bn' ? 'রোগের লক্ষণ ও বিবরণ' : 'Clinical Symptoms & Description'}</span>
                <p className="text-sm mt-1 leading-relaxed text-gray-800">
                  {diagnosisResult.description}
                </p>
              </div>
            )}

            {diagnosisResult.root_cause && (
              <div className="data-item full-width">
                <span className="data-label">{language === 'bn' ? 'আবহাওয়া প্রভাব ও সংক্রমণের কারণ' : 'Climate Trigger & Root Cause'}</span>
                <p className="text-sm mt-1 leading-relaxed text-gray-800">
                  {diagnosisResult.root_cause}
                </p>
              </div>
            )}
          </div>

          {/* Actionable Remedies Grid */}
          {(diagnosisResult.organicRemedy || diagnosisResult.chemicalRemedy) && (
            <div className="grid-2 mt-4">
              {diagnosisResult.organicRemedy && (
                <div className="remedy-card organic p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <div className="remedy-title flex items-center gap-2 text-emerald-800 font-bold mb-2">
                    <Leaf size={18} className="text-emerald-600" />
                    <span>{language === 'bn' ? 'জৈব ও প্রাকৃতিক প্রতিকার' : 'Organic Control'}</span>
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {diagnosisResult.organicRemedy}
                  </p>
                </div>
              )}

              {diagnosisResult.chemicalRemedy && (
                <div className="remedy-card chemical p-3 rounded-xl border border-blue-200 bg-blue-50/50">
                  <div className="remedy-title flex items-center gap-2 text-blue-800 font-bold mb-2">
                    <FlaskConical size={18} className="text-blue-600" />
                    <span>{language === 'bn' ? 'অনুমোদিত রাসায়নিক ও ছত্রাকনাশক' : 'Chemical Control'}</span>
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {diagnosisResult.chemicalRemedy}
                  </p>
                </div>
              )}
            </div>
          )}

          {diagnosisResult.sprayAdvice && (
            <div className="spray-advice-strip mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
              <CloudRain size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>{language === 'bn' ? 'স্প্রে করার সময়সূচী ও সতর্কতা: ' : 'Spray Advisory: '}</strong>
                <span>{diagnosisResult.sprayAdvice}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
