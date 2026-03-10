import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  get isSupported(): boolean {
    return 'bluetooth' in navigator;
  }

  requestDevice(): Promise<any> {
    return (navigator as any).bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service', 'device_information'],
    });
  }

  connect(device: any): Promise<any> {
    return device.gatt!.connect();
  }

  disconnect(device: any): void {
    device.gatt?.disconnect();
  }

  async readBatteryLevel(server: any): Promise<number> {
    const service = await server.getPrimaryService('battery_service');
    const characteristic = await service.getCharacteristic('battery_level');
    const value = await characteristic.readValue();
    return value.getUint8(0);
  }
}
