import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView, useAnimationState } from 'moti';
import { useFocusEffect } from '@react-navigation/native';
import {
  Search,
  FolderPlus,
  Settings,
  Plus,
  MoreVertical,
  Lock,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Theme
import {
  COLORS,
  FONTS,
  TYPOGRAPHY,
  SPACING,
  SHAPES,
  SHADOWS,
  ANIMATIONS,
  LAYOUT,
} from '../theme/ThemeConfiguration';

const { width } = Dimensions.get('window');

// ============================================
// MOCK DATA
// ============================================
const FOLDERS = [
  { id: '1', name: 'All Notes', icon: '📝', color: COLORS.primary },
  { id: '2', name: 'Personal', icon: '👤', color: '#4CAF50' },
  { id: '3', name: 'Work', icon: '💼', color: '#2196F3' },
  { id: '4', name: 'Ideas', icon: '💡', color: '#FFC107' },
  { id: '5', name: 'Journal', icon: '📔', color: '#9C27B0' },
  { id: '6', name: 'Locked', icon: '🔒', color: COLORS.surfaceElevated },
];

const MOCK_NOTES = [
  {
    id: '1',
    title: 'Product Launch Strategy',
    content: 'Key points for the Q4 product launch including target demographics, marketing channels, and timeline considerations...',
    tags: ['work', 'strategy'],
    isPinned: true,
    isLocked: false,
    folderId: '2',
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: 'Midnight Thoughts',
    content: 'The city sleeps but my mind wanders through corridors of memories, each door leading to a different chapter...',
    tags: ['personal', 'poetry'],
    isPinned: true,
    isLocked: false,
    folderId: '3',
    updatedAt: Date.now() - 86400000,
  },
  {
    id: '3',
    title: 'App Design Concepts',
    content: 'Brutalist minimalism: high contrast, bold typography, extreme rounded corners. Think monoliths in digital space...',
    tags: ['design', 'ideas'],
    isPinned: false,
    isLocked: false,
    folderId: '4',
    updatedAt: Date.now() - 172800000,
  },
  {
    id: '4',
    title: 'Meeting Notes',
    content: 'Action items: 1. Finalize wireframes 2. Review color palette 3. Schedule user testing session...',
    tags: ['work'],
    isPinned: false,
    isLocked: false,
    folderId: '2',
    updatedAt: Date.now() - 259200000,
  },
  {
    id: '5',
    title: 'Secret Project Alpha',
    content: '•••••••••••••••••••••••••••••••••••••••••••••',
    tags: ['private'],
    isPinned: false,
    isLocked: true,
    folderId: '6',
    updatedAt: Date.now() - 345600000,
  },
];

// ============================================
// NOTE CARD COMPONENT with Spring Animation
// ============================================
const NoteCard = ({ note, index, onPress, onLongPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: index * 50,
      }}
    >
      <Pressable
        onPressIn={() => {
          setIsPressed(true);
        }}
        onPressOut={() => setIsPressed(false)}
        onPress={onPress}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onLongPress?.(note);
        }}
        delayLongPress={300}
        style={styles.cardPressable}
      >
        <MotiView
          animate={{
            scale: isPressed ? 0.96 : 1,
            backgroundColor: note.isPinned
              ? COLORS.primary
              : note.isLocked
              ? COLORS.surfaceElevated
              : COLORS.surface,
          }}
          transition={ANIMATIONS.spring}
          style={[
            styles.noteCard,
            note.isPinned && styles.pinnedCard,
            note.isLocked && styles.lockedCard,
          ]}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.noteTitle,
                {
                  color: note.isPinned
                    ? COLORS.textPrimary
                    : note.isLocked
                    ? COLORS.textSecondary
                    : COLORS.textPrimary,
                },
              ]}
              numberOfLines={2}
            >
              {note.isLocked ? '••••••••' : note.title}
            </Text>
            {note.isLocked && (
              <Lock size={16} color={COLORS.textTertiary} />
            )}
          </View>

          {/* Card Content */}
          {!note.isLocked && (
            <Text
              style={[
                styles.noteContent,
                {
                  color: note.isPinned
                    ? 'rgba(255,255,255,0.7)'
                    : COLORS.textSecondary,
                },
              ]}
              numberOfLines={3}
            >
              {note.content}
            </Text>
          )}

          {/* Tags */}
          {note.tags.length > 0 && !note.isLocked && (
            <View style={styles.tagsContainer}>
              {note.tags.slice(0, 2).map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          )}
        </MotiView>
      </Pressable>
    </MotiView>
  );
};

