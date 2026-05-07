import {
    Book,
    Briefcase,
    Camera,
    Coffee,
    Folder,
    Heart,
    Home,
    Lightbulb,
    Music,
    Star,
    X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { Typography } from "./Typography";

interface NewFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, color: string, icon: string) => void;
}

const COLORS_LIST = [
  "#FFFFFF",
  "#FF5252",
  "#4CAF50",
  "#2196F3",
  "#FFC107",
  "#9C27B0",
  "#FF9800",
  "#00BCD4",
];

const ICONS_LIST = [
  { name: "folder", Comp: Folder },
  { name: "briefcase", Comp: Briefcase },
  { name: "home", Comp: Home },
  { name: "lightbulb", Comp: Lightbulb },
  { name: "heart", Comp: Heart },
  { name: "star", Comp: Star },
  { name: "book", Comp: Book },
  { name: "music", Comp: Music },
  { name: "camera", Comp: Camera },
  { name: "coffee", Comp: Coffee },
];

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS_LIST[0]);
  const [selectedIcon, setSelectedIcon] = useState("folder");

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, selectedColor, selectedIcon);
      setName("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Typography variant="h3">New Folder</Typography>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={COLORS.gray5} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Typography
              variant="label"
              color={COLORS.gray5}
              style={styles.label}
            >
              NAME
            </Typography>
            <TextInput
              style={styles.input}
              placeholder="Folder Name"
              placeholderTextColor={COLORS.gray4}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.section}>
            <Typography
              variant="label"
              color={COLORS.gray5}
              style={styles.label}
            >
              COLOR
            </Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorRow}
            >
              {COLORS_LIST.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === color && styles.activeCircle,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Typography
              variant="label"
              color={COLORS.gray5}
              style={styles.label}
            >
              ICON
            </Typography>
            <View style={styles.iconGrid}>
              {ICONS_LIST.map(({ name: iconName, Comp }) => (
                <TouchableOpacity
                  key={iconName}
                  style={[
                    styles.iconBox,
                    selectedIcon === iconName && {
                      backgroundColor: selectedColor,
                    },
                  ]}
                  onPress={() => setSelectedIcon(iconName)}
                >
                  <Comp
                    size={24}
                    color={
                      selectedIcon === iconName
                        ? selectedColor === "#FFFFFF"
                          ? "#000"
                          : "#FFF"
                        : COLORS.gray4
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Typography color={COLORS.black} weight="bold">
              Save Folder
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.gray1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: "60%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 10,
    fontSize: 10,
  },
  input: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 12,
    padding: 16,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Space Mono",
  },
  colorRow: {
    gap: 12,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeCircle: {
    borderColor: COLORS.white,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.gray2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 20,
  },
});
