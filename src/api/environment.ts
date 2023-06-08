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
  nftStorageKey: "REACT_APP_NFT_STORAGE_KEY"
};

export const environment: typeof swEnvVariables =
  envionmentGenerator(swEnvVariables);

export const autUrls = () => {
  if (environment.env === EnvMode.Development) {
    return {
      tryAut: "https://try-internal.aut.id/",
      novaDashboard: "https://nova-internal.aut.id/",
      myAut: "https://my-internal.aut.id/",
      showcase: "https://showcase-internal.aut.id/",
      leaderboard: "https://leaderboard-internal.aut.id/",
      expander: "https://expander-internal.aut.id/"
    };
  }

  return {
    tryAut: "https://try.aut.id/",
    novaDashboard: "https://nova.aut.id/",
    myAut: "https://my.aut.id/",
    showcase: "https://showcase.aut.id/",
    leaderboard: "https://leaderboard.aut.id/",
    expander: "https://expander.aut.id/"
  };
};