// ============================================
// FOLDER ITEM COMPONENT
// ============================================
const FolderItem = ({ folder, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.folderItem}
    >
      <MotiView
        animate={{
          backgroundColor: isSelected ? folder.color : COLORS.surface,
          borderColor: isSelected ? folder.color : COLORS.border,
          scale: isSelected ? 1.05 : 1,
        }}
        transition={ANIMATIONS.spring}
        style={[
          styles.folderCircle,
          {
            borderWidth: 1,
          },
        ]}
      >
        <Text style={styles.folderIcon}>{folder.icon}</Text>
      </MotiView>
      <Text
        style={[
          styles.folderName,
          {
            color: isSelected ? COLORS.textPrimary : COLORS.textSecondary,
          },
        ]}
      >
        {folder.name}
      </Text>
    </TouchableOpacity>
  );
};

// ============================================
// MAIN HOME SCREEN
// ============================================
export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedFolder, setSelectedFolder] = useState('1');
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Reload data when screen is focused
  useFocusEffect(
    useCallback(() => {
      // In real app, load from database here
      setNotes(MOCK_NOTES);
    }, [])
  );

  const filteredNotes =
    selectedFolder === '1'
      ? notes
      : notes.filter((n) => n.folderId === selectedFolder);

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const regularNotes = filteredNotes.filter((n) => !n.isPinned);

  const handleAddNote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Editor', { noteId: 'new' });
  };

  const handleNotePress = (note) => {
    if (note.isLocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      // Show PIN modal
      return;
    }
    navigation.navigate('Editor', { noteId: note.id });
  };

  const handleNoteLongPress = (note) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Show action menu
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.logoText}>Noteva</Text>
          <Text style={styles.pixelAccent}>■</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <MoreVertical size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FolderPlus size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </MotiView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Folders Horizontal Scroll */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'spring', delay: 100 }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.foldersContainer}
          >
            {FOLDERS.map((folder, index) => (
              <MotiView
                key={folder.id}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  delay: index * 50,
                }}
              >
                <FolderItem
                  folder={folder}
                  isSelected={selectedFolder === folder.id}
                  onPress={() => setSelectedFolder(folder.id)}
                />
              </MotiView>
            ))}
          </ScrollView>
        </MotiView>

        {/* Pinned Section */}
        {pinnedNotes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PINNED</Text>
            <View
              style={
                viewMode === 'grid' ? styles.gridContainer : styles.listContainer
              }
            >
              {pinnedNotes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  index={index}
                  onPress={() => handleNotePress(note)}
                  onLongPress={handleNoteLongPress}
                />
              ))}
            </View>
          </View>
        )}

        {/* All Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedFolder === '1' ? 'ALL NOTES' : 'FOLDER NOTES'}
            </Text>
            <Text style={styles.noteCount}>
              {regularNotes.length + pinnedNotes.length}
            </Text>
          </View>

          <View
            style={
              viewMode === 'grid' ? styles.gridContainer : styles.listContainer
            }
          >
            {regularNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                index={index + pinnedNotes.length}
                onPress={() => handleNotePress(note)}
                onLongPress={handleNoteLongPress}
              />
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <MotiView
        from={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 500,
        }}
        style={[styles.fabContainer, { bottom: insets.bottom + 20 }]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleAddNote}
          style={styles.fab}
        >
          <Plus size={32} color={COLORS.background} strokeWidth={2.5} />
        </TouchableOpacity>
      </MotiView>
    </SafeAreaView>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  logoText: {
    fontFamily: FONTS.serif.black,
    fontSize: 36,
    lineHeight: 36,
    letterSpacing: -1.5,
    color: COLORS.textPrimary,
  },
  pixelAccent: {
    fontFamily: FONTS.pixel,
    fontSize: 20,
    color: COLORS.primary,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: SHAPES.medium,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },

  // Folders
  foldersContainer: {
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  folderItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  folderCircle: {
    width: 72,
    height: 72,
    borderRadius: SHAPES.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderIcon: {
    fontSize: 32,
  },
  folderName: {
    fontFamily: FONTS.sans.medium,
    fontSize: 12,
    letterSpacing: 0.5,
  },

  // Sections
  section: {
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONTS.sans.semiBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: COLORS.textTertiary,
  },
  noteCount: {
    fontFamily: FONTS.sans.medium,
    fontSize: 12,
    color: COLORS.textTertiary,
  },

  // Grid Layout
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  listContainer: {
    gap: SPACING.md,
  },

  // Cards
  cardPressable: {
    width: viewMode => (viewMode === 'grid' ? (width - 56) / 2 : '100%'),
  },
  noteCard: {
    width: (width - 56) / 2,
    minHeight: 160,
    borderRadius: SHAPES.large,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  pinnedCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  lockedCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.borderStrong,
    borderStyle: 'dashed',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  noteTitle: {
    fontFamily: FONTS.serif.bold,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.3,
    flex: 1,
  },
  noteContent: {
    fontFamily: FONTS.sans.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: 'auto',
    paddingTop: SPACING.xs,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: SHAPES.small,
  },
  tagText: {
    fontFamily: FONTS.mono.regular,
    fontSize: 10,
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
  },

  // FAB
  fabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: LAYOUT.fabSize,
    height: LAYOUT.fabSize,
    borderRadius: SHAPES.pill,
    backgroundColor: COLORS.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
});
