import { DecimalPipe } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    NgZone,
    OnDestroy,
    signal,
    viewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import * as L from 'leaflet';
import { Map as LeafletMap, Marker } from 'leaflet';
import { Subscription } from 'rxjs';
import { Geolocation, GeoPosition } from '../../core/services/geolocation';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

@Component({
  selector: 'app-location',
  imports: [MatButton, MatIcon, MatSlideToggle, SupportBadge, DecimalPipe],
  templateUrl: './location.html',
  styleUrl: './location.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Location implements AfterViewInit, OnDestroy {
  private readonly geoService = inject(Geolocation);
  private readonly zone = inject(NgZone);
  private watchSub?: Subscription;
  private leafletMap?: LeafletMap;
  private marker?: Marker;

  protected readonly mapRef = viewChild<ElementRef<HTMLDivElement>>('mapEl');
  protected readonly isSupported = this.geoService.isSupported;
  protected readonly isWatching = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly highAccuracy = signal(false);
  protected readonly position = signal<GeoPosition | null>(null);
  protected readonly error = signal<string | null>(null);

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.watchSub?.unsubscribe();
    this.leafletMap?.remove();
  }

  private initMap(): void {
    const el = this.mapRef()?.nativeElement;
    if (!el) return;

    // Fix default marker icon paths broken by the Angular bundler
    const iconDefault = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.leafletMap = L.map(el).setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.leafletMap);
  }

  protected getLocation(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.geoService.getCurrentPosition(this.highAccuracy()).subscribe({
      next: pos => this.zone.run(() => {
        this.position.set(pos);
        this.isLoading.set(false);
        this.updateMap(pos);
      }),
      error: (e: GeolocationPositionError) => this.zone.run(() => {
        this.error.set(e.message);
        this.isLoading.set(false);
      }),
    });
  }

  protected toggleWatch(): void {
    if (this.isWatching()) {
      this.watchSub?.unsubscribe();
      this.isWatching.set(false);
    } else {
      this.isWatching.set(true);
      this.error.set(null);
      this.watchSub = this.geoService.watchPosition(this.highAccuracy()).subscribe({
        next: pos => this.zone.run(() => {
          this.position.set(pos);
          this.updateMap(pos);
        }),
        error: (e: GeolocationPositionError) => this.zone.run(() => {
          this.error.set(e.message);
          this.isWatching.set(false);
        }),
      });
    }
  }

  private updateMap(pos: GeoPosition): void {
    if (!this.leafletMap) return;
    const latlng: [number, number] = [pos.latitude, pos.longitude];
    this.leafletMap.setView(latlng, 15);
    if (!this.marker) {
      this.marker = L.marker(latlng).addTo(this.leafletMap);
    } else {
      this.marker.setLatLng(latlng);
    }
  }
}