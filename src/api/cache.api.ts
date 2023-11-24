import axios from "axios";
import { environment } from "./environment";

interface CacheModel {
  cacheKey: string;
  address: string;
  daoAddress: string;
  onboardingPluginAddress: string;
  questId: number;
  startDate: number;
  list: any[];
}

export const getCache = async (
  cacheKey: string,
  address: string
): Promise<CacheModel> => {
  const res = await axios.get(
    `${environment.apiUrl}/autID/cache/getCache/${cacheKey}?address=${address}`
    // {
    //   headers: {
    //     Authorization: token
    //   }
    // }
  );
  return res?.data || null;
};

export const updateCache = async (
  cache: Partial<CacheModel>
): Promise<CacheModel> => {
  const res = await axios.post(
    `${environment.apiUrl}/autID/cache/addOrUpdateCache/${cache.cacheKey}`,
    cache
    // {
    //   headers: {
    //     Authorization: token
    //   }
    // }
  );
  return res?.data || null;
};

export const deleteCache = async (
  cacheKey: string,
  address: string
): Promise<void> => {
  const res = await axios.delete(
    `${environment.apiUrl}/autID/cache/deleteCache/${cacheKey}?address=${address}`
    // {
    //   headers: {
    //     Authorization: token
    //   }
    // }
  );
  return res?.data || null;
};
