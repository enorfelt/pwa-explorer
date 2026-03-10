import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

function toGeoPosition(pos: GeolocationPosition): GeoPosition {
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
    altitude: pos.coords.altitude,
    altitudeAccuracy: pos.coords.altitudeAccuracy,
    heading: pos.coords.heading,
    speed: pos.coords.speed,
    timestamp: pos.timestamp,
  };
}

@Injectable({
  providedIn: 'root',
})
export class Geolocation {
  get isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  getCurrentPosition(highAccuracy = false): Observable<GeoPosition> {
    return new Observable(observer => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          observer.next(toGeoPosition(pos));
          observer.complete();
        },
        err => observer.error(err),
        { enableHighAccuracy: highAccuracy, timeout: 15000, maximumAge: 0 },
      );
    });
  }

  watchPosition(highAccuracy = false): Observable<GeoPosition> {
    return new Observable(observer => {
      const id = navigator.geolocation.watchPosition(
        pos => observer.next(toGeoPosition(pos)),
        err => observer.error(err),
        { enableHighAccuracy: highAccuracy, timeout: 15000, maximumAge: 0 },
      );
      return () => navigator.geolocation.clearWatch(id);
    });
  }
}

