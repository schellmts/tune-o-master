import { cssInterop } from 'nativewind';
import { Text, type TextProps } from 'react-native';

type AppTextProps = TextProps & {
  weight?: 'thin' | 'light' | 'regular' | 'semibold' | 'bold';
};

function AppText({ children, style, weight = 'regular', ...props }: AppTextProps) {
  const fontMap = {
    thin: 'Poppins_100Thin',
    light: 'Poppins_300Light',
    regular: 'Poppins_400Regular',
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  };

  return (
    <Text style={[{ fontFamily: fontMap[weight] }, style]} {...props}>
      {children}
    </Text>
  );
}

cssInterop(AppText, { className: 'style' });

export default AppText;