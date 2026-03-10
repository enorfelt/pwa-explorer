import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ContactInfo, ContactsService } from '../../core/services/contacts';
import { SupportBadge } from '../../shared/components/support-badge/support-badge';

@Component({
  selector: 'app-contacts',
  imports: [FormsModule, MatButton, MatIcon, SupportBadge],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contacts implements OnInit {
  private readonly contactsService = inject(ContactsService);

  protected readonly isSupported = this.contactsService.isSupported;
  protected readonly availableProperties = signal<string[]>([]);
  protected readonly selectedContacts = signal<ContactInfo[]>([]);
  protected readonly status = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProperties();
  }

  private async loadProperties(): Promise<void> {
    if (!this.isSupported) return;
    try {
      const props = await this.contactsService.getProperties();
      this.availableProperties.set(props);
    } catch (e) {
      this.status.set(`Error loading properties: ${(e as Error).message}`);
    }
  }

  protected async pickContacts(): Promise<void> {
    try {
      const contacts = await this.contactsService.select(['name', 'email', 'tel']);
      this.selectedContacts.set(contacts);
      this.status.set(`Selected ${contacts.length} contact(s).`);
    } catch (e) {
      this.status.set(`Error: ${(e as Error).message}`);
    }
  }
}
