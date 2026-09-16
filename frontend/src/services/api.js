import axios from 'axios';
import { SAMPLE_CROPS, MOCK_WEATHER_DEFAULT, MOCK_PRICE_BENCHMARKS } from '../mockData/sampleCrops';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

export const processVoiceIntake = async (transcript, language = 'bn') => {
  try {
    const response = await api.post('/api/intake-voice', { transcript, language });
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, using fallback NLP parsing:', error);
    return {
      crop_type: transcript.includes('আলু') || transcript.toLowerCase().includes('potato') ? 'Potato (আলু)' : 'Rice (ধান)',
      estimated_planting_date: '10 days ago',
      observed_damage_description: transcript || 'Leaf discoloration with fungal spots',
      geographic_union: 'Rangpur Sadar'
    };
  }
};

export const diagnoseCropImage = async (imageFile, sampleId = null) => {
  try {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (sampleId) {
      formData.append('sampleId', sampleId);
    }
    const response = await api.post('/api/diagnose-vision', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, returning demo vision output:', error);
    if (sampleId) {
      const found = SAMPLE_CROPS.find((c) => c.id === sampleId);
      if (found) return found;
    }
    return SAMPLE_CROPS[0];
  }
};

export const fetchWeatherAdvisory = async (unionName = 'Rangpur') => {
  try {
    const response = await api.get(`/api/weather-advisory?union=${unionName}`);
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, returning fallback weather:', error);
    return MOCK_WEATHER_DEFAULT;
  }
};

export const checkMarketAnomaly = async (crop, offeredPrice) => {
  try {
    const response = await api.post('/api/price-anomaly', { crop, offeredPrice: Number(offeredPrice) });
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, returning fallback price analysis:', error);
    const benchmark = MOCK_PRICE_BENCHMARKS.find((b) => b.crop.toLowerCase().includes(crop.toLowerCase())) || MOCK_PRICE_BENCHMARKS[0];
    const isUndercut = offeredPrice < benchmark.averagePrice;
    return {
      crop: benchmark.crop,
      offeredPrice: Number(offeredPrice),
      benchmarkPrice: benchmark.averagePrice,
      volatility: isUndercut ? 'High' : 'Low',
      isUndercut,
      optimalSellingWindow: isUndercut ? 'Wait 3 to 5 days for fair rate' : 'Optimal selling time now'
    };
  }
};

export const requestAudioTTS = async (text, language = 'bn') => {
  try {
    const response = await api.post('/api/tts', { text, language });
    return response.data;
  } catch (error) {
    console.warn('TTS backend unavailable:', error);
    return null;
  }
};
