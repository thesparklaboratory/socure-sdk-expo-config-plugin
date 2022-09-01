import { ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins";

import { withAndroidSocure } from "./withAndroidSocure";
import { withIosSocure } from "./withIosSocure";

const withSocure: ConfigPlugin<
  {
    publicKey: string;
    username?: string;
    authToken?: string;
  }
> = (config, props) => {
  if (!props.publicKey) {
    throw new Error(
      "Socure publicKey is required"
    );
  }

  config = withAndroidSocure(config, {
    publicKey: props.publicKey,
  });
  config = withIosSocure(config, {
    publicKey: props.publicKey,
  });

  return config;
};

export default createRunOncePlugin(withSocure, "rn-socure-sdk");
