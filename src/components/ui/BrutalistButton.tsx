import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { COLORS, BRUTALIST, FONTS } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface BrutalistButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'outline' | 'ghost';
  onPress?: () => void;
}

export const BrutalistButton: React.FC<BrutalistButtonProps> = ({ title, variant = 'primary', onPress, style, ...props }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        style
      ]} 
      onPress={handlePress}
      {...props}
    >
      <Text style={[
        styles.text,
        variant === 'primary' && styles.primaryText,
        variant === 'outline' && styles.outlineText,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: BRUTALIST.borderWidth,
    borderRadius: BRUTALIST.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: COLORS.red,
  },
  text: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  primaryText: {
    color: COLORS.black,
  },
  outlineText: {
    color: COLORS.red,
  },
});
