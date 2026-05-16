import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { router } from "expo-router";

import { AuthTextField } from "@/components/auth/AuthTextField";
import { SignInGlassSurface } from "@/components/sign-in/SignInGlassSurface";
import { useAppTheme } from "@/lib/app-theme";

type Props = {
  panelTitle: string;
  hint: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  submitLabel: string;
  hasAccountLabel: string;
  signInLinkLabel: string;
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  loading?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  hintStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function SignUpAuthPanel({
  panelTitle,
  hint,
  nameLabel,
  namePlaceholder,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  confirmPasswordLabel,
  submitLabel,
  hasAccountLabel,
  signInLinkLabel,
  onSubmit,
  loading,
  titleStyle,
  hintStyle,
  textStyle,
}: Props) {
  const colors = useAppTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SignInGlassSurface elevated>
      <Text style={[styles.panelTitle, titleStyle, { color: colors.text }]}>
        {panelTitle}
      </Text>
      <Text style={[styles.hint, hintStyle, { color: colors.textMuted }]}>
        {hint}
      </Text>

      <AuthTextField
        label={nameLabel}
        icon="user"
        value={name}
        onChangeText={setName}
        placeholder={namePlaceholder}
        autoComplete="name"
        textContentType="name"
        labelStyle={textStyle}
        editable={!loading}
      />
      <AuthTextField
        label={emailLabel}
        icon="mail"
        value={email}
        onChangeText={setEmail}
        placeholder={emailPlaceholder}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        labelStyle={textStyle}
        editable={!loading}
      />
      <AuthTextField
        label={passwordLabel}
        icon="lock"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        labelStyle={textStyle}
        editable={!loading}
      />
      <AuthTextField
        label={confirmPasswordLabel}
        icon="lock"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        labelStyle={textStyle}
        editable={!loading}
      />

      <Pressable
        onPress={() =>
          onSubmit({ name, email, password, confirmPassword })
        }
        disabled={loading}
        style={({ pressed }) => [
          styles.primaryBtn,
          {
            backgroundColor: colors.accent,
            opacity: pressed || loading ? 0.88 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>{submitLabel}</Text>
        )}
      </Pressable>

      <View style={styles.signInRow}>
        <Text style={[styles.muted, textStyle, { color: colors.textMuted }]}>
          {hasAccountLabel}{" "}
        </Text>
        <Pressable
          onPress={() => router.replace("/sign-in")}
          disabled={loading}
          hitSlop={8}
        >
          <Text style={[styles.link, { color: colors.accent }]}>
            {signInLinkLabel}
          </Text>
        </Pressable>
      </View>
    </SignInGlassSurface>
  );
}

const styles = StyleSheet.create({
  panelTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    lineHeight: 21,
    marginBottom: 16,
  },
  primaryBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 4,
    marginBottom: 16,
    shadowColor: "#191D31",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 52,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
  signInRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  muted: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
  },
  link: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
  },
});
