import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Slider,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import {
  ChevronLeft,
  Type,
  Image as ImageIcon,
  List,
  CheckSquare,
  Clock,
  MoreHorizontal,
  Lock,
  Trash2,
  Share2,
  X,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  RotateCcw,
  RotateCw,
  Plus,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

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

const { width, height } = Dimensions.get('window');

// ============================================
// IMAGE RESIZE MODAL COMPONENT
// ============================================
const ImageResizeModal = ({ visible, onClose, onResize, currentWidth }) => {
  const [width, setWidth] = useState(currentWidth || 100);

  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onResize(width);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={styles.resizeModal}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Image Width</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>{width}%</Text>
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderFill,
                  { width: `${width}%` },
                ]}
              />
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>10%</Text>
              <Text style={styles.sliderLabel}>100%</Text>
            </View>
          </View>

          {/* Width Presets */}
          <View style={styles.presetContainer}>
            {[10, 25, 50, 75, 100].map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetButton,
                  width === preset && styles.presetButtonActive,
                ]}
                onPress={() => {
                  setWidth(preset);
                  Haptics.selectionAsync();
                }}
              >
                <Text
                  style={[
                    styles.presetText,
                    width === preset && styles.presetTextActive,
                  ]}
                >
                  {preset}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </Modal>
  );
};

