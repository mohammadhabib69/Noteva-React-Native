import { Copy, FileOutput, FolderInput, Trash2, X } from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { COLORS } from "../../constants/theme";
import { Typography } from "./Typography";

const { height } = Dimensions.get("window");

interface ActionsModalProps {
  visible: boolean;
  onClose: () => void;
  onDuplicate: () => void;
  onMove: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export const ActionsModal: React.FC<ActionsModalProps> = ({
  visible,
  onClose,
  onDuplicate,
  onMove,
  onExport,
  onDelete,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Typography variant="label" color={COLORS.gray5}>
              ACTIONS
            </Typography>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={COLORS.gray5} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.item} onPress={onDuplicate}>
            <Copy size={22} color="#4A90E2" />
            <Typography style={styles.itemText}>Duplicate</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={onMove}>
            <FolderInput size={22} color="#F5A623" />
            <Typography style={styles.itemText}>Move to Folder</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={onExport}>
            <FileOutput size={22} color="#7ED321" />
            <Typography style={styles.itemText}>Export as Text</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={onDelete}>
            <Trash2 size={22} color={COLORS.red} />
            <Typography style={[styles.itemText, { color: COLORS.red }]}>
              Delete
            </Typography>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: COLORS.gray1,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2,
  },
  itemText: {
    marginLeft: 16,
    fontSize: 16,
  },
});
