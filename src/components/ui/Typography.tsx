import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'mono' | 'label' | 'serif';
  color?: string;
  weight?: 'regular' | 'bold' | 'extraBold';
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  color = COLORS.white, 
  weight = 'regular',
  style, 
  children, 
  ...props 
}) => {
  const getFontFamily = () => {
    switch (variant) {
      case 'h1': return 'PlayfairDisplay-Black';
      case 'h2': return 'PlayfairDisplay-ExtraBold';
      case 'h3': return 'PlayfairDisplay-Bold';
      case 'serif': return 'PlayfairDisplay-Regular';
      case 'mono': return 'Space Mono';
      case 'label': return 'Space Mono-Bold';
      default: return 'Space Mono'; // Default to Mono for the tech look
    }
  };

  return (
    <Text 
      style={[
        { 
          fontFamily: getFontFamily(),
          color,
          fontSize: getFontSize(variant),
        },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

const getFontSize = (variant: string) => {
  switch (variant) {
    case 'h1': return 38;
    case 'h2': return 28;
    case 'h3': return 20;
    case 'label': return 12;
    case 'mono': return 14;
    default: return 16;
  }
};
