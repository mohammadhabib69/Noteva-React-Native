import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useNoteStore } from '../../src/store/noteStore';
import { useFolderStore } from '../../src/store/folderStore';
import { COLORS, FONTS } from '../../src/constants/theme';
import { Typography } from '../../src/components/ui/Typography';
import { BrutalistCard } from '../../src/components/ui/BrutalistCard';
import { FlashList } from '@shopify/flash-list';
import { Grid, List as ListIcon, Plus, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useNotes } from '../../src/hooks/useNotes';

export default function FolderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, viewMode, toggleViewMode, setFilterFolderId } = useNoteStore();
  const { folders } = useFolderStore();
  
  const folder = folders.find(f => f.id === id);

  React.useEffect(() => {
    setFilterFolderId(id);
    return () => setFilterFolderId(null);
  }, [id]);

  useNotes();

  const handleAddNote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: '/editor/new', params: { folderId: id } });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerTitle: () => (
          <View style={styles.headerTitle}>
            <Typography variant="mono" style={styles.icon}>{folder?.icon || '📁'}</Typography>
            <Typography variant="h3">{folder?.name.toUpperCase() || 'FOLDER'}</Typography>
          </View>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={COLORS.red} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={toggleViewMode} style={styles.iconButton}>
            {viewMode === 'grid' ? <ListIcon color={COLORS.red} /> : <Grid color={COLORS.red} />}
          </TouchableOpacity>
        ),
      }} />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        <FlashList
          data={notes}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.noteWrapper, 
                viewMode === 'grid' ? styles.gridItem : styles.listItem
              ]}
              onPress={() => router.push(`/editor/${item.id}`)}
            >
              <BrutalistCard accentColor={item.color} style={styles.noteCard}>
                <Typography variant="h3" numberOfLines={1}>{item.title || 'Untitled'}</Typography>
                <View style={[styles.accentLine, { backgroundColor: item.color }]} />
                <Typography variant="mono" numberOfLines={3} color={COLORS.gray5}>
                  {item.content?.replace(/<[^>]*>?/gm, '') || 'No content...'}
                </Typography>
              </BrutalistCard>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity style={styles.fab} onPress={handleAddNote}>
        <Plus color={COLORS.white} size={32} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  backButton: {
    marginRight: 10,
  },
  iconButton: {
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
  },
  noteWrapper: {
    padding: 6,
  },
  gridItem: {
    width: '100%',
  },
  listItem: {
    width: '100%',
  },
  noteCard: {
    minHeight: 120,
    marginBottom: 0,
  },
  accentLine: {
    height: 3,
    width: '100%',
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    backgroundColor: COLORS.red,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.black,
  },
});
