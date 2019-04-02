import { ConnectorTypes } from "./ConnectorTypes";
import { IRedisConfig } from "./IRedisConfig";

export interface IAppConfig {
    port: number;
    connectorType: ConnectorTypes;

    redisConfig: IRedisConfig;
}