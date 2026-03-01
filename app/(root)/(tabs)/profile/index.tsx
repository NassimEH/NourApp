import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
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
import Feather from "@expo/vector-icons/Feather";

import { logout, uploadAvatarPhoto, updateUserAvatar } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppPreferences } from "@/lib/app-preferences";
import { useTabBarPreference } from "@/lib/tab-bar-preference";
import {
  THEME_LABELS,
  ICON_STYLE_LABELS,
  TEXT_SIZE_LABELS,
  ACCENT_COLOR_LABELS,
  LANGUAGE_LABELS,
} from "@/lib/app-preferences";

const homeBackground = require("@/assets/images/home-background.png");

const TAB_BAR_LABELS: Record<"custom" | "native", string> = {
  custom: "Liquid glass",
  native: "Natif iOS",
};

const ICON_SIZE = 22;
const ICON_COLOR = "#191D31";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

interface SettingsItemProp {
  iconName: FeatherIconName;
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
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
    activeOpacity={0.7}
    disabled={!onPress}
  >
    <View className="flex flex-row items-center gap-3">
      <Feather name={iconName} size={ICON_SIZE} color={ICON_COLOR} />
      <Text
        style={[styles.settingsItemText, textStyle === "text-danger" && styles.settingsItemDanger]}
      >
        {title}
      </Text>
    </View>
    <View className="flex flex-row items-center gap-2">
      {subtitle ? (
        <Text style={styles.settingsItemSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
      {showArrow && onPress ? (
        <Feather name="chevron-right" size={20} color={ICON_COLOR} />
      ) : null}
    </View>
  </TouchableOpacity>
);

/** Mon espace : une icône par entrée */
const PROFIL_SECTION_PRINCIPALE: { title: string; iconName: FeatherIconName; href?: "/qibla" }[] = [
  { title: "Horaires de prière", iconName: "calendar", href: "/qibla" },
  { title: "Sadaqa & dons", iconName: "credit-card" },
];

/** Personnalisation : icônes distinctes */
const PROFIL_SECTION_PERSONNALISATION: { title: string; iconName: FeatherIconName; key: string }[] = [
  { title: "Thème", iconName: "sun", key: "theme" },
  { title: "Style de la barre", iconName: "layers", key: "tab-bar" },
  { title: "Style des icônes", iconName: "star", key: "icon-style" },
  { title: "Taille du texte", iconName: "type", key: "text-size" },
  { title: "Couleur d'accent", iconName: "droplet", key: "accent" },
];

/** Paramètres : une icône par entrée, optionnellement href ou action share */
const PROFIL_SECTION_PARAMETRES: {
  title: string;
  iconName: FeatherIconName;
  href?: string;
  key?: "language" | "share" | "security";
}[] = [
  { title: "Mon profil", iconName: "user" },
  { title: "Sécurité", iconName: "shield", href: "/profile/security", key: "security" },
  { title: "Langue", iconName: "globe", href: "/profile/language", key: "language" },
  { title: "Aide & support", iconName: "help-circle" },
  { title: "Partager l'application", iconName: "share", key: "share" },
];

interface PermissionRowProps {
  iconName: FeatherIconName;
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
}: PermissionRowProps) => (
  <View style={styles.permissionRow}>
    <View style={styles.permissionRowLeft}>
      <Feather name={iconName} size={ICON_SIZE} color={ICON_COLOR} />
      <Text style={styles.settingsItemText}>{title}</Text>
    </View>
    <View style={[styles.switchWrapper, value && styles.switchWrapperActive]}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: "#c4c8cc", true: "#3d6b47" }}
        thumbColor="#ffffff"
        ios_backgroundColor="#c4c8cc"
      />
    </View>
  </View>
);

