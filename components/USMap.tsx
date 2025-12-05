import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { StateData } from '../types';
import { formatCurrency } from '../utils/data';

interface USMapProps {
  data: StateData[];
  settings: {
    themeColor: string;
    minGDP: number;
    is3D: boolean;
  };
  selectedStates: string[];
  onSelectState: (name: string) => void;
}

const USMap: React.FC<USMapProps> = ({ data, settings, selectedStates, onSelectState }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 960;
    const height = 600;

    // Clear previous render
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Setup map projection
    const projection = d3.geoAlbersUsa()
      .scale(1300)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Color scale setup
    const maxGDP = d3.max(data, d => d.gdp) || 4000;
    // We use a log scale or power scale because California is so huge compared to Vermont
    const colorScale = d3.scalePow<string>()
      .exponent(0.4) // Makes lower values more distinct
      .domain([0, maxGDP])
      .range(["#f3f4f6", settings.themeColor]);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g");

    // Fetch and render map
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then((us: any) => {
      const states = topojson.feature(us, us.objects.states) as any;

      // Draw states
      g.selectAll("path")
        .data(states.features)
        .enter()
        .append("path")
        .attr("d", path as any)
        .attr("class", "state-path")
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .attr("fill", (d: any) => {
          const stateName = d.properties.name;
          const stateData = data.find(s => s.name === stateName);
          
          if (!stateData) return "#e5e7eb";
          if (stateData.gdp < settings.minGDP) return "#f3f4f6"; // Filtered out
          if (selectedStates.includes(stateName)) return "#1f2937"; // Dark highlight for selection
          
          return colorScale(stateData.gdp);
        })
        .style("cursor", "pointer")
        .style("transition", "fill 0.3s ease, filter 0.3s ease")
        .on("mouseover", (event, d: any) => {
          const stateName = d.properties.name;
          const stateData = data.find(s => s.name === stateName);
          const val = stateData ? formatCurrency(stateData.gdp) : "N/A";

          d3.select(event.currentTarget)
            .attr("stroke", selectedStates.includes(stateName) ? "white" : settings.themeColor)
            .attr("stroke-width", 2)
            .style("filter", "drop-shadow(0px 0px 8px rgba(0,0,0,0.2))")
            .raise(); // Bring to front

          setTooltip({
            x: event.pageX,
            y: event.pageY,
            content: `${stateName}: ${val}`
          });
        })
        .on("mousemove", (event) => {
           setTooltip(prev => prev ? ({ ...prev, x: event.pageX, y: event.pageY }) : null);
        })
        .on("mouseout", (event, d: any) => {
          const stateName = d.properties.name;
           d3.select(event.currentTarget)
            .attr("stroke", "white")
            .attr("stroke-width", 0.5)
            .style("filter", "none");
          
          // Re-establish stacking order if selected
          if (selectedStates.includes(stateName)) {
             d3.select(event.currentTarget).raise();
          }

          setTooltip(null);
        })
        .on("click", (event, d: any) => {
          onSelectState(d.properties.name);
        });

      // Add state labels for larger states
      g.selectAll("text")
        .data(states.features)
        .enter()
        .append("text")
        .attr("transform", (d: any) => `translate(${path.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .text((d: any) => {
          const stateName = d.properties.name;
          const stateData = data.find(s => s.name === stateName);
          // Only show label if GDP is significant or zoom level is high (simplified here to just significant GDP)
          if (stateData && stateData.gdp > 300) return ""; 
          return "";
        })
        .style("font-size", "10px")
        .style("fill", "#374151")
        .style("pointer-events", "none");
    });

  }, [data, settings.themeColor, settings.minGDP, selectedStates, onSelectState]);


  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[600px] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-700 ease-out ${
        settings.is3D ? "scale-[0.95]" : ""
      }`}
      style={{
        transform: settings.is3D ? "perspective(1200px) rotateX(30deg) rotateY(0deg) scale(0.95)" : "none",
        transformStyle: "preserve-3d",
        boxShadow: settings.is3D 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
    >
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-gray-500 border border-gray-200 shadow-sm pointer-events-none">
        Interactive Map • Scroll to Zoom • Drag to Pan
      </div>
      
      <svg
        ref={svgRef}
        viewBox="0 0 960 600"
        className="w-full h-full cursor-move"
        style={{ filter: settings.is3D ? "drop-shadow(0px 10px 10px rgba(0,0,0,0.1))" : "none" }}
      />
      
      {tooltip && (
        <div 
          className="fixed z-50 pointer-events-none bg-black/80 backdrop-blur text-white text-xs px-3 py-2 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-full mt-[-8px]"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default USMap;