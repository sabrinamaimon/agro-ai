import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45s for deep multimodal AI reasoning
});

export const processVoiceIntake = async (transcript, language = 'bn') => {
  const response = await api.post('/api/intake-voice', { transcript, language });
  return response.data;
};

export const diagnoseCropImage = async (imageFile, sampleId = null, cropType = null, union = 'Rangpur Sadar') => {
  const formData = new FormData();
  if (imageFile) {
    formData.append('image', imageFile);
  }
  if (sampleId) {
    formData.append('sampleId', sampleId);
  }
  if (cropType) {
    formData.append('cropType', cropType);
  }
  if (union) {
    formData.append('union', union);
  }
  
  const response = await api.post('/api/diagnose-vision', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const fetchWeatherAdvisory = async (unionName = 'Rangpur Sadar') => {
  const response = await api.get(`/api/weather-advisory?union=${encodeURIComponent(unionName)}`);
  return response.data;
};

export const checkMarketAnomaly = async (crop, offeredPrice) => {
  const response = await api.post('/api/price-anomaly', { 
    crop, 
    offeredPrice: Number(offeredPrice) 
  });
  return response.data;
};

export const fetchMarketBenchmarks = async () => {
  const response = await api.get('/api/market-benchmarks');
  return response.data;
};

export const requestAudioTTS = async (text, language = 'bn') => {
  const response = await api.post('/api/tts', { text, language });
  return response.data;
};
