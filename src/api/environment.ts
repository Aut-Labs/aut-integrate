import { envionmentGenerator } from "@utils/env";

export enum EnvMode {
  Production = "production",
  Development = "development"
}

export const swEnvVariables = {
  // app config
  env: "REACT_APP_NODE_ENV",
  apiUrl: "REACT_APP_API_URL",

  // Networks
  networkEnv: "REACT_APP_NETWORK_ENV",
  defaultChainId: "REACT_APP_DEFAULT_CHAIN_ID",

  // IPFS storage
  ipfsApiKey: "REACT_APP_IPFS_API_KEY",
  ipfsApiSecret: "REACT_APP_IPFS_API_SECRET",
  ipfsGatewayUrl: "REACT_APP_IPFS_GATEWAY_URL"
};

export const environment: typeof swEnvVariables =
  envionmentGenerator(swEnvVariables);

export const autUrls = () => {
  if (environment.env === EnvMode.Development) {
    return {
      myAut: "https://internal.os.aut.id/",
      hub: "https://internal.hub.sbs/",
      launchpad: "https://internal.launch.hub.sbs/"
    };
  }

  return {
    myAut: "https://os.aut.id/",
    hub: "https://hub.sbs/",
    launchpad: "https://launch.hub.sbs/"
  };
};
