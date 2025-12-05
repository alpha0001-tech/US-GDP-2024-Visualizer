import React from 'react';
import { Settings, BarChart3, Map as MapIcon, Rotate3D } from 'lucide-react';
import { MapSettings, THEME_COLORS } from '../types';

interface ControlPanelProps {
  settings: MapSettings;
  setSettings: React.Dispatch<React.SetStateAction<MapSettings>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, setSettings }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 p-6 rounded-3xl shadow-lg space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-2 text-gray-800 mb-2">
        <Settings className="w-5 h-5" />
        <h3 className="font-semibold">Display Settings</h3>
      </div>

      {/* Theme Color Picker */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
          Theme Color
        </label>
        <div className="flex flex-wrap gap-2">
          {THEME_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => setSettings(prev => ({ ...prev, themeColor: color.value }))}
              className={`w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                settings.themeColor === color.value ? 'ring-2 ring-gray-400 scale-110' : ''
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* 3D Toggle */}
      <div>
         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
          View Mode
        </label>
        <div className="bg-gray-100 p-1 rounded-lg flex relative">
           <button
            onClick={() => setSettings(prev => ({ ...prev, is3D: false }))}
            className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${
              !settings.is3D ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MapIcon className="w-4 h-4 mr-1.5" />
            2D Flat
          </button>
          <button
            onClick={() => setSettings(prev => ({ ...prev, is3D: true }))}
            className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${
              settings.is3D ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Rotate3D className="w-4 h-4 mr-1.5" />
            3D Tilt
          </button>
        </div>
      </div>

      {/* Min GDP Filter */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Highlight GDP &gt;
          </label>
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
            ${settings.minGDP}B
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="4200"
          step="100"
          value={settings.minGDP}
          onChange={(e) => setSettings(prev => ({ ...prev, minGDP: Number(e.target.value) }))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>$0B</span>
          <span>$4.2T</span>
        </div>
      </div>

      {/* Sort Order */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
          Sort List By
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => setSettings(prev => ({ ...prev, sortBy: 'gdp' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              settings.sortBy === 'gdp' 
                ? 'bg-gray-900 text-white border-gray-900' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            GDP Value
          </button>
          <button
            onClick={() => setSettings(prev => ({ ...prev, sortBy: 'alpha' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              settings.sortBy === 'alpha' 
                ? 'bg-gray-900 text-white border-gray-900' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            Alphabetical
          </button>
        </div>
      </div>

    </div>
  );
};

export default ControlPanel;