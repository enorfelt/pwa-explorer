export type SupportLevel = 'supported' | 'partial' | 'unsupported' | 'unknown';

export type CapabilityCategory = 'media' | 'system' | 'communication' | 'device';

export interface Capability {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  category: CapabilityCategory;
  supportLevel: SupportLevel;
}
