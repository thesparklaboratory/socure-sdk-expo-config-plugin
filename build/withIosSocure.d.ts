import { ConfigPlugin } from "@expo/config-plugins";
export declare const withIosSocure: ConfigPlugin<{
    authToken?: string;
    publicKey: string;
    username?: string;
}>;