// ============================================
// BOTTOM TOOLBAR COMPONENT
// ============================================
const BottomToolbar = ({
  onFormat,
  onAddImage,
  onShowImageResize,
  onAddList,
  onAddChecklist,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const [activeTab, setActiveTab] = useState('format'); // 'format', 'insert', 'edit'

  const formatActions = [
    { icon: Bold, action: 'bold', label: 'Bold' },
    { icon: Italic, action: 'italic', label: 'Italic' },
    { icon: Underline, action: 'underline', label: 'Underline' },
    { icon: AlignLeft, action: 'justifyLeft', label: 'Left' },
    { icon: AlignCenter, action: 'justifyCenter', label: 'Center' },
    { icon: AlignRight, action: 'justifyRight', label: 'Right' },
  ];

  const insertActions = [
    { icon: ImageIcon, action: 'image', label: 'Image' },
    { icon: List, action: 'unorderedList', label: 'List' },
    { icon: CheckSquare, action: 'checkbox', label: 'Check' },
    { icon: Clock, action: 'reminder', label: 'Reminder' },
  ];

  const editActions = [
    { icon: RotateCcw, action: 'undo', label: 'Undo', disabled: !canUndo },
    { icon: RotateCw, action: 'redo', label: 'Redo', disabled: !canRedo },
  ];

  const getActions = () => {
    switch (activeTab) {
      case 'format':
        return formatActions;
      case 'insert':
        return insertActions;
      case 'edit':
        return editActions;
      default:
        return formatActions;
    }
  };

  return (
    <View style={styles.toolbarContainer}>
      {/* Tab Switcher */}
      <View style={styles.tabSwitcher}>
        {['format', 'insert', 'edit'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => {
              setActiveTab(tab);
              Haptics.selectionAsync();
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
      >
        {getActions().map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionButton,
              item.disabled && styles.actionButtonDisabled,
            ]}
            onPress={() => {
              if (item.disabled) return;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (item.action === 'image') {
                onAddImage();
              } else if (item.action === 'undo') {
                onUndo();
              } else if (item.action === 'redo') {
                onRedo();
              } else {
                onFormat(item.action);
              }
            }}
            disabled={item.disabled}
          >
            <item.icon
              size={22}
              color={
                item.disabled ? COLORS.textTertiary : COLORS.textSecondary
              }
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// ============================================
// MAIN EDITOR SCREEN
// ============================================
export default function EditorScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const richText = useRef(null);
  const { noteId } = route.params || { noteId: 'new' };

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [showImageResize, setShowImageResize] = useState(false);
  const [history, setHistory] = useState({ undo: [], redo: [] });

  const isNewNote = noteId === 'new';

  useEffect(() => {
    if (!isNewNote) {
      // Load existing note
      // In real app, load from database
      setTitle('Existing Note Title');
    }
  }, [noteId, isNewNote]);

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Save to database
    navigation.goBack();
  };

  const handleFormat = (format) => {
    richText.current?.setBold?.();
    // RichEditor actions
    switch (format) {
      case 'bold':
        richText.current?.setBold?.();
        break;
      case 'italic':
        richText.current?.setItalic?.();
        break;
      case 'underline':
        richText.current?.setUnderline?.();
        break;
      case 'justifyLeft':
        richText.current?.setAlignLeft?.();
        break;
      case 'justifyCenter':
        richText.current?.setAlignCenter?.();
        break;
      case 'justifyRight':
        richText.current?.setAlignRight?.();
        break;
    }
  };

  const handleAddImage = () => {
    // Show image picker
    setShowImageResize(true);
  };

  const handleImageResize = (widthPercent) => {
    // Insert image with specified width
    const imageUri = 'placeholder-image-uri';
    const html = `<img src="${imageUri}" width="${widthPercent}%" />`;
    richText.current?.insertHTML?.(html);
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
      setShowTagInput(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleUndo = () => {
    richText.current?.undo?.();
  };

  const handleRedo = () => {
    richText.current?.redo?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              setIsLocked(!isLocked);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Lock
              size={22}
              color={isLocked ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => {
              // Show more options
            }}
          >
            <MoreHorizontal size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </MotiView>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Title Input */}
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor={COLORS.textTertiary}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            multiline
          />

          {/* Tags */}
          <View style={styles.tagsSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsScroll}
            >
              {tags.map((tag, index) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={styles.tagChip}
                >
                  <Text style={styles.tagChipText}>#{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(index)}>
                    <X size={14} color={COLORS.textTertiary} />
                  </TouchableOpacity>
                </MotiView>
              ))}

              {showTagInput ? (
                <View style={styles.tagInputContainer}>
                  <TextInput
                    style={styles.tagInput}
                    placeholder="tag"
                    placeholderTextColor={COLORS.textTertiary}
                    value={tagInput}
                    onChangeText={setTagInput}
                    onSubmitEditing={handleAddTag}
                    autoFocus
                  />
                  <TouchableOpacity onPress={handleAddTag}>
                    <Check size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={() => setShowTagInput(true)}
                >
                  <Plus size={16} color={COLORS.textTertiary} />
                  <Text style={styles.addTagText}>Add tag</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Rich Text Editor */}
          <View style={styles.editorContainer}>
            <RichEditor
              ref={richText}
              style={styles.editor}
              placeholder="Start typing your note..."
              initialContentHTML={content}
              onChange={setContent}
              editorStyle={{
                backgroundColor: COLORS.background,
                color: COLORS.textPrimary,
                placeholderColor: COLORS.textTertiary,
                contentCSSText: `
                  font-family: ${FONTS.sans.regular};
                  font-size: 18px;
                  line-height: 28px;
                  color: ${COLORS.textPrimary};
                `,
              }}
            />
          </View>
        </ScrollView>

        {/* Bottom Toolbar */}
        <View style={[styles.toolbarWrapper, { paddingBottom: insets.bottom }]}
        >
          <BottomToolbar
            onFormat={handleFormat}
            onAddImage={handleAddImage}
            onShowImageResize={() => setShowImageResize(true)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={history.undo.length > 0}
            canRedo={history.redo.length > 0}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Image Resize Modal */}
      <ImageResizeModal
        visible={showImageResize}
        onClose={() => setShowImageResize(false)}
        onResize={handleImageResize}
        currentWidth={100}
      />
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
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: SHAPES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: SHAPES.pill,
    marginLeft: SPACING.sm,
  },
  saveButtonText: {
    fontFamily: FONTS.sans.semiBold,
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 200, // Space for keyboard
  },

  // Title
  titleInput: {
    fontFamily: FONTS.serif.extraBold,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: COLORS.textPrimary,
    padding: 0,
    marginBottom: SPACING.md,
  },

  // Tags
  tagsSection: {
    marginBottom: SPACING.md,
  },
  tagsScroll: {
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SHAPES.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  tagChipText: {
    fontFamily: FONTS.mono.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SHAPES.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  tagInput: {
    fontFamily: FONTS.mono.regular,
    fontSize: 12,
    color: COLORS.textPrimary,
    padding: 0,
    minWidth: 60,
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: SHAPES.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  addTagText: {
    fontFamily: FONTS.sans.medium,
    fontSize: 12,
    color: COLORS.textTertiary,
  },

  // Editor
  editorContainer: {
    minHeight: 300,
  },
  editor: {
    backgroundColor: COLORS.background,
    minHeight: 300,
  },

  // Toolbar
  toolbarWrapper: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  toolbarContainer: {
    paddingVertical: SPACING.sm,
  },
  tabSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SHAPES.pill,
  },
  tabActive: {
    backgroundColor: COLORS.surfaceElevated,
  },
  tabText: {
    fontFamily: FONTS.sans.medium,
    fontSize: 12,
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: COLORS.textPrimary,
  },
  actionsContainer: {
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: SHAPES.medium,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },

  // Image Resize Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  resizeModal: {
    backgroundColor: COLORS.surface,
    borderRadius: SHAPES.large,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontFamily: FONTS.serif.bold,
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  sliderContainer: {
    marginBottom: SPACING.lg,
  },
  sliderValue: {
    fontFamily: FONTS.serif.extraBold,
    fontSize: 48,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  sliderLabel: {
    fontFamily: FONTS.sans.medium,
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  presetButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SHAPES.medium,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  presetButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  presetText: {
    fontFamily: FONTS.sans.medium,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  presetTextActive: {
    color: COLORS.textPrimary,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: SHAPES.medium,
    alignItems: 'center',
  },
  applyButtonText: {
    fontFamily: FONTS.sans.semiBold,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});
