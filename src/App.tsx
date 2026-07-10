import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

import MapContainer from './components/MapContainer';
import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';
import InfoTooltip from './components/InfoTooltip';
import MapControls from './components/MapControls';
import FilterRow from './components/FilterRow';
import PropertyPreviewCard from './components/PropertyPreviewCard';
import FullPropertyDetailPanel from './components/FullPropertyDetailPanel';
import EnquiryModal from './components/EnquiryModal';

import { MapStyleId, Property, PropertyType } from './types';
import mockProperties from './ooty-mock-properties.json';

export default function App() {
  // Navigation drawer and settings state
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showBoundary, setShowBoundary] = React.useState(true);
  const [showSpotlight, setShowSpotlight] = React.useState(true);
  const [activeStyle, setActiveStyle] = React.useState<MapStyleId>('standard');
  const [mapInstance, setMapInstance] = React.useState<any>(null);
  const [showReturnToOoty, setShowReturnToOoty] = React.useState(false);

  // Responsive mobile state tracking
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 640);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter state & currently selected property
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | PropertyType>('all');
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);
  const [fullDetailProperty, setFullDetailProperty] = React.useState<Property | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = React.useState(false);
  const [enquiryPropertyName, setEnquiryPropertyName] = React.useState('');

  // Hovered state from search results list to Map pin sync
  const [hoveredPropertyId, setHoveredPropertyId] = React.useState<string | null>(null);

  // Compute active properties reactively based on filter category
  const filteredProperties = React.useMemo(() => {
    const list = mockProperties as Property[];
    if (selectedCategory === 'all') return list;
    return list.filter((p) => p.type === selectedCategory);
  }, [selectedCategory]);

  // Handle individual pin selection (centering + offsetting camera)
  const handlePinClick = (property: Property | null) => {
    setSelectedProperty(property);
    if (!property || !mapInstance) return;

    const isMobile = window.innerWidth < 640;
    const offsetLat = isMobile ? -0.005 : 0;
    const offsetLng = isMobile ? 0 : 0.006;

    const currentZoom = mapInstance.getZoom();
    const targetZoom = Math.max(currentZoom, 12.8);

    mapInstance.flyTo({
      center: [property.longitude + offsetLng, property.latitude + offsetLat],
      zoom: targetZoom,
      duration: 1000,
      essential: true
    });
  };

  // Handle pin selection from search dropdown (resets category filter first, opens full detail, flies to pin)
  const handleSelectPropertyFromSearch = (property: Property | null) => {
    if (property) {
      setSelectedCategory('all');
      setFullDetailProperty(property);
      setSelectedProperty(null); // Ensure small card is closed

      if (mapInstance) {
        const isMobile = window.innerWidth < 640;
        const offsetLat = isMobile ? -0.005 : 0;
        const offsetLng = isMobile ? 0 : 0.006;
        const currentZoom = mapInstance.getZoom();
        const targetZoom = Math.max(currentZoom, 12.8);

        mapInstance.flyTo({
          center: [property.longitude + offsetLng, property.latitude + offsetLat],
          zoom: targetZoom,
          duration: 1000,
          essential: true
        });
      }
    }
  };

  // Close preview card completely
  const handleClosePreview = () => {
    setSelectedProperty(null);
  };

  // Smooth ease-in-out flight to default Ooty view
  const handleReturnToOoty = () => {
    if (!mapInstance) return;
    mapInstance.flyTo({
      center: [76.6907, 11.4111],
      zoom: 11.2,
      pitch: 0,
      bearing: 0,
      duration: 1200,
      essential: true,
      easing: (t: number) => t * (2 - t) // Smooth cubic bezier easing
    });
  };

  return (
    <main 
      className="relative w-screen h-screen overflow-hidden bg-neutral-950 font-sans select-none"
      id="app-main-root"
    >
      {/* Absolute Layer 0: Map Container */}
      <MapContainer
        showBoundary={showBoundary}
        showSpotlight={showSpotlight}
        activeStyle={activeStyle}
        setMapInstance={setMapInstance}
        onViewStateChange={setShowReturnToOoty}
        properties={filteredProperties}
        onPinClick={handlePinClick}
        selectedPropertyId={selectedProperty ? selectedProperty.id : null}
        hoveredPropertyId={hoveredPropertyId}
        onViewFullDetails={(property) => {
          setFullDetailProperty(property);
          setSelectedProperty(null);
        }}
      />

      {/* Absolute Layer 1: Fixed Floating UI Controls Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between"
        id="floating-ui-layer"
      >
        {/* Top Section: Search, Category Filters, and Info Tooltips */}
        <div className="flex flex-col space-y-3.5 items-start w-full" id="top-floating-section">
          {/* Search bar is clickable/active */}
          <SearchBar 
            onOpenSidebar={() => setIsSidebarOpen(true)} 
            className="pointer-events-auto shadow-xl"
            properties={mockProperties as Property[]}
            onSelectProperty={handleSelectPropertyFromSearch}
            onHoverProperty={setHoveredPropertyId}
            mapInstance={mapInstance}
          />

          {/* Pill Category Selector Filters */}
          <FilterRow
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            className="pointer-events-auto"
          />

          {/* Dismissible Info Tooltip (Regional limits) */}
          <InfoTooltip className="pointer-events-auto" />
        </div>

        {/* Bottom Section (Managed fully within MapControls) */}
      </div>

      {/* Slide-out Preview Property Card overlay - only visible on mobile */}
      {isMobile && selectedProperty && (
        <PropertyPreviewCard
          property={selectedProperty}
          onClose={handleClosePreview}
          onViewDetails={(id) => {
            setFullDetailProperty(selectedProperty);
            setSelectedProperty(null);
          }}
          isMobile={true}
        />
      )}

      {/* Full Property Detail Panel */}
      {fullDetailProperty && (
        <FullPropertyDetailPanel
          property={fullDetailProperty}
          onClose={() => setFullDetailProperty(null)}
          onOpenEnquiry={(propertyName) => {
            setEnquiryPropertyName(propertyName);
            setIsEnquiryOpen(true);
          }}
          isMobile={isMobile}
        />
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        propertyName={enquiryPropertyName}
      />

      {/* Floating Controls Overlay (Location, Zoom, Styles, Compass, Toast) */}
      <MapControls
        map={mapInstance}
        activeStyle={activeStyle}
        setActiveStyle={setActiveStyle}
        showReturnToOoty={showReturnToOoty}
        onReturnToOoty={handleReturnToOoty}
      />

      {/* Left Drawer Slide-out Sidebar Panel */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        showBoundary={showBoundary}
        setShowBoundary={setShowBoundary}
        showSpotlight={showSpotlight}
        setShowSpotlight={setShowSpotlight}
        activeStyle={activeStyle}
        setActiveStyle={setActiveStyle}
      />
    </main>
  );
}
