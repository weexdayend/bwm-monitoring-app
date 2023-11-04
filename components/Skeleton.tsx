import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { Easing } from 'react-native-reanimated';

import tw from 'twrnc'

const Skeleton = (props: {
  width: string | number;
  height: string | number;
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sharedAnimationConfig = {
      duration: 1000,
      useNativeDriver: true,
    };
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 1,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          ...sharedAnimationConfig,
          toValue: 0,
          easing: Easing.in(Easing.ease),
        }),
      ])
    ).start();

    return () => {
      // cleanup
      pulseAnim.stopAnimation();
    };
  }, []);

  const opacityAnim = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05, 0.15],
  });

  return (
    <Animated.View
      style={[
        tw`${props.width} ${props.height} bg-gray-500 rounded-full`,
        { opacity: opacityAnim },
      ]}
    />
  );
};

export default Skeleton