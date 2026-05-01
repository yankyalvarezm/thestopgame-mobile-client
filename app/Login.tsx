import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import TheStopGameTitle from "@/components/TheStopGameTitle";
import { login } from "@/services/auth.service";
import { router } from "expo-router";
import GoogleCredentials from "@/components/GoogleCredentials";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    const res = await login(normalizedEmail, password);
    setIsSubmitting(false);

    if (res.success) {
      router.replace("/gameModes");
    } else {
      Alert.alert("Error", res.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerClassName="flex-1 items-center justify-center px-6 py-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Card del formulario */}
        <View className="items-center mb-8">
          <TheStopGameTitle />
        </View>
        <View className="bg-gray-100 rounded-2xl p-6 w-full max-w-md">
          {/* Botón Sign in with Google */}
          <GoogleCredentials />

          {/* Separador "or" */}
          <View className="flex-row items-center justify-center mb-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-600 text-sm font-light">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Campo Email */}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-white rounded-lg px-4 mb-4 border border-gray-200"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          {/* Campo Password */}
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="bg-white rounded-lg px-4 mb-6 border border-gray-200"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          {/* Botón Login */}
          <Pressable
            onPress={handleLogin}
            disabled={isSubmitting}
            className={`rounded-lg p-4 items-center justify-center mb-6 ${
              isSubmitting ? "bg-gray-500" : "bg-black active:opacity-80"
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-medium">Login</Text>
            )}
          </Pressable>

          {/* Don't have an account? Sign Up */}
          <View className="items-center mb-4 flex-row justify-center">
            <Text className="text-gray-700 text-sm">
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/SignUp")}>
              <Text className="text-red font-medium text-sm underline">
                Sign Up
              </Text>
            </Pressable>
          </View>

          {/* Términos y Privacidad */}
          <Text className="text-xs text-gray-600 text-center mb-4">
            Signing in for Grupo Medrano sistem means you agree to the{" "}
            <Text className="underline">Privacy Policy</Text> and{" "}
            <Text className="underline">Terms of Service</Text>
          </Text>

          {/* Need help? */}
          <Text className="text-xs text-gray-600 text-center">
            Need help? contact{" "}
            <Text className="underline">jalvarez@grupomedrano.com.do</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 48,
    lineHeight: 20,
  },
});
