"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withAndroidSocure_1 = require("./withAndroidSocure");
const withIosSocure_1 = require("./withIosSocure");
const withSocure = (config, props) => {
    if (!props.publicKey) {
        throw new Error("Socure publicKey is required");
    }
    config = (0, withAndroidSocure_1.withAndroidSocure)(config, {
        publicKey: props.publicKey,
    });
    config = (0, withIosSocure_1.withIosSocure)(config, {
        publicKey: props.publicKey,
    });
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withSocure, "rn-socure-sdk");
