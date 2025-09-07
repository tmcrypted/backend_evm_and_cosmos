export interface AppConfig {
  port: number;
  nodeEnv: string;
  evm: {
    rpcUrl: string;
    timeout: number;
  };
  cosmos: {
    rpcUrl: string;
    timeout: number;
  };
  api: {
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
}

export default (): AppConfig => {
  const requiredEnvVars = {
    EVM_RPC_URL: process.env.EVM_RPC_URL,
    COSMOS_RPC_URL: process.env.COSMOS_RPC_URL,
  };

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      throw new Error(`Обязательная переменная окружения ${key} не установлена`);
    }
  }

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    evm: {
      rpcUrl: process.env.EVM_RPC_URL!,
      timeout: parseInt(process.env.EVM_TIMEOUT || '10000', 10),
    },
    cosmos: {
      rpcUrl: process.env.COSMOS_RPC_URL!,
      timeout: parseInt(process.env.COSMOS_TIMEOUT || '10000', 10),
    },
    api: {
      timeout: parseInt(process.env.API_TIMEOUT || '10000', 10),
      retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3', 10),
      retryDelay: parseInt(process.env.API_RETRY_DELAY || '1000', 10),
    },
  };
};
