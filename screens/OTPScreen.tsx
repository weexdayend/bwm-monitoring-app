import React, { useState } from "react";

import { 
  View,
  Text,
  Platform,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';

import { useNavigation } from "@react-navigation/native";

import tw from 'twrnc';
import * as Solid from 'react-native-heroicons/solid';

type Props = {}

const OTPScreen = (props: Props) => {
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
      </TouchableOpacity>
    </View>
    <View style={tw`flex-1 w-full bg-white px-4 gap-6 ${ Platform.OS === "android" ? 'pt-16' : 'pt-6'}`}>
      <View>
        <Text style={tw`font-bold text-xl text-gray-900`}>Masukkan kode OTP</Text>
        <Text style={tw`text-sm text-gray-600`}>Kami sudah kirim kode OTP ke nomor yang kamu masukkan +62 812 xxx xxx.</Text>
      </View>
      <View style={tw`flex flex-col gap-2`}>
        <Text style={tw`text-gray-800`}>Kode OTP</Text>
        <TextInput
          onChangeText={(text) => setTotalSampah(text)}
          value={totalSampah}
          keyboardType="number-pad"
          style={tw`px-4 py-4 border border-gray-300 rounded-xl text-gray-800`}
          returnKeyType="done"
        />
      </View>
      <View style={tw`w-full mt-10`}>
        <TouchableOpacity onPress={() => navigation.navigate('NewAccount' as never)} style={tw`w-full flex flex-row items-center justify-center gap-1 px-6 py-4 bg-green-600 rounded-full shadow-xl shadow-black/30`}>
          <Text style={tw`text-center font-bold text-base text-white`}>Konfirmasi</Text>
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}

export default OTPScreen