import React from 'react';
import { MapPin, Home, Leaf, Lock } from 'lucide-react';
import { Property, PropertyType, PropertyStatus } from '../types';

// Simple interface for a PropertyCluster (representing either a single property or a group)
export interface PropertyCluster {
  id: string;
  isCluster: boolean;
  longitude: number;
  latitude: number;
  properties: Property[];
  count: number;
}

interface CustomMarkerProps {
  cluster: PropertyCluster;
  onClick: () => void;
  selectedPropertyId: string | null;
  hoveredPropertyId?: string | null;
  key?: React.Key;
}

export default function CustomMarker({
  cluster,
  onClick,
  selectedPropertyId,
  hoveredPropertyId = null
}: CustomMarkerProps) {
  const { isCluster, count, properties } = cluster;

  if (isCluster) {
    // Determine category mix for conic-gradient border
    const total = properties.length;
    const landCount = properties.filter(p => p.type === 'land').length;
    const resortCount = properties.filter(p => p.type === 'resort').length;
    const teaCount = properties.filter(p => p.type === 'tea_estate').length;

    const landPct = (landCount / total) * 100;
    const resortPct = (resortCount / total) * 100;
    const teaPct = (teaCount / total) * 100;

    const segments: string[] = [];
    let currentAngle = 0;

    if (landCount > 0) {
      const nextAngle = currentAngle + landPct;
      segments.push(`#8C6239 ${currentAngle}% ${nextAngle}%`);
      currentAngle = nextAngle;
    }
    if (resortCount > 0) {
      const nextAngle = currentAngle + resortPct;
      segments.push(`#C97B4A ${currentAngle}% ${nextAngle}%`);
      currentAngle = nextAngle;
    }
    if (teaCount > 0) {
      const nextAngle = currentAngle + teaPct;
      segments.push(`#2D5A3D ${currentAngle}% ${nextAngle}%`);
      currentAngle = nextAngle;
    }

    // Fallback if no category or all zero
    if (segments.length === 0) {
      segments.push('#2D5A3D 0% 100%');
    }

    const isMixed = (landCount > 0 && resortCount > 0) || 
                    (landCount > 0 && teaCount > 0) || 
                    (resortCount > 0 && teaCount > 0);

    const gradientStyle = {
      background: `conic-gradient(${segments.join(', ')})`
    };

    // Check if the cluster contains the currently hovered search property
    const isHovered = hoveredPropertyId ? properties.some(p => p.id === hoveredPropertyId) : false;

    return (
      <div 
        className={`relative flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'scale-115 z-40' : ''
        }`}
      >
        {/* Pulsing glow ring around clustered markers if search item inside cluster is hovered */}
        {isHovered && (
          <div 
            className="absolute w-12 h-12 rounded-full border-2 border-emerald-600 animate-ping pointer-events-none scale-125 z-0"
            style={{ animationDuration: '1.8s' }}
          />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={gradientStyle}
          className="w-11 h-11 rounded-full p-[3px] shadow-xl flex items-center justify-center transform active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer focus:outline-none"
          title={`Cluster of ${count} properties (${landCount} Land, ${resortCount} Resort, ${teaCount} Tea Estate)`}
          id={`cluster-marker-${cluster.id}`}
        >
          <div className="w-full h-full rounded-full bg-brand-green text-white flex flex-col items-center justify-center font-bold font-display text-xs relative leading-none border border-white/10">
            <span>{count}</span>
            {isMixed && (
              <span className="text-[7px] font-sans font-medium text-emerald-200 mt-0.5 scale-90">Mix</span>
            )}
          </div>
        </button>
      </div>
    );
  }

  // Individual Property Pin
  const property = properties[0];
  const isSelected = selectedPropertyId === property.id;
  const isHovered = hoveredPropertyId === property.id;
  const isSoldOrBooked = property.status === 'sold' || property.status === 'booked';

  // Get specific category styles for single pin
  const getPinConfig = (type: PropertyType) => {
    switch (type) {
      case 'land':
        return {
          border: 'border-amber-800',
          color: '#8C6239',
          text: 'Land'
        };
      case 'resort':
        return {
          border: 'border-brand-terracotta',
          color: '#C97B4A',
          text: 'Resort'
        };
      case 'tea_estate':
        return {
          border: 'border-brand-green',
          color: '#2D5A3D',
          text: 'Tea'
        };
    }
  };

  const pin = getPinConfig(property.type);

  // Stagger index from property ID (e.g., "p5" -> index 5)
  const animDelay = parseInt(property.id.replace('p', '')) || 0;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        animationDelay: `${animDelay * 45}ms`,
        animationFillMode: 'both'
      }}
      className={`relative flex flex-col items-center justify-start h-[63px] w-12 animate-dropScaleIn pointer-events-auto cursor-pointer group ${
        isSoldOrBooked ? 'opacity-85' : ''
      } ${isHovered ? 'z-40' : ''}`}
      id={`property-marker-${property.id}`}
    >
      {/* Selection Glow Indicator */}
      {isSelected && (
        <div className="absolute top-1 w-12 h-12 rounded-full bg-brand-terracotta/20 border border-brand-terracotta/40 animate-ping pointer-events-none scale-125" />
      )}

      {/* Hover Pulsing Glow Ring around the pin */}
      {isHovered && (
        <div 
          className="absolute top-1 w-11 h-11 rounded-full border-2 animate-ping pointer-events-none scale-[1.35] z-0"
          style={{
            borderColor: pin.color,
            animationDuration: '1.8s'
          }}
        />
      )}

      {/* Teardrop Pin Shape (Rotated 45 degrees, pointed tip at bottom-center) */}
      <div 
        className={`w-11 h-11 rounded-full rounded-br-none rotate-45 overflow-hidden flex items-center justify-center bg-white shadow-lg transition-all duration-300 transform group-hover:scale-115 group-hover:-translate-y-1 ${
          isHovered
            ? 'scale-[1.2] -translate-y-2.5 border-[3px]'
            : isSelected 
              ? 'border-[3px] border-brand-terracotta scale-110 -translate-y-1 shadow-brand-terracotta/20 shadow-xl' 
              : `border-[2.5px] ${pin.border}`
        }`}
        style={isHovered ? { borderColor: pin.color, boxShadow: `0 10px 15px -3px ${pin.color}40, 0 4px 6px -4px ${pin.color}40` } : undefined}
      >
        {/* Inner Photo (Rotated -45 degrees to stand upright) */}
        <img
          src={property.images[0]}
          alt=""
          referrerPolicy="no-referrer"
          className="-rotate-45 w-[145%] h-[145%] max-w-none object-cover"
        />
      </div>

      {/* Sold/Booked Badge Overlay - placed absolute and upright (not rotated) */}
      {isSoldOrBooked && (
        <div 
          className="absolute -top-1 -right-2 bg-neutral-900 text-white border border-neutral-700 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md shadow-md flex items-center space-x-0.5 z-20"
          title={`${property.title} is ${property.status}`}
        >
          <Lock className="w-2.5 h-2.5 text-brand-terracotta shrink-0" />
          <span>{property.status === 'sold' ? 'Sold' : 'Book'}</span>
        </div>
      )}

      {/* Price Mini-Label (visible on hover or when selected) */}
      <div 
        className={`absolute top-12 bg-brand-charcoal text-white text-[9px] font-mono px-1.5 py-0.5 rounded-md shadow-md border border-neutral-800/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none z-10 ${
          isSelected || isHovered ? 'opacity-100 bg-neutral-900 font-bold scale-105' : ''
        }`}
        style={isHovered ? { borderColor: pin.color } : isSelected ? { borderColor: '#C97B4A' } : undefined}
      >
        {new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(property.price)}
      </div>
    </div>
  );
}
