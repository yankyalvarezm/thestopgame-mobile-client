import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import TheStopGameTitle from "@/components/TheStopGameTitle";
import { router } from "expo-router";
import { signup } from "@/services/users.service";

function isValidEmail(email: string) {
  // simple y suficiente para UI (el backend valida de verdad)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getPasswordIssues(pw: string) {
  const issues = [];
  if (pw.length < 8) issues.push("Minimum 8 characters");
  if (!/[a-z]/.test(pw)) issues.push("At least 1 lowercase letter");
  if (!/[A-Z]/.test(pw)) issues.push("At least 1 uppercase letter");
  if (!/[0-9]/.test(pw)) issues.push("At least 1 number");
  // opcional: especial
  // if (!/[^A-Za-z0-9]/.test(pw)) issues.push("At least 1 special character");
  return issues;
}

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const emailOk = useMemo(() => isValidEmail(email), [email]);
  const passwordIssues = useMemo(() => getPasswordIssues(password), [password]);
  const passwordOk = passwordIssues.length === 0;

  const confirmOk = useMemo(() => {
    if (!confirmPassword) return false;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const canSubmit = emailOk && passwordOk && confirmOk;

  const handleSignUp = async () => {
    const res = await signup(email, password);
    console.log("signup res:", res);
    if (res.success) {
      router.replace("/gameModes");
    } else {
      Alert.alert("Error", res.message);
    }
    // protección extra por si acaso
    setTouched({ email: true, password: true, confirmPassword: true });

    if (!emailOk) {
      Alert.alert("Fix this", "Please enter a valid email.");
      return;
    }
    if (!passwordOk) {
      Alert.alert("Fix this", "Your password doesn’t meet the requirements.");
      return;
    }
    if (!confirmOk) {
      Alert.alert("Fix this", "Passwords do not match.");
      return;
    }

    // Aquí luego llamas tu backend /auth/signup o /users/signup
    Alert.alert("✅ Ready", "User already created");
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerClassName="flex-1 items-center justify-center px-6 py-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-8">
          <TheStopGameTitle />
        </View>

        <View className="bg-gray-100 rounded-2xl p-6 w-full max-w-md">
          <Pressable
            onPress={handleGoogleSignIn}
            className="bg-white rounded-lg p-4 flex-row items-center justify-center active:opacity-80 mb-4 border border-gray-200"
          >
            <Image
              source={require("../assets/images/google-logo.png")}
              style={{ width: 20, height: 20, marginRight: 12 }}
              contentFit="contain"
            />
            <Text className="text-black text-base font-light">
              Sign in with google
            </Text>
          </Pressable>

          <View className="flex-row items-center justify-center mb-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-600 text-sm font-light">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Email */}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            className={`bg-white rounded-lg px-4 mb-2 border ${
              touched.email && !emailOk ? "border-red-500" : "border-gray-200"
            }`}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
          {touched.email && !emailOk ? (
            <Text className="text-red-600 text-xs mb-3">
              Please enter a valid email.
            </Text>
          ) : (
            <View className="mb-3" />
          )}

          {/* Password */}
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            onBlur={() => setTouched((p) => ({ ...p, password: true }))}
            secureTextEntry
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            className={`bg-white rounded-lg px-4 mb-2 border ${
              touched.password && !passwordOk
                ? "border-red-500"
                : "border-gray-200"
            }`}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          {/* Password requirements */}
          {(touched.password || password.length > 0) && !passwordOk ? (
            <View className="mb-3">
              {passwordIssues.map((msg) => (
                <Text key={msg} className="text-red-600 text-xs">
                  • {msg}
                </Text>
              ))}
            </View>
          ) : (
            <Text className="text-gray-500 text-xs mb-3">
              Password must include 8+ chars, uppercase, lowercase, and a
              number.
            </Text>
          )}

          {/* Confirm Password */}
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
            secureTextEntry
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            className={`bg-white rounded-lg px-4 mb-2 border ${
              touched.confirmPassword && !confirmOk
                ? "border-red-500"
                : "border-gray-200"
            }`}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
          {touched.confirmPassword && !confirmOk ? (
            <Text className="text-red-600 text-xs mb-3">
              Passwords do not match.
            </Text>
          ) : (
            <View className="mb-3" />
          )}

          {/* Sign Up */}
          <Pressable
            onPress={handleSignUp}
            disabled={!canSubmit}
            className={`rounded-lg p-4 items-center justify-center mb-6 ${
              canSubmit ? "bg-black active:opacity-80" : "bg-gray-400"
            }`}
          >
            <Text className="text-white text-base font-medium">Sign Up</Text>
          </Pressable>

          <View className="items-center mb-4 flex-row justify-center">
            <Text className="text-gray-700 text-sm">
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/Login")}>
              <Text className="text-red font-medium text-sm underline">
                Login
              </Text>
            </Pressable>
          </View>

          <Text className="text-xs text-gray-600 text-center mb-4">
            Signing in for Grupo Medrano sistem means you agree to the{" "}
            <Text className="underline">Privacy Policy</Text> and{" "}
            <Text className="underline">Terms of Service</Text>
          </Text>

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
