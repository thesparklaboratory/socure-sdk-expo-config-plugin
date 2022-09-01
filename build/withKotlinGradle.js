"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withKotlinGradle = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const kotlinClassPath = "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion";
/**
 * [Step 4](https://github.com/wix/Detox/blob/master/docs/Introduction.Android.md#4-add-kotlin). Add Kotlin.
 *
 * Lifted from [unimodules-test-core](https://github.com/expo/expo/blob/master/packages/unimodules-test-core/app.plugin.js).
 *
 * @param config Expo config
 * @param version Kotlin version to use
 */
const withKotlinGradle = (config, version) => {
    return (0, config_plugins_1.withProjectBuildGradle)(config, (config) => {
        console.log(`[socure-sdk-expo-config-plugin] Setting Kotlin version to: ${version}. This could lead to Android build issues.`);
        if (config.modResults.language === "groovy") {
            config.modResults.contents = setKotlinVersion(config.modResults.contents, version);
            config.modResults.contents = setKotlinClassPath(config.modResults.contents);
        }
        else {
            throw new Error("Cannot setup kotlin because the build.gradle is not groovy");
        }
        return config;
    });
};
exports.withKotlinGradle = withKotlinGradle;
function setKotlinVersion(buildGradle, version) {
    const pattern = /kotlinVersion\s?=\s?(["'])(?:(?=(\\?))\2.)*?\1/g;
    const replacement = `kotlinVersion = "${version}"`;
    if (buildGradle.match(pattern)) {
        // Select kotlinVersion = '***' and replace the contents between the quotes.
        return buildGradle.replace(pattern, replacement);
    }
    return buildGradle.replace(/ext\s?{/, `ext {
        ${replacement}`);
}
function setKotlinClassPath(buildGradle) {
    if (buildGradle.includes(kotlinClassPath)) {
        return buildGradle;
    }
    buildGradle = buildGradle.replace(/dependencies\s?{/, `dependencies {
        classpath "${kotlinClassPath}"`);
    return buildGradle;
}
