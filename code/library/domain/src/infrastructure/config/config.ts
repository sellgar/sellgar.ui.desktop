import { ConfigInterface } from './config.interface.ts';
import { resolveGatewayUrl } from './gateway-url.ts';

export class Config implements ConfigInterface {
  constructor(
    private readonly gatewayUrl: string,
    private readonly socketGatewayUrl: string,
    private readonly publicGatewayUrl: string = gatewayUrl,
    private readonly cdnImagesUrl?: string,
  ) {}

  getSocketGatewayUrl(): string {
    return this.socketGatewayUrl;
  }

  getPublicGatewayUrl(): string {
    return this.publicGatewayUrl;
  }

  getImageUrl(imageUuid: string, imageUrl?: string): string {
    if (this.cdnImagesUrl) return resolveGatewayUrl(encodeURIComponent(imageUuid), this.cdnImagesUrl).toString();

    return resolveGatewayUrl(
      imageUrl ?? `/v1/files/${encodeURIComponent(imageUuid)}`,
      this.publicGatewayUrl,
    ).toString();
  }

  getGatewayUrl(): string {
    return this.gatewayUrl;
  }
}
