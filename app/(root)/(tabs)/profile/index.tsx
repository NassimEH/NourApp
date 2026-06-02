import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppIcon, type AppIconName } from "@/components/AppIcon";

import { getProfileAvatarUri, setProfileAvatarUri } from "@/lib/profile-avatar";
import { useGlobalContext } from "@/lib/global-provider";
import { logout as supabaseLogout } from "@/lib/supabase/auth";
import { useAppPreferences } from "@/lib/app-preferences";
import { useTabBarPreference } from "@/lib/tab-bar-preference";
import { useAppTheme } from "@/lib/app-theme";
import { useAppTypography } from "@/lib/app-typography";
import { useTranslation, getPreferenceSubtitle } from "@/lib/i18n";
import { AVAILABLE_RECITERS } from "@/lib/quran/types";
import { useQuranAudioContextOptional } from "@/lib/quran/QuranAudioContext";
import {
  arePrayerNotificationsEnabled,
  rescheduleNextPrayerNotification,
  setPrayerNotificationsEnabled,
} from "@/lib/notifications/prayer-notifications";
import { usePrayerTimes } from "@/lib/usePrayerTimes";
import { ScreenBackground } from "@/components/ScreenBackground";
import {
  screenPageHeaderSpacing,
  screenScrollContent,
} from "@/constants/screen-layout";
import { MIN_TOUCH_TARGET } from "@/lib/ui/spacing";
import { ScreenPageHeader } from "@/components/ScreenPageHeader";

const ICON_SIZE = 22;

interface SettingsItemProp {
  iconName: AppIconName;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
  subtitle?: string;
}

