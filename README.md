# socure-sdk-expo-config-plugin

Config plugin to auto-configure `rn-socure-sdk` when the native code is generated (`expo prebuild`).

## Expo installation

> Tested against Expo SDK 46

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).
> First install the package with yarn, npm, or [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

** For now, manually add the following to package.json **

```
    "@sparklaboratory/socure-sdk-expo-config-plugin": "git+ssh://git@github.com:thesparklaboratory/socure-sdk-expo-config-plugin.git",
    "rn-socure-sdk": "git+ssh://git@github.com:thesparklaboratory/socure-docv-wrapper-react-native.git"
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to verify your identity."
      }
    },
    "plugins": ["@thesparklaboratory/socure-sdk-expo-config-plugin", {
      "publicKey": "YOUR_PUBLIC_KEY"
    }]
  }
}
```

Install cocoapods user defined build types:

`sudo gem install cocoapods-user-defined-build-types`

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `publicKey` (_string_): Public key for accessing socure docv sdk.
- `authToken` (_string_): Socure references this in their RN wrapper.
- `username` (_string_): Socure references this in their RN wrapper.

#### Example

```json
{
  "expo": {
    "android": {
      "permissions": [
        "CAMERA"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to verify your identity."
      }
    },
    "plugins": [
      [
        "@sparklaboratory/socure-sdk-expo-config-plugin",
        {
          "publicKey": "YOUR_PUBLIC_KEY_HERE",
          "authToken": "referenced in the socure docs, maybe not needed",
          "username": "referenced in the socure docs, maybe not needed",
        }
      ]
    ]
  }
}
```
