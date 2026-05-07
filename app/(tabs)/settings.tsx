import { router, Stack } from "expo-router";
import {
    Bell,
    ChevronLeft,
    ChevronRight,
    Palette,
    Shield,
    Type,
    X,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../src/components/ui/Typography";
import { COLORS } from "../../src/constants/theme";
import { useSettingsStore } from "../../src/store/settingsStore";

export default function SettingsScreen() {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    hapticEnabled,
    setHapticEnabled,
  } = useSettingsStore();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);

  const SettingItem = ({
    icon: Icon,
    title,
    status,
    onPress,
    isSwitch,
  }: any) => (
    <TouchableOpacity style={styles.itemCard} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={styles.iconBox}>
          <Icon size={20} color={COLORS.white} />
        </View>
        <Typography style={styles.itemTitle}>{title}</Typography>
      </View>
      <View style={styles.itemRight}>
        {status && (
          <Typography
            color={COLORS.gray5}
            variant="label"
            style={{ marginRight: 8 }}
          >
            {status}
          </Typography>
        )}
        {isSwitch ? (
          <View style={[styles.switch, hapticEnabled && styles.switchActive]}>
            <View
              style={[
                styles.switchThumb,
                hapticEnabled && styles.switchThumbActive,
              ]}
            />
          </View>
        ) : (
          <ChevronRight size={18} color={COLORS.gray4} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color={COLORS.white} size={28} />
        </TouchableOpacity>
        <Typography variant="h3">Settings</Typography>
        <TouchableOpacity onPress={() => router.back()}>
          <X color={COLORS.gray5} size={28} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.section}>
          <Typography
            variant="label"
            color={COLORS.gray5}
            style={styles.sectionTitle}
          >
            SECURITY & PRIVACY
          </Typography>
          <SettingItem
            icon={Shield}
            title="Private Lock & PIN"
            status="Disabled"
            onPress={() => router.push("/vault")}
          />
        </View>

        <View style={styles.section}>
          <Typography
            variant="label"
            color={COLORS.gray5}
            style={styles.sectionTitle}
          >
            APPEARANCE
          </Typography>
          <SettingItem
            icon={Palette}
            title="Theme"
            status={theme.toUpperCase()}
            onPress={() => setShowThemeModal(true)}
          />
          <View style={{ height: 12 }} />
          <SettingItem
            icon={Type}
            title="Font Size"
            status={fontSize.toUpperCase()}
            onPress={() => setShowFontModal(true)}
          />
        </View>

        <View style={styles.section}>
          <Typography
            variant="label"
            color={COLORS.gray5}
            style={styles.sectionTitle}
          >
            FEEDBACK
          </Typography>
          <SettingItem
            icon={Bell}
            title="Haptic Feedback"
            isSwitch
            onPress={() => setHapticEnabled(!hapticEnabled)}
          />
        </View>
      </ScrollView>

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Typography variant="h3" style={{ marginBottom: 20 }}>
              Select Theme
            </Typography>
            {(["dark", "light", "system"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.modalItem,
                  theme === t && styles.modalItemActive,
                ]}
                onPress={() => {
                  setTheme(t);
                  setShowThemeModal(false);
                }}
              >
                <Typography color={theme === t ? COLORS.red : COLORS.white}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Typography>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowThemeModal(false)}
            >
              <Typography color={COLORS.gray5}>Cancel</Typography>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Font Size Selection Modal */}
      {showFontModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Typography variant="h3" style={{ marginBottom: 20 }}>
              Select Font Size
            </Typography>
            {(["small", "medium", "large"] as const).map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.modalItem,
                  fontSize === s && styles.modalItemActive,
                ]}
                onPress={() => {
                  setFontSize(s);
                  setShowFontModal(false);
                }}
              >
                <Typography color={fontSize === s ? COLORS.red : COLORS.white}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Typography>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowFontModal(false)}
            >
              <Typography color={COLORS.gray5}>Cancel</Typography>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray1,
  },
  scroll: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 12,
    letterSpacing: 1,
  },
  itemCard: {
    backgroundColor: COLORS.gray1,
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 72,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.gray2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  switch: {
    width: 50,
    height: 28,
    backgroundColor: COLORS.gray3,
    borderRadius: 14,
    padding: 2,
  },
  switchActive: {
    backgroundColor: COLORS.red,
  },
  switchThumb: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  switchThumbActive: {
    alignSelf: "flex-end",
  },
  backBtn: {
    marginLeft: -5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: COLORS.gray1,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 300,
  },
  modalItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalItemActive: {
    backgroundColor: "rgba(255,82,82,0.2)",
  },
  modalClose: {
    marginTop: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
});
