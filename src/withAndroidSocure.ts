import {
  AndroidConfig,
  ConfigPlugin,
  withAppBuildGradle,
  withGradleProperties,
  withStringsXml,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { withBuildProperties } from "expo-build-properties";

import { withKotlinGradle } from "./withKotlinGradle";

const KOTLIN_VERSION = "1.6.10";

export const withAndroidSocure: ConfigPlugin<{
  authToken?: string;
  publicKey: string;
  username?: string;
}> = (config, props) => {
  config = withBuildProperties(config, {
    android: {
      minSdkVersion: 24,
    },
  });
  config = withKotlinGradle(config, KOTLIN_VERSION);

  if (props.authToken || props.username) {
    config = withGradleProperties(config, (config) => {
      config.modResults = config.modResults.filter((item) => {
        if (
          item.type === "property" &&
          ["authToken", "username"].indexOf(item.key) !== -1
        ) {
          return false;
        }
        return true;
      });

      if (props.authToken) {
        config.modResults.push({
          type: "property",
          key: "authToken",
          value: String(props.authToken),
        });
      }
      if (props.username) {
        config.modResults.push({
          type: "property",
          key: "username",
          value: String(props.username),
        });
      }

      return config;
    });
  }

  config = withAppBuildGradle(config, (config) => {
    config.modResults.contents = mergeContents({
      tag: "rn-socure-sdk-dependencies",
      src: config.modResults.contents,
      newSrc: `    implementation "org.jetbrains.kotlin:kotlin-stdlib:${KOTLIN_VERSION}"`,
      anchor: /dependencies(?:\s+)?\{/,
      offset: 1,
      comment: "//",
    }).contents;

    return config;
  });

  config = withStringsXml(config, (config) => {
    AndroidConfig.Strings.setStringItem(
      [
        {
          $: { name: "socurePublicKey", translatable: "false" },
          _: props.publicKey,
        },
      ],
      config.modResults
    );
    return config;
  });

  return config;
};
