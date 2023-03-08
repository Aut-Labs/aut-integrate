import axios from "axios";
import { environment } from "./environment";
import { AUTH_TOKEN_KEY } from "./auth.api";

interface CacheModel {
  cacheKey: string;
  address: string;
  daoAddress: string;
  onboardingPluginAddress: string;
  questId: number;
  list: any[];
}

export const getCache = async (userAddress: string): Promise<CacheModel> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.get(
    `${environment.apiUrl}/autID/cache/getCache/${userAddress}`,
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};

export const updateCache = async (
  cache: Partial<CacheModel>
): Promise<CacheModel> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.post(
    `${environment.apiUrl}/autID/cache/addOrUpdateCache`,
    cache,
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};

export const deleteCache = async (cache: CacheModel): Promise<void> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const res = await axios.delete(
    `${environment.apiUrl}/autID/cache/deleteCache/${cache.address}`,
    {
      headers: {
        Authorization: token
      }
    }
  );
  return res?.data || null;
};
