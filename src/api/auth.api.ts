import axios from "axios";
import { environment } from "./environment";
import { ethers } from "ethers";
import { Web3AllowlistProvider } from "@aut-labs-private/abi-types";

export const AUTH_TOKEN_KEY = "user-access-token";

export const authoriseWithWeb3 = async (
  signer: ethers.providers.JsonRpcSigner
): Promise<boolean | any> => {
  const account = await signer.getAddress();

  const responseNonce = await axios.get(
    `${environment.apiUrl}/autID/user/nonce/${account}`
  );

  const nonce = responseNonce.data.nonce;

  const signature = await signer.signMessage(`${nonce}`);

  const jwtResponse = await axios.post(
    `${environment.apiUrl}/autID/user/getToken`,
    {
      address: account,
      signature
    }
  );
  localStorage.setItem(AUTH_TOKEN_KEY, jwtResponse.data.token);
  const isAuthorised = !!jwtResponse.data.token;
  return isAuthorised;
};

export const isAllowListed = async (signer: ethers.providers.JsonRpcSigner) => {
  try {
    const account = await signer.getAddress();
    const contract = Web3AllowlistProvider(
      "0x3Aa3c3cd9361a39C651314261156bc7cdB52B618",
      {
        signer: () => signer
      }
    );
    const isAllowed = await contract.isAllowed(account);
    if (!isAllowed) {
      throw new Error(
        "Aw shucks, it looks like you’re not on the Allowlist for this round."
      );
    }
    return isAllowed;
  } catch (error) {
    throw new Error(
      "Aw shucks, it looks like you’re not on the Allowlist for this round."
    );
  }
};