import {
  ConfigPlugin,
  withDangerousMod,
  withInfoPlist,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { promises } from "fs";
import path from "path";

export const withIosSocure: ConfigPlugin<{
  authToken?: string;
  publicKey: string;
  username?: string;
}> = (config, props) => {
  config = withInfoPlist(config, (config) => {
    config.modResults.socurePublicKey = props.publicKey;
    return config;
  });

  config = withDangerousMod(config, [
    "ios",
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async (config) => {
      const file = path.join(config.modRequest.platformProjectRoot, "Podfile");

      let contents = await promises.readFile(file, "utf8");
      contents =
        "plugin 'cocoapods-user-defined-build-types'\nenable_user_defined_build_types!\n" + contents;
      contents = mergeContents({
        tag: `socure-sdk-expo-config-plugin`,
        src: contents,
        newSrc: `  pod 'SocureSdk', :build_type => :dynamic_framework, :git =>'git@github.com:socure-inc/socure-docv-sdk-ios.git'`,
        anchor: /use_native_modules/,
        // We can't go after the use_native_modules block because it might have parameters, causing it to be multi-line (see react-native template).
        offset: 0,
        comment: "#",
      }).contents;
      await promises.writeFile(file, contents, "utf-8");
      return config;
    },
  ]);

  return config;
};
