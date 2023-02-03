import AutLoading from "@components/AutLoading";
import { useEffect, useState } from "react";

const checkState = (receivedState) => {
  // const state = sessionStorage.getItem(TWITTER_STATE);
  // return state === receivedState;
  return true;
};

const queryToObject = (query) => {
  const parameters = new URLSearchParams(query);
  return Object.fromEntries(parameters.entries());
};

const Callback = () => {
  useEffect(() => {
    const payload = queryToObject(window.location.search.split("?")[1]);
    const error = payload && payload.error;
    // https://antonio-georgiev.eu-1.sharedwithexpose.com/callback?oauth_token=Qh_FbAAAAAABbKnGAAABhhSsKGA&oauth_verifier=BvuePyKOCuuTF6MVN7vhhX8DXFrwKdrU

    if (!window.opener) {
      throw new Error("No window opener");
    }

    if (error) {
      window.opener.postMessage({
        type: "OAUTH_RESPONSE",
        error: decodeURI(error) || "OAuth error: An error has occured."
      });
    } else {
      window.opener.postMessage({
        type: "OAUTH_RESPONSE",
        payload
      });
    }
    window.close();
  }, []);

  return (
    <div>
      <AutLoading />
    </div>
  );
};

export default Callback;
