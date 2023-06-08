import AutSDK, { SDKContractGenericResponse } from "@aut-labs-private/sdk";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Community } from "./community.model";
import { getCache, updateCache } from "./cache.api";

export const isMemberOfDao = createAsyncThunk(
  "membership-checker/is-member",
  async (
    requestBody: { daoAddr: string; daoType: number },
    { rejectWithValue }
  ) => {
    const sdk = AutSDK.getInstance();
    const response = await sdk.daoTypes.isMember(
      requestBody.daoAddr,
      requestBody.daoType
    );
    if (response?.isSuccess) {
      return response.data;
    }
    return rejectWithValue(response?.errorMessage);
  }
);

export const createCommunity = createAsyncThunk(
  "integrate/create/community",
  async (
    requestBody: {
      skipBiconomy: boolean;
      metadata: Community;
      contractType: number;
      daoAddr: string;
      userAddress: string;
    },
    { rejectWithValue }
  ) => {
    const sdk = AutSDK.getInstance();
    let response: SDKContractGenericResponse<string>;

    sdk.novaRegistry.contract.skipBiconomy = requestBody.skipBiconomy;

    if (requestBody.daoAddr) {
      sdk.daoExpanderRegistry.contract.skipBiconomy = requestBody.skipBiconomy;
      response = await sdk.daoExpanderRegistry.deployDAOExpander(
        requestBody.contractType,
        requestBody.daoAddr,
        requestBody.metadata.properties.market as number,
        requestBody.metadata.properties.commitment,
        requestBody.metadata
      );
    } else {
      // start from scratch
      response = await sdk.novaRegistry.deployNova(
        requestBody.metadata.properties.market as number,
        requestBody.metadata.properties.commitment,
        requestBody.metadata
      );
    }
    if (response?.isSuccess) {
      try {
        const cache = await getCache("UserPhases");
        if (cache) {
          cache.list[0].status = 1;
          await updateCache(cache);
        } else {
          await updateCache({
            cacheKey: "UserPhases",
            address: requestBody.userAddress,
            daoAddress: response.data,
            startDate: new Date().getTime(),
            list: [
              {
                phase: 1,
                status: 1
              },
              {
                phase: 2,
                status: 0
              },
              {
                phase: 3,
                status: 0
              }
            ]
          });
        }
      } catch (error) {
        // handle error
      }
      return response.data;
    }
    return rejectWithValue(response?.errorMessage);
  }
);
