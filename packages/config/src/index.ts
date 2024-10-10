import { ConfigService } from './config.service';

const configService = new ConfigService<{
  apiUrl: string;
  backendPath: string;
}>();

export { configService, ConfigService };
