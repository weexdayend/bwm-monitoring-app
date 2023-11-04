import React, { useRef, useEffect, useState } from "react";

import { 
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";

import tw from 'twrnc';
import * as Solid from 'react-native-heroicons/solid';

type Props = {}

const ProcessingScreen = (props: Props) => {
  const navigation = useNavigation()

  const inputRef = useRef<TextInput | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedWaste, setSelectedWaste] = useState<string>('')
  const [selectedClasify, setSelectedClasify] = useState<string>('')
  const [totalSampah, setTotalSampah] = useState<string>('')

  const padding = Platform.OS === "ios" ? 'px-4 py-4' : ''
  const titleSize = Platform.OS === "ios" ? 'text-lg' : 'text-3xl'

  useEffect(() => {
    // Add a listener for the keyboard to show
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      // Scroll to the input field
      scrollViewRef.current?.scrollTo({ y: 200, animated: true }); // Scroll to the top of the ScrollView
      inputRef.current?.focus();
    });

    // Clean up the listener when the component unmounts
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[tw`bg-white`,{ flex: 1 }]}
    >
      <View style={tw`w-full bg-gray-50 px-4 pt-16 pb-2`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-transparent flex flex-row gap-2 items-center`}>
          <Solid.ArrowLeftIcon size={28} style={tw`text-green-600`} />
        <Text style={tw`${titleSize} font-bold text-green-600 text-center`}>Olah Sampah</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={tw`flex-1 w-full bg-white px-4 gap-6 ${ Platform.OS === "android" ? 'pt-16' : 'pt-6'}`}>
          <View style={tw`flex flex-col gap-2`}>
            <Text style={tw`text-gray-800`}>Pilih tempat pengolahan</Text>
            <View style={tw`${padding} border border-gray-300 rounded-xl`}>
              <Picker
                selectedValue={selectedLocation}
                onValueChange={(value) => setSelectedLocation(value)}
                style={tw`text-gray-800`}
              >
                <Picker.Item label="TPS 001" value="TPS 001" />
              </Picker>
            </View>
          </View>
          <View style={tw`flex flex-col gap-2`}>
            <Text style={tw`text-gray-800`}>Pilih jenis sampah</Text>
            <View style={tw`${padding} border border-gray-300 rounded-xl`}>
              <Picker
                selectedValue={selectedWaste}
                onValueChange={(value) => setSelectedWaste(value)}
                style={tw`text-gray-800`}
              >
                <Picker.Item label="Organik" value="Organik" />
                <Picker.Item label="Anorganik" value="Anorganik" />
                <Picker.Item label="Residu" value="Residu" />
              </Picker>
            </View>
          </View>
          <View style={tw`flex flex-col gap-2`}>
            <Text style={tw`text-gray-800`}>Pilih klasifikasi pengolahan</Text>
            <View style={tw`${padding} border border-gray-300 rounded-xl`}>
              <Picker
                selectedValue={selectedClasify}
                onValueChange={(value) => setSelectedClasify(value)}
                style={tw`text-gray-800`}
              >
                <Picker.Item label="Daur Ulang" value="Daur Ulang" />
                <Picker.Item label="Buang" value="Buang" />
              </Picker>
            </View>
          </View>
          <View style={tw`flex flex-col gap-2`}>
            <Text style={tw`text-gray-800`}>Total Sampah</Text>
            <TextInput
              placeholder="Masukkan Total Sampah..."
              onChangeText={(text) => setTotalSampah(text)}
              value={totalSampah}
              keyboardType="number-pad"
              style={tw`px-4 py-4 border border-gray-300 rounded-xl text-gray-800`}
              returnKeyType="done"
              
            />
          </View>
          <View style={tw`w-full mt-10`}>
            <TouchableOpacity style={tw`w-full flex flex-row items-center justify-center gap-1 px-6 py-4 bg-green-600 rounded-full shadow-xl shadow-black/30`}>
              <Text style={tw`text-center font-bold text-base text-white`}>Simpan Data Sampah</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default ProcessingScreen