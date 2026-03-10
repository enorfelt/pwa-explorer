import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../core/services/notification';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

@Component({
  selector: 'app-notifications',
  imports: [TitleCasePipe, MatButton, MatIcon, SupportBadge],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notifications implements OnInit {
  private readonly notifService = inject(NotificationService);

  protected readonly isSupported = this.notifService.isSupported;
  protected readonly permission = this.notifService.permission;
  protected readonly isSubscribed = this.notifService.isSubscribed;
  protected readonly status = signal<string | null>(null);
  protected readonly sending = signal(false);

  ngOnInit(): void {
    this.notifService.getSubscriptionStatus();
  }

  protected async requestPermission(): Promise<void> {
    const result = await this.notifService.requestPermission();
    this.status.set(`Permission: ${result}`);
  }

  protected async subscribe(): Promise<void> {
    try {
      const key = environment.vapidPublicKey || await this.fetchVapidKey();
      await this.notifService.subscribe(key);
      this.status.set('Subscribed to push notifications!');
    } catch (e) {
      this.status.set(`Subscribe failed: ${(e as Error).message}`);
    }
  }

  protected async unsubscribe(): Promise<void> {
    try {
      await this.notifService.unsubscribe();
      this.status.set('Unsubscribed.');
    } catch (e) {
      this.status.set(`Unsubscribe failed: ${(e as Error).message}`);
    }
  }

  protected async sendTest(): Promise<void> {
    this.sending.set(true);
    try {
      await this.notifService.sendTestNotification();
      this.status.set('Test notification sent!');
    } catch (e) {
      this.status.set(`Send failed: ${(e as Error).message}`);
    } finally {
      this.sending.set(false);
    }
  }

  private async fetchVapidKey(): Promise<string> {
    const res = await fetch(`${environment.apiUrl}/vapid-public-key`);
    const data = await res.json() as { publicKey: string };
    return data.publicKey;
  }
}

