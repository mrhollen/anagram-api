import { ConnectorTypes } from "./ConnectorTypes";
import { IRedisConfig } from "./IRedisConfig";

export interface IAppConfig {
    port: number;
    useDictionaryFile: boolean;
    dictionaryFile: string;
    connectorType: ConnectorTypes;

    redisConfig: IRedisConfig | undefined;
}