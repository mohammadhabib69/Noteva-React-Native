import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import {
    FolderPlus,
    List as ListIcon,
    Plus,
    Search,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionsModal } from "../../src/components/ui/ActionsModal";
import { NewFolderModal } from "../../src/components/ui/NewFolderModal";
import { Typography } from "../../src/components/ui/Typography";
import { COLORS } from "../../src/constants/theme";
import { FolderQueries, NoteQueries } from "../../src/database/queries";
import { useFolders } from "../../src/hooks/useFolders";
import { useNotes } from "../../src/hooks/useNotes";
import { useFolderStore } from "../../src/store/folderStore";
import { Note, useNoteStore } from "../../src/store/noteStore";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { loadNotes } = useNotes();
  const { loadFolders } = useFolders();
  const { notes, toggleViewMode } = useNoteStore();
  const { folders } = useFolderStore();

  // Reload notes when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes]),
  );

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [newFolderVisible, setNewFolderVisible] = useState(false);

  const pinnedNotes = notes.filter((n) => n.is_pinned === 1);
  const otherNotes = notes.filter((n) => n.is_pinned === 0);

  const handleAddNote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/editor/new");
  };

  const handleVaultPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push("/vault");
  };

  const handleLongPressNote = (note: Note) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedNote(note);
    setActionsVisible(true);
  };

  const handleCreateFolder = async (
    name: string,
    color: string,
    icon: string,
  ) => {
    await FolderQueries.createFolder(name, icon, color);
    loadFolders();
  };

  const handleDeleteNote = async () => {
    if (selectedNote) {
      await NoteQueries.deleteNote(selectedNote.id);
      setActionsVisible(false);
      loadNotes();
    }
  };

  const renderNote = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.noteCard,
        item.is_pinned === 1 ? styles.pinnedCard : styles.regularCard,
      ]}
      onPress={() => router.push(`/editor/${item.id}`)}
      onLongPress={() => handleLongPressNote(item)}
    >
      <Typography
        variant="h3"
        color={item.is_pinned === 1 ? COLORS.pinnedText : COLORS.white}
        numberOfLines={1}
      >
        {item.title || "Untitled"}
      </Typography>
      <Typography
        variant="serif"
        color={item.is_pinned === 1 ? "#666" : COLORS.gray5}
        numberOfLines={3}
        style={styles.noteContent}
      >
        {item.content?.replace(/<[^>]*>?/gm, "") || "No content..."}
      </Typography>
      {item.tags_json && JSON.parse(item.tags_json).length > 0 && (
        <Typography
          variant="label"
          color={item.is_pinned === 1 ? "#000" : COLORS.gray5}
          style={styles.tagText}
        >
          #{JSON.parse(item.tags_json)[0].toUpperCase()}
        </Typography>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h1">Noteva</Typography>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={toggleViewMode} style={styles.iconBtn}>
            <ListIcon color={COLORS.gray5} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Search color={COLORS.gray5} size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNewFolderVisible(true)}
            style={styles.iconBtn}
          >
            <FolderPlus color={COLORS.gray5} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pinnedNotes.length > 0 && (
          <View style={styles.section}>
            <Typography variant="h2" style={styles.sectionTitle}>
              Pinned
            </Typography>
            <FlashList
              data={pinnedNotes}
              renderItem={renderNote}
              estimatedItemSize={150}
              scrollEnabled={false}
            />
          </View>
        )}

        <View style={styles.section}>
          <Typography variant="h2" style={styles.sectionTitle}>
            Today
          </Typography>
          <FlashList
            data={otherNotes}
            renderItem={renderNote}
            estimatedItemSize={150}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.folderHeader}>
            <Typography variant="h2" style={styles.sectionTitle}>
              My Folders
            </Typography>
            <TouchableOpacity onPress={() => setNewFolderVisible(true)}>
              <Typography color={COLORS.red} variant="label">
                NEW FOLDER
              </Typography>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.folderRow}
          >
            {folders.map((folder) => (
              <TouchableOpacity
                key={folder.id}
                style={styles.folderItem}
                onPress={() => router.push(`/folder/${folder.id}`)}
              >
                <View
                  style={[
                    styles.folderCircle,
                    { backgroundColor: folder.color || COLORS.gray1 },
                  ]}
                >
                  {/* Map icon string to component if needed, or just use text icons */}
                  <Typography style={{ fontSize: 24 }}>
                    {folder.icon}
                  </Typography>
                </View>
                <Typography variant="label" style={styles.folderName}>
                  {folder.name}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddNote}
        onLongPress={handleVaultPress}
        delayLongPress={800}
      >
        <Plus color={COLORS.black} size={32} />
      </TouchableOpacity>

      <ActionsModal
        visible={actionsVisible}
        onClose={() => setActionsVisible(false)}
        onDelete={handleDeleteNote}
        onDuplicate={() => {}}
        onExport={() => {}}
        onMove={() => {}}
      />

      <NewFolderModal
        visible={newFolderVisible}
        onClose={() => setNewFolderVisible(false)}
        onSave={handleCreateFolder}
      />
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
    paddingVertical: 10,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
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
    marginBottom: 15,
    fontFamily: "PlayfairDisplay-Bold",
    fontStyle: "italic",
  },
  noteCard: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 15,
    minHeight: 120,
  },
  pinnedCard: {
    backgroundColor: COLORS.pinnedBg,
  },
  regularCard: {
    backgroundColor: COLORS.gray1,
  },
  noteContent: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  tagText: {
    marginTop: 20,
    fontSize: 10,
    letterSpacing: 1,
  },
  folderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  folderRow: {
    marginTop: 10,
  },
  folderItem: {
    alignItems: "center",
    marginRight: 20,
  },
  folderCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  folderName: {
    fontSize: 12,
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
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
});
