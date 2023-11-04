import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

type Props = {
  percentage: any
  color: string
}

const CircularProgressBar = ({ percentage, color }: Props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const validPercentage = Math.min(Math.max(percentage, 0), 100);
    const animationDuration = 500; // 1 second
    const animationSteps = 120; // Higher frame rate
    const stepInterval = animationDuration / animationSteps;
    const easing = (t: any) => 1 - Math.pow(1 - t, 2); // Ease-out function
  
    let currentStep = 0;
  
    const animate = () => {
      const animationProgress = currentStep / animationSteps;
      const easedProgress = easing(animationProgress);
      const newProgress = easedProgress * validPercentage;
  
      setProgress(newProgress);
  
      if (currentStep < animationSteps) {
        currentStep += 1;
        setTimeout(animate, stepInterval); // Use setTimeout for smoother easing
      }
    };
  
    animate(); // Start animation
  
    return () => {
      // Cleanup (optional)
    };
  }, [percentage]);  

  const displayedPercentage = Math.floor(progress); // Round down for smooth text animation

  return (
    <View style={styles.container}>
      <Svg height="100" width="100">
        {/* Background Circle */}
        <Circle
          cx="50"
          cy="50"
          r="45" 
          stroke="lightgray"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          cx="50"
          cy="50"
          r="45" 
          stroke={color}
          strokeWidth="8" 
          strokeDasharray={`${progress * 2.82},282`}
          fill="transparent"
        />
        {/* Percentage Text */}
        <SvgText
          x="50%"
          y="50%"
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="black"
        >
          {`${displayedPercentage}%`}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default CircularProgressBar;