const SettingsItem = ({
  iconName,
  title,
  onPress,
  textStyle,
  showArrow = true,
  subtitle,
}: SettingsItemProp) => {
  const colors = useAppTheme();
  const typography = useAppTypography();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.settingsRow}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View className="flex flex-row items-center gap-3">
        <AppIcon name={iconName} size={ICON_SIZE} color={colors.icon} />
        <Text
          style={[
            styles.settingsItemText,
            { color: colors.text, fontSize: typography.bodyMedium },
            textStyle === "text-danger" && { color: colors.danger },
          ]}
        >
          {title}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-2">
        {subtitle ? (
          <Text
            style={[
              styles.settingsItemSubtitle,
              { color: colors.textMuted, fontSize: typography.subtitle },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
        {showArrow && onPress ? (
          <AppIcon name="chevron-right" size={20} color={colors.icon} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const PROFIL_SECTION_PRINCIPALE: {
  titleKey: string;
  iconName: AppIconName;
  href?:
    | "/qibla"
    | "/profile/favorites"
    | "/(root)/sadaqa-goal"
    | "/(root)/offline-recitations";
}[] = [
  { titleKey: "profile.prayerTimes", iconName: "calendar", href: "/qibla" },
  { titleKey: "profile.favorites", iconName: "heart", href: "/profile/favorites" },
  {
    titleKey: "profile.sadaqa",
    iconName: "credit-card",
    href: "/(root)/sadaqa-goal",
  },
  {
    titleKey: "profile.offlineRecitations",
    iconName: "download",
    href: "/(root)/offline-recitations",
  },
];

const PROFIL_SECTION_PERSONNALISATION: {
  titleKey: string;
  iconName: AppIconName;
  key: string;
}[] = [
  { titleKey: "profile.theme", iconName: "sun", key: "theme" },
  { titleKey: "profile.tabBarStyle", iconName: "layers", key: "tab-bar" },
  { titleKey: "profile.iconStyle", iconName: "star", key: "icon-style" },
  { titleKey: "profile.textSize", iconName: "type", key: "text-size" },
  { titleKey: "profile.accentColor", iconName: "droplet", key: "accent" },
  {
    titleKey: "preferences.prayerMethodTitle",
    iconName: "clock",
    key: "prayer-method",
  },
];

const PROFIL_SECTION_PARAMETRES: {
  titleKey: string;
  iconName: AppIconName;
  href?: string;
  key?: "language" | "share" | "security";
}[] = [
  { titleKey: "profile.myProfile", iconName: "user" },
  { titleKey: "profile.security", iconName: "shield", href: "/profile/security", key: "security" },
  { titleKey: "profile.language", iconName: "globe", href: "/profile/language", key: "language" },
  { titleKey: "profile.help", iconName: "help-circle" },
  { titleKey: "profile.shareApp", iconName: "share", key: "share" },
];

interface PermissionRowProps {
  iconName: AppIconName;
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const PermissionRow = ({
  iconName,
  title,
  value,
  onValueChange,
  disabled,
}: PermissionRowProps) => {
  const colors = useAppTheme();
  const typography = useAppTypography();
  return (
    <View style={styles.permissionRow}>
      <View style={styles.permissionRowLeft}>
        <AppIcon name={iconName} size={ICON_SIZE} color={colors.icon} />
        <Text
          style={[
            styles.settingsItemText,
            { color: colors.text, fontSize: typography.bodyMedium },
          ]}
        >
          {title}
        </Text>
      </View>
      <View
        style={[
          styles.switchWrapper,
          { borderColor: colors.border },
          value && { borderColor: colors.accent },
        ]}
      >
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{ false: colors.switchTrackOff, true: colors.accent }}
          thumbColor="#ffffff"
          ios_backgroundColor={colors.switchTrackOff}
        />
      </View>
    </View>
  );
};

export default function ProfileScreen() {
  const { user, refetch, isLogged, enterAsGuest } = useGlobalContext();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      getProfileAvatarUri().then(setLocalAvatarUri);
    }, [])
  );
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { tabBarVariant } = useTabBarPreference();
  const { theme, iconStyle, textSize, accentColor, locale, quranReciter, setQuranReciter } =
    useAppPreferences();
  const quranAudio = useQuranAudioContextOptional();
  const colors = useAppTheme();
  const typography = useAppTypography();
  const { t, rtlTextStyle, rtlViewStyle } = useTranslation();
  const { timings: prayerTimes } = usePrayerTimes();
  const currentReciterName =
    AVAILABLE_RECITERS.find((r) => r.id === quranReciter)?.name ?? "—";

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: t("profile.shareMessage"),
        title: t("profile.shareTitle"),
      });
    } catch {
      // annulé ou erreur
    }
  };

  const refreshLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationGranted(status === "granted");
    } catch {
      setLocationGranted(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshLocationPermission();
      getProfileAvatarUri().then(setLocalAvatarUri);
      arePrayerNotificationsEnabled().then(setNotificationsEnabled);
    }, [])
  );

  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationGranted(status === "granted");
        if (status !== "granted") {
          Alert.alert(
            t("profile.locationDeniedTitle"),
            t("profile.locationDeniedBody")
          );
        }
      } catch {
        setLocationGranted(false);
      }
    } else {
      setLocationGranted(false);
      Linking.openSettings();
    }
  };

  const handleNotificationsToggle = async (value: boolean) => {
    if (value) {
      const ok = await setPrayerNotificationsEnabled(true);
      setNotificationsEnabled(ok);
      if (!ok) {
        Alert.alert(
          t("profile.notificationsDeniedTitle"),
          t("profile.notificationsDeniedBody")
        );
      } else if (prayerTimes) {
        await rescheduleNextPrayerNotification(prayerTimes);
      }
    } else {
      await setPrayerNotificationsEnabled(false);
      setNotificationsEnabled(false);
    }
  };

  const handleChangePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("profile.photoPermissionTitle"),
          t("profile.photoPermissionBody")
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;

      setUploadingPhoto(true);
      const savedUri = await setProfileAvatarUri(result.assets[0].uri);
      if (savedUri) {
        setLocalAvatarUri(savedUri);
        await refetch();
      } else {
        Alert.alert(t("profile.logoutError"), t("profile.photoSaveError"));
      }
    } catch (e) {
      console.error(e);
      Alert.alert(t("profile.logoutError"), t("profile.photoGenericError"));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogout = async () => {
    const ok = await supabaseLogout();
    if (ok) {
      enterAsGuest();
      Alert.alert(t("profile.logoutSuccess"), t("profile.logoutSuccessBody"));
      await refetch();
    } else {
      Alert.alert(t("profile.logoutError"), t("profile.logoutErrorBody"));
    }
  };

  const handleSelectFavoriteReciter = () => {
    Alert.alert(
      t("profile.favoriteReciter"),
      t("profile.favoriteReciterSubtitle"),
      [
        ...AVAILABLE_RECITERS.map((reciter) => ({
          text: reciter.id === quranReciter ? `✓ ${reciter.name}` : reciter.name,
          onPress: () => {
            setQuranReciter(reciter.id);
            if (quranAudio) {
              void quranAudio.setReciter(reciter.id);
            }
          },
        })),
        { text: t("common.cancel"), style: "cancel" as const },
      ]
    );
  };

  return (
    <ScreenBackground style={styles.background}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenPageHeader
          title={t("profile.title")}
          subtitle={t("screens.profileSubtitle")}
          style={screenPageHeaderSpacing}
          rightElement={<AppIcon name="bell" size={ICON_SIZE} color={colors.icon} />}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, rtlViewStyle]}
        >
          <View style={styles.avatarBlock}>
            <View style={styles.avatarRingWrapper}>
              <View
                style={[
                  styles.avatarPlaceholderRing,
                  { borderColor: colors.icon },
                ]}
              >
                {(localAvatarUri ?? user?.avatar) ? (
                  <Image
                    source={{ uri: localAvatarUri ?? user?.avatar }}
                    style={styles.avatar}
                  />
                ) : null}
              </View>
              <TouchableOpacity
                style={[
                  styles.editPencilButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.icon,
                  },
                ]}
                onPress={handleChangePhoto}
                disabled={uploadingPhoto}
                activeOpacity={0.7}
              >
                {uploadingPhoto ? (
                  <ActivityIndicator size="small" color={colors.accent} />
                ) : (
                  <View style={styles.editPencilIconWrap}>
                    <AppIcon name="edit-2" size={16} color={colors.icon} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.userName,
                rtlTextStyle,
                { color: colors.text, fontSize: typography.title },
              ]}
            >
              {user?.name ?? t("profile.defaultUser")}
            </Text>
            <Text
              style={[
                styles.userSubtitle,
                rtlTextStyle,
                { color: colors.textMuted, fontSize: typography.subtitle },
              ]}
            >
              {t("profile.blessing")}
            </Text>
          </View>

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.accent,
                  fontSize: typography.sectionTitle,
                },
              ]}
            >
              {t("profile.sectionMySpace")}
            </Text>
            {PROFIL_SECTION_PRINCIPALE.map((item, index) => (
              <SettingsItem
                key={index}
                iconName={item.iconName}
                title={t(item.titleKey)}
                onPress={
                  item.href
                    ? () =>
                        router.push(
                          item.href === "/qibla"
                            ? "/(root)/(tabs)/qibla"
                            : "/(root)/(tabs)/profile/favorites"
                        )
                    : undefined
                }
              />
            ))}
          </View>

          <View
            style={[styles.section, styles.sectionBorder, { borderTopColor: colors.border }]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.accent, fontSize: typography.sectionTitle },
              ]}
            >
              {t("profile.sectionCustomization")}
            </Text>
            {PROFIL_SECTION_PERSONNALISATION.map((item) => {
              const prefValue =
                item.key === "theme"
                  ? theme
                  : item.key === "tab-bar"
                    ? tabBarVariant
                    : item.key === "icon-style"
                      ? iconStyle
                      : item.key === "text-size"
                        ? textSize
                        : accentColor;
              const subtitle = getPreferenceSubtitle(
                locale,
                item.key,
                prefValue
              );
              return (
                <SettingsItem
                  key={item.key}
                  iconName={item.iconName}
                  title={t(item.titleKey)}
                  subtitle={subtitle}
                  onPress={() => {
                    if (item.key === "prayer-method") {
                      router.push("/(root)/prayer-method");
                      return;
                    }
                    router.push(`/profile/${item.key}`);
                  }}
                />
              );
            })}
            <SettingsItem
              iconName="mic"
              title={t("profile.favoriteReciter")}
              subtitle={currentReciterName}
              onPress={handleSelectFavoriteReciter}
            />
          </View>

          <View
            style={[styles.section, styles.sectionBorder, { borderTopColor: colors.border }]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.accent, fontSize: typography.sectionTitle },
              ]}
            >
              {t("profile.sectionPermissions")}
            </Text>
            <PermissionRow
              iconName="bell"
              title={t("profile.notifications")}
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
            />
            <PermissionRow
              iconName="map-pin"
              title={t("profile.location")}
              value={locationGranted}
              onValueChange={handleLocationToggle}
            />
          </View>

          <View
            style={[styles.section, styles.sectionBorder, { borderTopColor: colors.border }]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.accent, fontSize: typography.sectionTitle },
              ]}
            >
              {t("profile.sectionSettings")}
            </Text>
            {PROFIL_SECTION_PARAMETRES.map((item, index) => (
              <SettingsItem
                key={item.key ?? index}
                iconName={item.iconName}
                title={t(item.titleKey)}
                subtitle={
                  item.key === "language"
                    ? getPreferenceSubtitle(locale, "language", locale)
                    : undefined
                }
                onPress={
                  item.href
                    ? () => router.push(item.href as "/profile/language" | "/profile/security")
                    : item.key === "share"
                      ? handleShareApp
                      : undefined
                }
              />
            ))}
          </View>

          {isLogged ? (
            <View
              style={[styles.section, styles.sectionBorder, { borderTopColor: colors.border }]}
            >
              <SettingsItem
                iconName="log-out"
                title={t("profile.logout")}
                textStyle="text-danger"
                showArrow={false}
                onPress={handleLogout}
              />
            </View>
          ) : null}

        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scrollContent: {
    ...screenScrollContent,
    paddingTop: 4,
  },
  avatarBlock: { alignItems: "center", marginTop: 24, marginBottom: 32 },
  avatarRingWrapper: {
    width: 140,
    height: 140,
    position: "relative",
  },
  editPencilButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 10,
  },
  editPencilIconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  userName: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans-Bold",
    marginTop: 12,
  },
  userSubtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    marginTop: 4,
  },
  section: { marginTop: 8 },
  sectionBorder: {
    borderTopWidth: 1,
    paddingTop: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: 10,
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: 10,
  },
  permissionRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  switchWrapper: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 2,
  },
  settingsItemText: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Medium",
  },
  settingsItemSubtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    maxWidth: 120,
  },
});
