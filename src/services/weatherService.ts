import { WeatherData } from '../types';

// API Key para OpenWeatherMap (você precisará se registrar em https://openweathermap.org/api)
const API_KEY = 'YOUR_API_KEY'; // Substitua pela sua chave da API
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherData = async (): Promise<WeatherData> => {
  try {
    // Para demonstração, vamos usar dados mockados
    // Em produção, você usaria a API real do OpenWeatherMap
    
    // Simulação de chamada à API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dados mockados para demonstração
    const mockWeatherData: WeatherData = {
      temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
      condition: getRandomCondition(),
      icon: getWeatherIcon('sunny'),
      location: 'São Paulo, SP',
    };

    return mockWeatherData;
  } catch (error) {
    console.error('Erro ao obter dados do clima:', error);
    
    // Retorna dados padrão em caso de erro
    return {
      temperature: 25,
      condition: 'Ensolarado',
      icon: '☀️',
      location: 'Localização não disponível',
    };
  }
};

// Função para obter dados reais da API (comentada para demonstração)
export const getRealWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
    );
    
    if (!response.ok) {
      throw new Error('Erro na resposta da API');
    }
    
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].main.toLowerCase()),
      location: data.name,
    };
  } catch (error) {
    console.error('Erro ao obter dados reais do clima:', error);
    throw error;
  }
};

const getRandomCondition = (): string => {
  const conditions = [
    'Ensolarado',
    'Nublado',
    'Chuvoso',
    'Parcialmente nublado',
    'Tempestade',
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

const getWeatherIcon = (condition: string): string => {
  const icons: { [key: string]: string } = {
    clear: '☀️',
    clouds: '☁️',
    rain: '🌧️',
    thunderstorm: '⛈️',
    snow: '❄️',
    mist: '🌫️',
    sunny: '☀️',
    cloudy: '☁️',
    stormy: '⛈️',
  };
  
  return icons[condition] || '🌤️';
}; 