export abstract class ConfigInterface {
  abstract getGatewayUrl(): string;

  abstract getPublicGatewayUrl(): string;

  abstract getImageUrl(imageUuid: string, imageUrl?: string): string;

  abstract getSocketGatewayUrl(): string;
}
