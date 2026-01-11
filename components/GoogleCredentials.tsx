import React, { useEffect } from "react";
import { Pressable, Text, Alert } from "react-native";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import { googleAuth } from "../services/auth.service";
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID =
  "306063295732-tmob7ralpjtvmai8vnnaash99hfcrcgl.apps.googleusercontent.com";
const IOS_CLIENT_ID =
  "306063295732-5v26scvn6rs412ss9og6o34jf5j6ddtn.apps.googleusercontent.com";

type Props = {
  buttonText?: string;
};

export default function GoogleCredentials({
  buttonText = "Sign in with Google",
}: Props) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
  });

  //   console.log("Auth request URL:", request?.url);
  useEffect(() => {
    const run = async () => {
      if (!response) return;
      if (response.type !== "success") return;

      const idToken =
        response.params?.id_token || response.authentication?.idToken;

      if (!idToken) {
        Alert.alert("Error", "Google no devolvió id_token");
        return;
      }

      const data = await googleAuth(idToken);

      if (!data.success) {
        Alert.alert("Error", data.message || "Falló autenticación en backend");
        return;
      }

      // ✅ Guarda token de tu app

      if (data.isNewUser) {
        router.replace("/gameModes");
        Alert.alert("Bienvenido", "Cuenta creada con Google ✅");
      } else {
        // router.replace("/home")
        router.replace("/gameModes");
        Alert.alert("Listo", "Login exitoso ✅");
      }

      console.log("BACKEND AUTH:", data);
    };

    run();
  }, [response]);

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync({ showInRecents: true });
    } catch (e) {
      console.log("promptAsync error:", e);
      Alert.alert("Error", "No se pudo abrir Google Sign-In");
    }
  };

  return (
    <Pressable
      disabled={!request}
      onPress={handleGoogleSignIn}
      style={{ opacity: request ? 1 : 0.6 }}
      className="bg-white rounded-lg p-4 flex-row items-center justify-center active:opacity-80 mb-4 border border-gray-200"
    >
      <Image
        source={require("../assets/images/google-logo.png")}
        style={{ width: 20, height: 20, marginRight: 12 }}
        contentFit="contain"
      />
      <Text className="text-black text-base font-light">{buttonText}</Text>
    </Pressable>
  );
}
