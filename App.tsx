import React, { useState, useMemo } from 'react';
import { US_GDP_2024, formatCurrency } from './utils/data';
import USMap from './components/USMap';
import ControlPanel from './components/ControlPanel';
import ComparisonChart from './components/ComparisonChart';
import { MapSettings } from './types';
import { ArrowUpRight, TrendingUp, Info } from 'lucide-react';

const App: React.FC = () => {
  const [settings, setSettings] = useState<MapSettings>({
    themeColor: '#007AFF',
    minGDP: 0,
    is3D: true,
    sortBy: 'gdp'
  });

  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const handleStateSelect = (name: string) => {
    setSelectedStates(prev => {
      if (prev.includes(name)) {
        return prev.filter(s => s !== name);
      } else {
        // Limit selection to 5 for cleanliness
        if (prev.length >= 5) {
          const [, ...rest] = prev;
          return [...rest, name];
        }
        return [...prev, name];
      }
    });
  };

  // Filter data based on settings for the list
  const displayData = useMemo(() => {
    let filtered = [...US_GDP_2024];
    if (settings.sortBy === 'gdp') {
      filtered.sort((a, b) => b.gdp - a.gdp);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered;
  }, [settings.sortBy]);

  const comparisonData = useMemo(() => {
    return selectedStates
      .map(name => US_GDP_2024.find(s => s.name === name))
      .filter((s): s is typeof US_GDP_2024[0] => !!s)
      .sort((a, b) => b.gdp - a.gdp);
  }, [selectedStates]);

  const totalGDP = US_GDP_2024.reduce((acc, curr) => acc + curr.gdp, 0);

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-4 md:p-8 text-slate-800">
      
      {/* Navbar / Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-1">
            US Economy 2024
          </h1>
          <p className="text-gray-500 font-medium">
            Gross Domestic Product by State (in Billions USD)
          </p>
        </div>
        
        <div className="flex items-center space-x-6 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <TrendingUp size={20} />
             </div>
             <div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Total US GDP (Sum of States)</div>
                <div className="text-xl font-bold text-gray-900">{formatCurrency(totalGDP)}</div>
             </div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="text-right">
             <div className="text-xs text-gray-500 uppercase font-semibold">Top Contributor</div>
             <div className="text-lg font-bold text-gray-900">California</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Map & Comparison */}
        <div className="lg:col-span-9 space-y-6">
          {/* Map Card */}
          <section className="relative perspective-container"> 
             {/* Note: The USMap component handles its own container styling including the 3D transforms */}
             <USMap 
                data={US_GDP_2024} 
                settings={settings} 
                selectedStates={selectedStates}
                onSelectState={handleStateSelect}
             />
          </section>

          {/* Comparison Card */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">State Comparison</h2>
              {selectedStates.length > 0 && (
                <button 
                  onClick={() => setSelectedStates([])}
                  className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>
            <ComparisonChart data={comparisonData} themeColor={settings.themeColor} />
          </section>
        </div>

        {/* Right Column: Controls & Rankings */}
        <div className="lg:col-span-3 space-y-6 flex flex-col h-full">
          
          <ControlPanel settings={settings} setSettings={setSettings} />

          {/* Ranking List */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-sm flex-1 flex flex-col min-h-[400px] overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-white/50">
              <h3 className="font-bold text-gray-900">State Rankings</h3>
              <p className="text-xs text-gray-500 mt-1">
                {settings.sortBy === 'gdp' ? 'Sorted by GDP (High to Low)' : 'Alphabetical Order'}
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {displayData.map((state, index) => {
                  const isSelected = selectedStates.includes(state.name);
                  // Quick simulated growth for demo purposes (randomized consistent seed based on name length)
                  const simulatedGrowth = ((state.name.length % 5) + 1.2).toFixed(1); 
                  
                  return (
                    <div 
                      key={state.name}
                      onClick={() => handleStateSelect(state.name)}
                      className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'bg-gray-900 text-white shadow-lg transform scale-[1.02]' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs font-mono w-6 text-center ${isSelected ? 'text-gray-400' : 'text-gray-300'}`}>
                           {settings.sortBy === 'gdp' ? index + 1 : state.name.substring(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <div className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            {state.name}
                          </div>
                          <div className={`text-[10px] flex items-center ${isSelected ? 'text-green-300' : 'text-green-600'}`}>
                            <ArrowUpRight size={10} className="mr-0.5" />
                            +{simulatedGrowth}% YoY
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        ${state.gdp.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-3 bg-gray-50 text-[10px] text-center text-gray-400 border-t border-gray-100">
              Source: Statista 2024 Estimates
            </div>
          </div>
        </div>

      </main>
      
      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto mt-12 text-center text-gray-400 text-xs pb-8">
        <p className="flex items-center justify-center gap-1 mb-2">
          <Info size={12} />
          <span>Data based on current market prices. Projections are estimates.</span>
        </p>
        <p>© 2025 Financial Visualization Demo. Not official government data.</p>
      </footer>
    </div>
  );
};

export default App;