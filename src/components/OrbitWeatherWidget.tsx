import React, { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Wind,
  Droplets,
  Gauge,
  Compass,
  RefreshCw,
  Sparkles,
  MapPin
} from 'lucide-react';
import { WeatherData } from '../types';

interface OrbitWeatherWidgetProps {
  className?: string;
}

export const OrbitWeatherWidget: React.FC<OrbitWeatherWidgetProps> = ({ className = '' }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [expanded, setExpanded] = useState<boolean>(false);

  const fetchWeather = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/weather');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setWeather(data);
        }
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setRefreshing(false), 600);
      }
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchWeather();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  // Convert Celsius to Fahrenheit if requested
  const formatTemp = (tempC: number) => {
    if (unit === 'F') {
      const f = Math.round((tempC * 9) / 5 + 32);
      return `${f}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  // Select appropriate weather icon based on code and day/night
  const getWeatherIcon = (code: number, isDay: boolean) => {
    if (code === 0) {
      return isDay ? (
        <Sun className="w-6 h-6 sm:w-7 sm:h-7 text-[#f8d348] animate-spin-slow" />
      ) : (
        <Moon className="w-6 h-6 sm:w-7 sm:h-7 text-[#d4af37]" />
      );
    }
    if (code === 1 || code === 2) {
      return isDay ? (
        <CloudSun className="w-6 h-6 sm:w-7 sm:h-7 text-[#f8d348]" />
      ) : (
        <CloudMoon className="w-6 h-6 sm:w-7 sm:h-7 text-[#d4af37]" />
      );
    }
    if (code === 3) {
      return <Cloud className="w-6 h-6 sm:w-7 sm:h-7 text-[#c5c8cf]" />;
    }
    if (code === 45 || code === 48) {
      return <CloudFog className="w-6 h-6 sm:w-7 sm:h-7 text-[#c7bfb5]" />;
    }
    if (code >= 51 && code <= 55) {
      return <CloudDrizzle className="w-6 h-6 sm:w-7 sm:h-7 text-[#7ec8e3]" />;
    }
    if (code >= 61 && code <= 82) {
      return <CloudRain className="w-6 h-6 sm:w-7 sm:h-7 text-[#64b5f6]" />;
    }
    if (code >= 95) {
      return <CloudLightning className="w-6 h-6 sm:w-7 sm:h-7 text-[#ffd54f]" />;
    }
    return isDay ? (
      <Sun className="w-6 h-6 sm:w-7 sm:h-7 text-[#f8d348]" />
    ) : (
      <Moon className="w-6 h-6 sm:w-7 sm:h-7 text-[#d4af37]" />
    );
  };

  // Compass cardinal direction from degrees
  const getWindCardinal = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  if (loading && !weather) {
    return (
      <div
        className={`glass-card border border-[#d4af37]/30 rounded-2xl p-4 sm:p-5 text-[#f4efe8] max-w-sm w-full animate-pulse ${className}`}
        id="orbit-weather-skeleton"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-28 bg-[#d4af37]/20 rounded" />
          <div className="h-3 w-12 bg-white/10 rounded" />
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div className="space-y-2">
            <div className="h-6 w-16 bg-white/15 rounded" />
            <div className="h-3 w-32 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div
      className={`relative group glass-card border border-[#d4af37]/35 hover:border-[#d4af37]/60 rounded-2xl p-4 sm:p-5 text-[#f4efe8] shadow-[0_16px_50px_rgba(0,0,0,0.85)] transition-all duration-300 w-full max-w-sm pointer-events-auto ${className}`}
      id="orbit-weather-widget"
    >
      {/* Header Tag & Live Telemetry Pill */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]" />
          </span>
          <span className="text-[9px] sm:text-[9.5px] font-sans font-semibold tracking-[0.22em] uppercase text-[#d4af37] truncate">
            VIP ROAD // SKY TELEMETRY
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* C / F Toggle */}
          <button
            onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
            className="px-2 py-0.5 rounded text-[9.5px] font-mono font-medium border border-white/[0.12] hover:border-[#d4af37] bg-white/[0.04] text-white/80 hover:text-white transition-colors cursor-pointer"
            title={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
            aria-label="Toggle Temperature Unit"
          >
            °{unit}
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => fetchWeather(true)}
            disabled={refreshing}
            className="min-w-[28px] min-h-[28px] p-1 rounded-full text-white/50 hover:text-[#d4af37] hover:bg-white/[0.06] transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
            title="Refresh Live Weather"
            aria-label="Refresh Live Weather"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-[#d4af37]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Condition & Temperature Section */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/30 flex items-center justify-center shrink-0">
            {getWeatherIcon(weather.weatherCode, weather.isDay)}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-serif-luxury font-normal text-[#fcf9f2] tracking-tight">
                {formatTemp(weather.temperature)}
              </span>
              <span className="text-[10px] text-white/50 font-sans">
                Feels {formatTemp(weather.apparentTemperature)}
              </span>
            </div>
            <div className="text-xs sm:text-[13px] font-medium text-[#ded6c9] leading-tight mt-0.5">
              {weather.conditionText}
            </div>
          </div>
        </div>
      </div>

      {/* Micro Metrics Grid: Humidity, Wind & Atmosphere */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-white/[0.08] text-center">
        {/* Humidity */}
        <div className="p-1.5 sm:p-2 rounded-lg bg-black/30 border border-white/[0.05]">
          <div className="flex items-center justify-center gap-1 text-[#d4af37] mb-0.5">
            <Droplets className="w-3 h-3 shrink-0" />
            <span className="text-[8px] sm:text-[8.5px] uppercase tracking-wider text-white/50">
              HUMIDITY
            </span>
          </div>
          <span className="text-xs sm:text-[12.5px] font-mono text-[#f4efe8] font-semibold">
            {weather.humidity}%
          </span>
        </div>

        {/* Shivalik Wind */}
        <div className="p-1.5 sm:p-2 rounded-lg bg-black/30 border border-white/[0.05]">
          <div className="flex items-center justify-center gap-1 text-[#d4af37] mb-0.5">
            <Wind className="w-3 h-3 shrink-0" />
            <span className="text-[8px] sm:text-[8.5px] uppercase tracking-wider text-white/50">
              WIND
            </span>
          </div>
          <span className="text-xs sm:text-[12.5px] font-mono text-[#f4efe8] font-semibold">
            {weather.windSpeed} <span className="text-[9px] font-normal text-white/50">km/h</span>
          </span>
        </div>

        {/* Barometric Pressure / Shivalik Elevation */}
        <div className="p-1.5 sm:p-2 rounded-lg bg-black/30 border border-white/[0.05]">
          <div className="flex items-center justify-center gap-1 text-[#d4af37] mb-0.5">
            <Gauge className="w-3 h-3 shrink-0" />
            <span className="text-[8px] sm:text-[8.5px] uppercase tracking-wider text-white/50">
              PRESSURE
            </span>
          </div>
          <span className="text-xs sm:text-[12.5px] font-mono text-[#f4efe8] font-semibold">
            {Math.round(weather.surfacePressure)} <span className="text-[9px] font-normal text-white/50">hPa</span>
          </span>
        </div>
      </div>

      {/* Expandable Shivalik Micro-Climate Intelligence */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-2 text-[11px] animate-fade-in">
          <div className="flex items-center justify-between text-white/70">
            <span>Wind Heading:</span>
            <span className="font-mono text-[#d4af37]">
              {weather.windDirection}° ({getWindCardinal(weather.windDirection)})
            </span>
          </div>
          <div className="flex items-center justify-between text-white/70">
            <span>Cloud Canopy:</span>
            <span className="font-mono text-white/90">{weather.cloudCover}% cover</span>
          </div>
          {typeof weather.usAqi === 'number' && (
            <div className="flex items-center justify-between text-white/70">
              <span>US Air Quality Index:</span>
              <span className="font-mono text-[#d4af37] font-medium">
                {weather.usAqi} ({weather.aqiCategory})
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-white/50 text-[10px] pt-1">
            <span>Coordinates:</span>
            <span className="font-mono">30.6415°N, 76.8202°E</span>
          </div>
        </div>
      )}

      {/* Footer Details Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-2.5 pt-1.5 text-center text-[9.5px] font-sans uppercase tracking-[0.2em] text-[#d4af37]/80 hover:text-[#d4af37] transition-colors flex items-center justify-center gap-1 cursor-pointer"
      >
        <span>{expanded ? 'HIDE SKY METRICS' : 'EXPAND SKY METRICS'}</span>
      </button>
    </div>
  );
};
