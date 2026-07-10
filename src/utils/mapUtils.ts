import ootyBoundary from '../ooty-boundary.json';
import { Property } from '../types';
import { PropertyCluster } from '../components/CustomMarker';

/**
 * Checks if a coordinate [longitude, latitude] is inside the Ooty administrative boundary.
 * Uses the ray-casting algorithm to evaluate inclusion in the primary boundary polygon.
 */
export function isPointInOoty(lng: number, lat: number): boolean {
  try {
    const polygon = ootyBoundary.features[0].geometry.coordinates[0] as [number, number][];
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];
      
      const intersect = ((yi > lat) !== (yj > lat))
        && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  } catch (error) {
    console.error('Error in isPointInOoty boundary calculation:', error);
    return false;
  }
}

/**
 * Clusters an array of active properties dynamically based on their current on-screen pixel projections.
 */
export function getClusters(
  properties: Property[],
  map: any,
  radiusPixels: number = 60
): PropertyCluster[] {
  if (!map) return [];

  const clusters: PropertyCluster[] = [];
  const processed = new Set<string>();

  for (const prop of properties) {
    if (processed.has(prop.id)) continue;

    // Project starting property to screen space
    const p1 = map.project([prop.longitude, prop.latitude]);
    const clusterProps: Property[] = [prop];
    processed.add(prop.id);

    // Scan for nearby properties
    for (const other of properties) {
      if (processed.has(other.id)) continue;

      const p2 = map.project([other.longitude, other.latitude]);
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radiusPixels) {
        clusterProps.push(other);
        processed.add(other.id);
      }
    }

    if (clusterProps.length === 1) {
      clusters.push({
        id: `prop-${prop.id}`,
        isCluster: false,
        longitude: prop.longitude,
        latitude: prop.latitude,
        properties: clusterProps,
        count: 1
      });
    } else {
      // Calculate averaged geographical coordinate for the cluster bubble
      const avgLat = clusterProps.reduce((sum, p) => sum + p.latitude, 0) / clusterProps.length;
      const avgLng = clusterProps.reduce((sum, p) => sum + p.longitude, 0) / clusterProps.length;

      clusters.push({
        id: `cluster-${clusterProps[0].id}-${clusterProps.length}`,
        isCluster: true,
        longitude: avgLng,
        latitude: avgLat,
        properties: clusterProps,
        count: clusterProps.length
      });
    }
  }

  return clusters;
}

