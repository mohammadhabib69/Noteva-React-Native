import { router, Stack } from "expo-router";
import {
    ChevronLeft,
    FolderPlus,
    List as ListIcon,
    Lock,
    Search,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PinModal } from "../src/components/ui/PinModal";
import { Typography } from "../src/components/ui/Typography";
import { COLORS } from "../src/constants/theme";
import { useNoteStore } from "../src/store/noteStore";
import { useVaultStore } from "../src/store/vaultStore";

export default function VaultScreen() {
  const { notes } = useNoteStore();
  const { isUnlocked, hasPin, setPin, unlockVault, lockVault } =
    useVaultStore();
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [hasPinValue, setHasPinValue] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPin();
  }, []);

  const checkPin = async () => {
    const exists = await hasPin();
    setHasPinValue(exists);
    // Only show PIN modal if not already unlocked
    if (!isUnlocked) {
      setPinModalVisible(true);
    }
    setIsLoading(false);
  };

  const lockedNotes = notes.filter((n) => n.is_locked === 1);

  const handlePinSuccess = () => {
    setPinModalVisible(false);
  };

  const handleClose = () => {
    setPinModalVisible(false);
    if (!isUnlocked) {
      router.back();
    }
  };

  if (pinModalVisible) {
    return (
      <PinModal
        visible={pinModalVisible}
        onClose={handleClose}
        onSuccess={handlePinSuccess}
        hasPin={hasPinValue}
        onSetPin={setPin}
        verifyPin={unlockVault}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color={COLORS.white} size={28} />
        </TouchableOpacity>
        <Typography variant="h1">Private</Typography>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <ListIcon color={COLORS.gray5} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Search color={COLORS.gray5} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <FolderPlus color={COLORS.gray5} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Typography variant="h2" style={styles.sectionTitle}>
            Private Noteva
          </Typography>
          {lockedNotes.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={styles.privateCard}
              onPress={() => router.push(`/editor/${note.id}`)}
            >
              <View style={styles.cardHeader}>
                <Typography variant="h3" color={COLORS.white}>
                  ••••••••
                </Typography>
                <Lock size={18} color={COLORS.white} />
              </View>
              <View style={styles.cardFooter}>
                <Typography variant="label" color="rgba(255,255,255,0.7)">
                  #
                  {JSON.parse(note.tags_json || '["GENERAL"]')[0].toUpperCase()}
                </Typography>
                <Lock size={14} color="rgba(255,255,255,0.5)" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/editor/new")}
      >
        <Typography color={COLORS.black} style={{ fontSize: 32 }}>
          +
        </Typography>
      </TouchableOpacity>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 15,
  },
  backBtn: {
    marginLeft: -5,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
    marginLeft: "auto",
  },
  iconBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 20,
    fontFamily: "PlayfairDisplay-Bold",
    fontStyle: "italic",
  },
  privateCard: {
    backgroundColor: COLORS.red,
    borderRadius: 28,
    padding: 24,
    marginBottom: 15,
    minHeight: 120,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 72,
    height: 72,
    backgroundColor: COLORS.white,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
