import { Text, TextProps } from 'react-native';

type AppTextProps = TextProps & {
  weight?: 'thin' | 'light' | 'regular' | 'semibold' | 'bold';
};

export default function AppText({
  children,
  style,
  weight = 'regular',
  ...props
}: AppTextProps) {

  const fontMap = {
    thin: 'Poppins_100Thin',
    light: 'Poppins_300Light',
    regular: 'Poppins_400Regular',
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  };

  return (
    <Text
      style={[
        {
          fontFamily: fontMap[weight],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}