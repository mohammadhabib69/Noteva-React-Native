import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { COLORS, BRUTALIST } from '../../constants/theme';

interface BrutalistCardProps extends ViewProps {
  children: React.ReactNode;
  accentColor?: string;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({ children, style, accentColor, ...props }) => {
  return (
    <View style={[styles.card, { borderColor: accentColor || COLORS.border }, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.gray1,
    borderWidth: BRUTALIST.borderWidth,
    borderRadius: BRUTALIST.borderRadius,
    padding: 16,
    marginBottom: 12,
  },
});
