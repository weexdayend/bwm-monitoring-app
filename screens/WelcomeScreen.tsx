import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { 
  View, 
  Text, 
  BackHandler, 
  SafeAreaView, 
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native'

import VersionCheck from 'react-native-version-check'

import tw from 'twrnc'

type Props = {}

const WelcomeScreen = (props: Props) => {
  const navigation = useNavigation()

  const { width } = Dimensions.get('window');
  const responsiveWidth = width * 0.8;

  const handleBackButton = () => {
    // Prevent the default back button behavior (e.g., navigating back)
    return true; // Return true to indicate that you've handled the back button
  };

  useEffect(() => {
    // Add an event listener for the back button press
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
  
    // Clean up the event listener when the component unmounts
    return () => {
      backHandler.remove();
    };
  }, []);

  const checkUpdateNeeded = async () => {
  let updateNeeded = await VersionCheck.needUpdate();
  if (updateNeeded && updateNeeded.isNeeded) {
      Alert.alert('Ada update', 'Ada aplikasi versi terbaru update dulu yuk!',
      [
        {
          text: 'Update',
          onPress: () => {
            BackHandler.exitApp();
            Linking.openURL(updateNeeded.storeUrl)
          }
        }
      ],
      {cancelable: false}
      )
    }
  }

  useEffect(() => {
    checkUpdateNeeded();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-blue-200`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={tw`bg-transparent w-full flex flex-col ${ Platform.OS === "android" ? 'pt-10' : 'pt-10' }`}>
          <View style={tw`absolute -z-10 w-full px-4 py-22`}>
            <View style={tw`bg-white px-8 py-6 flex flex-row items-center justify-center rounded-3xl shadow-xl shadow-white`}>
              <View style={tw`flex-1 gap-4`}>
                <Text style={tw`font-bold text-base text-gray-900`}>Wilujeng Sumping !</Text>
                <Text style={tw`text-sm text-gray-500`}><Text style={tw`font-bold`}>Bandung Waste Management</Text> adalah aplikasi untuk monitoring pengolahan sampah di setiap sektor yang berada di Kota Bandung.</Text>
                <Text style={tw`text-xs text-gray-500`}>Bandung menuju <Text style={tw`font-bold`}>Kawasan Bebas Sampah</Text>.</Text>
              </View>
            </View>
          </View>
        </View>
        <Image
          source={require('../assets/images/bwm-day.png')}
          style={[tw`w-full h-full absolute top-10`]}
          resizeMode="cover"
        />
      </ScrollView>

      <View style={tw`bg-white py-6 flex flex-row px-4 border-t-2 border-green-600 gap-4`}>
        <TouchableOpacity onPress={() => navigation.navigate('Login' as never)} style={tw`flex-1 bg-green-600 py-3 rounded-full`}>
          <Text style={tw`text-white font-bold text-lg text-center`}>Masuk</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default WelcomeScreen