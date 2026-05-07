import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { COLORS, FONTS, BRUTALIST } from '../../src/constants/theme';
import { Typography } from '../../src/components/ui/Typography';
import { NoteQueries } from '../../src/database/queries';
import { Note } from '../../src/store/noteStore';
import { ChevronLeft, Lock as LockIcon, Plus, Image as ImageIcon, Bell, List as ListIcon, Type, RotateCcw, RotateCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function EditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const richText = useRef<RichEditor>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [note, setNote] = useState<Partial<Note> | null>(null);

  useEffect(() => {
    if (id && id !== 'new') {
      loadNote();
    } else {
      setNote({ color: COLORS.red, is_locked: 0, is_pinned: 0 });
    }
  }, [id]);

  const loadNote = async () => {
    const data = await NoteQueries.getNoteById(id as string);
    if (data) {
      setNote(data);
      setTitle(data.title);
      setContent(data.content || '');
    }
  };

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await NoteQueries.upsertNote({
      ...note,
      id: id === 'new' ? undefined : id,
      title,
      content,
    });
    router.back();
  };

  const handleToggleLock = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNote(prev => ({
      ...prev,
      is_locked: prev?.is_locked === 1 ? 0 : 1
    }));
  };

  const handleAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      richText.current?.insertImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color={COLORS.white} size={28} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={handleToggleLock}>
            <LockIcon color={note?.is_locked === 1 ? COLORS.red : COLORS.gray5} size={22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave}>
            <Typography variant="h3" color={COLORS.red}>Done</Typography>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor={COLORS.gray4}
            value={title}
            onChangeText={setTitle}
            multiline
          />
          
          <TouchableOpacity style={styles.tagBtn}>
            <Plus size={14} color={COLORS.gray5} />
            <Typography variant="label" color={COLORS.gray5} style={{ marginLeft: 4 }}>add tag</Typography>
          </TouchableOpacity>

          <RichEditor
            ref={richText}
            style={styles.editor}
            placeholder="Start typing your note..."
            initialContentHTML={content}
            onChange={setContent}
            editorStyle={{
              backgroundColor: COLORS.black,
              color: COLORS.white,
              placeholderColor: COLORS.gray4,
              contentCSSText: `font-family: ${FONTS.mono}; font-size: 16px; line-height: 24px;`,
            }}
          />
        </ScrollView>

        {/* Custom Toolbar */}
        <View style={styles.toolbarContainer}>
          <View style={styles.toolbarRow}>
            <TouchableOpacity onPress={() => richText.current?.undo()} style={styles.toolBtn}>
              <RotateCcw color={COLORS.gray5} size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => richText.current?.redo()} style={styles.toolBtn}>
              <RotateCw color={COLORS.gray5} size={22} />
            </TouchableOpacity>
            
            <View style={styles.toolDivider} />

            <TouchableOpacity style={styles.toolBtn}>
              <Type color={COLORS.gray5} size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => richText.current?.showAndroidOrderedList()} style={styles.toolBtn}>
              <ListIcon color={COLORS.gray5} size={22} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn}>
              <Bell color={COLORS.gray5} size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddImage} style={styles.toolBtn}>
              <ImageIcon color={COLORS.gray5} size={22} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerIcon: {
    padding: 4,
  },
  backBtn: {
    marginLeft: -5,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleInput: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 40,
    color: COLORS.white,
    marginTop: 20,
    marginBottom: 10,
  },
  tagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  editor: {
    minHeight: 400,
    backgroundColor: COLORS.black,
  },
  toolbarContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: COLORS.black,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  toolBtn: {
    padding: 10,
  },
  toolDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.gray1,
  },
});