export default function ProfileScreen() {
  const { user, refetch } = useGlobalContext();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { tabBarVariant } = useTabBarPreference();
  const { theme, iconStyle, textSize, accentColor, locale } = useAppPreferences();

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          "Découvrez Nûr — horaires de prière, Qibla, lecture et bien plus. Téléchargez l'application !",
        title: "Partager Nûr",
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
    }, [])
  );

  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationGranted(status === "granted");
        if (status !== "granted") {
          Alert.alert(
            "Permission refusée",
            "Activez la localisation dans les réglages pour les horaires de prière et la météo."
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

  const handleNotificationsToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      Linking.openSettings();
    }
  };

  const handleChangePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Autorisez l'accès à la galerie pour changer votre photo de profil."
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
      const avatarUrl = await uploadAvatarPhoto(result.assets[0].uri);
      if (!avatarUrl) {
        Alert.alert(
          "Erreur",
          "Impossible d'envoyer la photo. Vérifiez la configuration du stockage (bucket Appwrite)."
        );
        return;
      }
      const updated = await updateUserAvatar(avatarUrl);
      if (updated) {
        await refetch();
      } else {
        Alert.alert("Erreur", "La mise à jour du profil a échoué.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Une erreur est survenue.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      Alert.alert("Déconnexion", "Vous avez été déconnecté avec succès.");
      refetch();
    } else {
      Alert.alert("Erreur", "La déconnexion a échoué.");
    }
  };

  return (
    <ImageBackground
      source={homeBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>Profil</Text>
            <Feather name="bell" size={ICON_SIZE} color={ICON_COLOR} />
          </View>

          <View style={styles.avatarBlock}>
            <View style={styles.avatarPlaceholderRing}>
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.avatar}
                />
              ) : null}
              <TouchableOpacity
                style={styles.editPencilButton}
                onPress={handleChangePhoto}
                disabled={uploadingPhoto}
                activeOpacity={0.7}
              >
                {uploadingPhoto ? (
                  <ActivityIndicator size="small" color="#3d6b47" />
                ) : (
                  <Feather name="edit-2" size={18} color={ICON_COLOR} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name ?? "Utilisateur"}</Text>
            <Text style={styles.userSubtitle}>
              Qu'Allah vous accorde Sa bénédiction
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mon espace</Text>
            {PROFIL_SECTION_PRINCIPALE.map((item, index) => (
              <SettingsItem
                key={index}
                iconName={item.iconName}
                title={item.title}
                onPress={
                  item.href === "/qibla"
                    ? () => router.push("/(root)/(tabs)/qibla")
                    : undefined
                }
              />
            ))}
          </View>

          <View style={[styles.section, styles.sectionBorder]}>
            <Text style={styles.sectionTitle}>Personnalisation</Text>
            {PROFIL_SECTION_PERSONNALISATION.map((item) => {
              const subtitle =
                item.key === "theme"
                  ? THEME_LABELS[theme]
                  : item.key === "tab-bar"
                    ? TAB_BAR_LABELS[tabBarVariant]
                    : item.key === "icon-style"
                      ? ICON_STYLE_LABELS[iconStyle]
                      : item.key === "text-size"
                        ? TEXT_SIZE_LABELS[textSize]
                        : ACCENT_COLOR_LABELS[accentColor];
              return (
                <SettingsItem
                  key={item.key}
                  iconName={item.iconName}
                  title={item.title}
                  subtitle={subtitle}
                  onPress={() => router.push(`/profile/${item.key}`)}
                />
              );
            })}
          </View>

          <View style={[styles.section, styles.sectionBorder]}>
            <Text style={styles.sectionTitle}>Permissions</Text>
            <PermissionRow
              iconName="bell"
              title="Notifications"
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
            />
            <PermissionRow
              iconName="map-pin"
              title="Localisation"
              value={locationGranted}
              onValueChange={handleLocationToggle}
            />
          </View>

          <View style={[styles.section, styles.sectionBorder]}>
            <Text style={styles.sectionTitle}>Paramètres</Text>
            {PROFIL_SECTION_PARAMETRES.map((item, index) => (
              <SettingsItem
                key={item.key ?? index}
                iconName={item.iconName}
                title={item.title}
                subtitle={item.key === "language" ? LANGUAGE_LABELS[locale] : undefined}
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

          <View style={[styles.section, styles.sectionBorder]}>
            <SettingsItem
              iconName="log-out"
              title="Déconnexion"
              textStyle="text-danger"
              showArrow={false}
              onPress={handleLogout}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { paddingHorizontal: 28, paddingBottom: 120 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#191D31",
  },
  avatarBlock: { alignItems: "center", marginTop: 24, marginBottom: 32 },
  editPencilButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    padding: 4,
  },
  avatarPlaceholderRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: "#191D31",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
    color: "#191D31",
    marginTop: 12,
  },
  userSubtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    color: "rgba(0,0,0,0.6)",
    marginTop: 4,
  },
  section: { marginTop: 8 },
  sectionBorder: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    paddingTop: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#3d6b47",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  permissionRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  switchWrapper: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    borderRadius: 22,
    padding: 2,
  },
  switchWrapperActive: {
    borderColor: "rgba(61,107,71,0.4)",
  },
  settingsItemText: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#191D31",
  },
  settingsItemSubtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "rgba(0,0,0,0.5)",
    maxWidth: 120,
  },
  settingsItemDanger: { color: "#dc2626" },
});
