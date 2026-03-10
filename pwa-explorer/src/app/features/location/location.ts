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
import { Subscription } from 'rxjs';
import { Geolocation, GeoPosition } from '../../core/services/geolocation';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

declare const L: {
  map: (el: HTMLElement, opts: object) => LeafletMap;
  tileLayer: (url: string, opts: object) => LeafletLayer;
  marker: (pos: [number, number]) => LeafletMarker;
};

interface LeafletMap {
  setView(latlng: [number, number], zoom: number): LeafletMap;
  addLayer(layer: LeafletLayer | LeafletMarker): LeafletMap;
  remove(): void;
}
interface LeafletLayer { addTo(map: LeafletMap): LeafletLayer; }
interface LeafletMarker { addTo(map: LeafletMap): LeafletMarker; setLatLng(latlng: [number, number]): LeafletMarker; }

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
  private marker?: LeafletMarker;

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
    if (!el || typeof L === 'undefined') return;
    this.leafletMap = L.map(el, {});
    this.leafletMap.setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.leafletMap as unknown as LeafletMap);
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
    if (!this.leafletMap || typeof L === 'undefined') return;
    const latlng: [number, number] = [pos.latitude, pos.longitude];
    this.leafletMap.setView(latlng, 15);
    if (!this.marker) {
      this.marker = L.marker(latlng).addTo(this.leafletMap as unknown as LeafletMap);
    } else {
      this.marker.setLatLng(latlng);
    }
  }
}

