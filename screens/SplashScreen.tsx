import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import tw from 'twrnc';

const SplashScreen = () => {
  const navigation = useNavigation<any>()

  const { width } = Dimensions.get('window');
  const responsiveWidth = width * 0.8;

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, 2500);
  }, []);

  return (
    <LinearGradient
      colors={['#ef4444', '#b91c1c']} // Set your gradient colors here
      start={{ x: 0, y: 0.5 }} // Adjust start point as needed
      end={{ x: 1, y: 0.5 }} // Adjust end point as needed
      style={tw`flex-1 items-center justify-center`}
    >
      <View style={styles.container}>
        <Text style={tw`absolute top-45 text-white/25 text-xs`}>SAPTA KARYA</Text>
        <Image
          source={require('../assets/images/box-splash-screen-bwm.png')}
          style={[tw`h-${responsiveWidth * 0.25} absolute`]}
          resizeMode="contain"
        />
        <ActivityIndicator color="#fff" size="large" style={styles.activityIndicator} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    position: 'absolute',
    bottom: 80, // Adjust this value as needed to control the vertical position
  },
});

export default SplashScreen;
