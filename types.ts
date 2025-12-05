export interface StateData {
  name: string;
  gdp: number; // in billions
  id?: string; // FIPS code or similar if needed for map matching
}

export interface MapSettings {
  themeColor: string;
  minGDP: number;
  is3D: boolean;
  sortBy: 'gdp' | 'alpha';
}

export const THEME_COLORS = [
  { name: 'Blue', value: '#007AFF' },
  { name: 'Purple', value: '#5856D6' },
  { name: 'Pink', value: '#FF2D55' },
  { name: 'Teal', value: '#30B0C7' },
  { name: 'Orange', value: '#FF9500' },
  { name: 'Green', value: '#34C759' },
];