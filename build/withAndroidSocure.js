"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidSocure = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const expo_build_properties_1 = require("expo-build-properties");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const withKotlinGradle_1 = require("./withKotlinGradle");
const KOTLIN_VERSION = "1.6.10";
const withAndroidSocure = (config, props) => {
    config = (0, expo_build_properties_1.withBuildProperties)(config, {
        android: {
            minSdkVersion: 24,
        },
    });
    config = (0, withKotlinGradle_1.withKotlinGradle)(config, KOTLIN_VERSION);
    if (props.authToken || props.username) {
        config = (0, config_plugins_1.withGradleProperties)(config, (config) => {
            config.modResults = config.modResults.filter((item) => {
                if (item.type === "property" && ["authToken", "username"].indexOf(item.key) !== -1) {
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
    config = (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        config.modResults.contents = (0, generateCode_1.mergeContents)({
            tag: "rn-socure-sdk-dependencies",
            src: config.modResults.contents,
            newSrc: `    implementation "org.jetbrains.kotlin:kotlin-stdlib:${KOTLIN_VERSION}"`,
            anchor: /dependencies(?:\s+)?\{/,
            offset: 1,
            comment: "//",
        }).contents;
        return config;
    });
    config = (0, config_plugins_1.withStringsXml)(config, (config) => {
        config_plugins_1.AndroidConfig.Strings.setStringItem([
            { $: { name: 'socurePublicKey', translatable: 'false' }, _: props.publicKey },
        ], config.modResults);
        return config;
    });
    return config;
};
exports.withAndroidSocure = withAndroidSocure;
