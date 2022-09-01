"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withIosSocure = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const withIosSocure = (config, props) => {
    config = (0, config_plugins_1.withInfoPlist)(config, (config) => {
        config.modResults.socurePublicKey = props.authToken;
        return config;
    });
    config = (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        async (config) => {
            const file = path_1.default.join(config.modRequest.platformProjectRoot, "Podfile");
            let contents = await fs_1.promises.readFile(file, "utf8");
            contents =
                "plugin 'cocoapods-user-defined-build-types'\nenable_user_defined_build_types!\n";
            contents = (0, generateCode_1.mergeContents)({
                tag: `socure-sdk-expo-config-plugin`,
                src: contents,
                newSrc: `  pod 'SocureSdk', :build_type => :dynamic_framework, :git =>'git@github.com:socure-inc/socure-ios-sdk.git'`,
                anchor: /use_native_modules/,
                // We can't go after the use_native_modules block because it might have parameters, causing it to be multi-line (see react-native template).
                offset: 0,
                comment: "#",
            }).contents;
            await fs_1.promises.writeFile(file, contents, "utf-8");
            return config;
        },
    ]);
    return config;
};
exports.withIosSocure = withIosSocure;
