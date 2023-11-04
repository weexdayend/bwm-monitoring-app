import React, { useState } from "react";

import { 
  View,
  Text,
  Platform,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";

import tw from 'twrnc';
import * as Solid from 'react-native-heroicons/solid';

type Props = {}

const SortingScreen = (props: Props) => {
  
  const navigation = useNavigation()

  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [totalSampah, setTotalSampah] = useState<string>('')

  const padding = Platform.OS === "ios" ? 'px-4 py-4' : ''
  const titleSize = Platform.OS === "ios" ? 'text-lg' : 'text-3xl'

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={[tw`bg-white`,{ flex: 1 }]}
    >
    <View style={tw`w-full bg-gray-50 px-4 pt-16 pb-2`}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-transparent flex flex-row gap-2 items-center`}>
        <Solid.ArrowLeftIcon size={28} style={tw`text-green-600`} />
      <Text style={tw`${titleSize} font-bold text-green-600 text-center`}>Kelola Sampah</Text>
      </TouchableOpacity>
    </View>
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
        <Text style={tw`text-gray-800`}>Total Sampah</Text>
        <TextInput
          placeholder="Masukkan total sampah..."
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
    </KeyboardAvoidingView>
  )
}

export default SortingScreen