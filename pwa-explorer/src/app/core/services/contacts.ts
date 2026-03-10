import { Injectable } from '@angular/core';

export interface ContactInfo {
  name?: string[];
  email?: string[];
  tel?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  get isSupported(): boolean {
    return 'contacts' in navigator && 'ContactsManager' in window;
  }

  getProperties(): Promise<string[]> {
    return (navigator as any).contacts.getProperties();
  }

  select(properties: string[], options?: { multiple?: boolean }): Promise<ContactInfo[]> {
    return (navigator as any).contacts.select(properties, options ?? { multiple: true });
  }
}
