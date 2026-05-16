import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { router } from "expo-router";

import { AuthTextField } from "@/components/auth/AuthTextField";
import { useAppTheme } from "@/lib/app-theme";
import icons from "@/constants/icons";

type Props = {
  sectionTitle: string;
  emailLabel: string;
  passwordLabel: string;
  emailPlaceholder: string;
  signInLabel: string;
  googleLabel: string;
  guestLabel: string;
  orDivider: string;
  noAccountLabel: string;
  signUpLinkLabel: string;
  onEmailSignIn: (email: string, password: string) => void;
  onGooglePress: () => void;
  onGuestPress: () => void;
  emailLoading?: boolean;
  googleLoading?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function SignInAuthPanel({
  sectionTitle,
  emailLabel,
  passwordLabel,
  emailPlaceholder,
  signInLabel,
  googleLabel,
  guestLabel,
  orDivider,
  noAccountLabel,
  signUpLinkLabel,
  onEmailSignIn,
  onGooglePress,
  onGuestPress,
  emailLoading,
  googleLoading,
  titleStyle,
  textStyle,
}: Props) {
  const colors = useAppTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const busy = emailLoading || googleLoading;

  return (
    <View style={styles.root}>
      <Text style={[styles.sectionTitle, titleStyle, { color: colors.text }]}>
        {sectionTitle}
      </Text>

      <Pressable
        onPress={onGooglePress}
        disabled={busy}
        style={({ pressed }) => [
          styles.googleBtn,
          {
            opacity: pressed || busy ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}
      >
        {googleLoading ? (
          <ActivityIndicator color="#191D31" />
        ) : (
          <>
            <Image
              source={icons.google}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleLabel}>{googleLabel}</Text>
          </>
        )}
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, textStyle, { color: colors.textMuted }]}>
          {orDivider}
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      <AuthTextField
        label={emailLabel}
        icon="mail"
        variant="flat"
        value={email}
        onChangeText={setEmail}
        placeholder={emailPlaceholder}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        labelStyle={textStyle}
        editable={!busy}
      />
      <AuthTextField
        label={passwordLabel}
        icon="lock"
        variant="flat"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        labelStyle={textStyle}
        editable={!busy}
      />

      <Pressable
        onPress={() => onEmailSignIn(email, password)}
        disabled={busy}
        style={({ pressed }) => [
          styles.emailBtn,
          {
            backgroundColor: colors.accent,
            opacity: pressed || busy ? 0.9 : 1,
          },
        ]}
      >
        {emailLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.emailBtnText}>{signInLabel}</Text>
        )}
      </Pressable>

      <View style={styles.signUpRow}>
        <Text style={[styles.signUpMuted, textStyle, { color: colors.textMuted }]}>
          {noAccountLabel}{" "}
        </Text>
        <Pressable onPress={() => router.push("/sign-up")} disabled={busy} hitSlop={8}>
          <Text style={[styles.signUpLink, { color: colors.accent }]}>
            {signUpLinkLabel}
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onGuestPress}
        disabled={busy}
        style={styles.guestPress}
        hitSlop={12}
      >
        <Text style={[styles.guestLabel, { color: colors.textMuted }]}>
          {guestLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 20,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
    minHeight: 54,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    shadowColor: "#191D31",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 8,
    marginBottom: 24,
  },
  googleIcon: {
    width: 22,
    height: 22,
  },
  googleLabel: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#191D31",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 14,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
  },
  emailBtn: {
    width: "100%",
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  emailBtnText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#fff",
  },
  signUpRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  signUpMuted: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
  },
  signUpLink: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
  },
  guestPress: {
    alignItems: "center",
    paddingVertical: 8,
  },
  guestLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    textDecorationLine: "underline",
  },
});
