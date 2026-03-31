import React, { useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

export default function MotionButton({
  children,
  style,
  disabledStyle,
  onPress,
  disabled = false,
}) {
  const flatStyle = StyleSheet.flatten(style) || {};
  const hoverValue = useRef(new Animated.Value(0)).current;
  const pressValue = useRef(new Animated.Value(0)).current;

  const runAnimation = (animatedValue, toValue, duration) => {
    Animated.timing(animatedValue, {
      toValue,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = useMemo(() => ({
    transform: [
      {
        translateY: Animated.add(
          hoverValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -3],
          }),
          pressValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 2],
          }),
        ),
      },
      {
        scale: pressValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.985],
        }),
      },
    ],
  }), [hoverValue, pressValue]);

  const overlayStyle = useMemo(() => ({
    opacity: hoverValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.08],
    }),
  }), [hoverValue]);

  const containerStyle = useMemo(() => ({
    alignSelf: flatStyle.alignSelf,
    flex: flatStyle.flex,
    minWidth: flatStyle.minWidth,
    width: flatStyle.width,
    maxWidth: flatStyle.maxWidth,
  }), [flatStyle.alignSelf, flatStyle.flex, flatStyle.maxWidth, flatStyle.minWidth, flatStyle.width]);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onHoverIn={() => !disabled && runAnimation(hoverValue, 1, 160)}
      onHoverOut={() => runAnimation(hoverValue, 0, 180)}
      onPressIn={() => !disabled && runAnimation(pressValue, 1, 90)}
      onPressOut={() => runAnimation(pressValue, 0, 130)}
      style={[styles.pressable, containerStyle]}
    >
      <Animated.View style={[style, animatedStyle, disabled && disabledStyle]}>
        <View style={styles.content}>{children}</View>
        <Animated.View pointerEvents="none" style={[styles.overlay, overlayStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'flex-start',
  },
  content: {
    zIndex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
  },
});
