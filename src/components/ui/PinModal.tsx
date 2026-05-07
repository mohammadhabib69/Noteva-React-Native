import * as Haptics from "expo-haptics";
import { Delete, Lock, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { Typography } from "./Typography";

const { width } = Dimensions.get("window");

interface PinModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hasPin: boolean;
  onSetPin: (pin: string) => void;
  verifyPin: (pin: string) => Promise<boolean>;
}

export const PinModal: React.FC<PinModalProps> = ({
  visible,
  onClose,
  onSuccess,
  hasPin,
  onSetPin,
  verifyPin,
}) => {
  const [pin, setPinInput] = useState("");
  const [mode, setMode] = useState<"enter" | "create">("enter");
  const [tempPin, setTempPin] = useState("");

  useEffect(() => {
    if (visible) {
      setMode(hasPin ? "enter" : "create");
      setPinInput("");
      setTempPin("");
    }
  }, [visible, hasPin]);

  const handleKeyPress = async (key: string) => {
    if (pin.length >= 4) return;

    const newPin = pin + key;
    setPinInput(newPin);
    Haptics.selectionAsync();

    if (newPin.length === 4) {
      if (mode === "create") {
        if (!tempPin) {
          setTempPin(newPin);
          setPinInput("");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (tempPin === newPin) {
          onSetPin(newPin);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onSuccess();
        } else {
          setPinInput("");
          setTempPin("");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } else {
        const success = await verifyPin(newPin);
        if (success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onSuccess();
        } else {
          setPinInput("");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    }
  };

  const handleDelete = () => {
    setPinInput(pin.slice(0, -1));
    Haptics.selectionAsync();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Lock size={48} color={COLORS.red} />
          <Typography variant="h2" style={styles.title}>
            {mode === "create"
              ? tempPin
                ? "CONFIRM PIN"
                : "SET VAULT PIN"
              : "ENTER PIN"}
          </Typography>
          <Typography color={COLORS.gray5}>
            {mode === "create"
              ? "Protect your private notes with a 4-digit PIN"
              : "Access your locked notes"}
          </Typography>
        </View>

        <View style={styles.dotsRow}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                pin.length >= i ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.key}
              onPress={() => handleKeyPress(num.toString())}
            >
              <Typography variant="h2">{num}</Typography>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.key} onPress={onClose}>
            <X color={COLORS.gray4} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.key}
            onPress={() => handleKeyPress("0")}
          >
            <Typography variant="h2">0</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={handleDelete}>
            <Delete color={COLORS.red} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingTop: 60,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "PlayfairDisplay-Bold",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  activeDot: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  inactiveDot: {
    backgroundColor: "transparent",
    borderColor: COLORS.gray3,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: width * 0.8,
    justifyContent: "center",
    gap: 12,
  },
  key: {
    width: width * 0.22,
    height: width * 0.22,
    backgroundColor: COLORS.gray1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
