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

  // NFT storage
  nftStorageKey: "REACT_APP_NFT_STORAGE_KEY",
  nftStorageUrl: "REACT_APP_IPFS_URL",

  // Twitter
  twitterClientId: "REACT_APP_TWITTER_CLIENT_ID",
  twitterApi: "REACT_APP_TWITTER_AUTH_URL"
};

export const environment: typeof swEnvVariables =
  envionmentGenerator(swEnvVariables);
