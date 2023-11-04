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

const NewAccountScreen = (props: Props) => {
  const navigation = useNavigation()

  const [fullName, setFullName] = useState<string>('')
  const [selectedKelurahan, setSelectedKelurahan] = useState<string>('')
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('')
  const [selectedWilayah, setSelectedWilayah] = useState<string>('')
  const [selectedTPS, setSelectedTPS] = useState<string>('')

  const padding = Platform.OS === "ios" ? 'px-4 py-4' : ''

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
        <Text style={tw`font-bold text-xl text-gray-900`}>Lengkapi data diri</Text>
        <Text style={tw`text-sm text-gray-600`}>Sebelum melanjutkan registrasi, isi terlebih dahulu data diri kamu.</Text>
      </View>
      <View style={tw`flex flex-col gap-2`}>
        <Text style={tw`text-gray-800`}>Nama Lengkap</Text>
        <TextInput
          placeholder="Cth: Irvan Gerhana"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          keyboardType="default"
          style={tw`px-4 py-4 border border-gray-300 rounded-xl text-gray-800`}
          returnKeyType="done"
        />
      </View>
      <View style={tw`flex flex-col gap-2`}>
        <Text style={tw`text-gray-800`}>Kelurahan</Text>
        <View style={tw`${padding} border border-gray-300 rounded-xl`}>
          <Picker
            selectedValue={selectedKelurahan}
            onValueChange={(value) => setSelectedKelurahan(value)}
            style={tw` text-gray-800`}
          >
            <Picker.Item label="Hegarmanah" value="Hegarmanah" />
          </Picker>
        </View>
      </View>
      <View style={tw`flex flex-col gap-2`}>
        <Text style={tw`text-gray-800`}>Kecamatan</Text>
        <View style={tw`${padding} border border-gray-300 rounded-xl`}>
          <Picker
            selectedValue={selectedKecamatan}
            onValueChange={(value) => setSelectedKecamatan(value)}
            style={tw` text-gray-800`}
          >
            <Picker.Item label="Cidadap" value="Cidadap" />
          </Picker>
        </View>
      </View>
      <View style={tw`flex flex-col gap-2`}>
        <Text style={tw`text-gray-800`}>Wilayah</Text>
        <View style={tw`${padding} border border-gray-300 rounded-xl`}>
          <Picker
            selectedValue={selectedWilayah}
            onValueChange={(value) => setSelectedWilayah(value)}
            style={tw` text-gray-800`}
          >
            <Picker.Item label="Hegarmanah" value="Hegarmanah" />
          </Picker>
        </View>
      </View>
      <View style={tw`flex flex-col gap-2`}>
        <Text style={tw`text-gray-800`}>TPS</Text>
        <View style={tw`${padding} border border-gray-300 rounded-xl text-gray-800`}>
          <Picker
            selectedValue={selectedTPS}
            onValueChange={(value) => setSelectedTPS(value)}
            style={tw` text-gray-800`}
          >
            <Picker.Item label="TPS 001" value="TPS 001" />
          </Picker>
        </View>
      </View>
      <View style={tw`w-full mt-10`}>
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)} style={tw`w-full flex flex-row items-center justify-center gap-1 px-6 py-4 bg-green-600 rounded-full shadow-xl shadow-black/30`}>
          <Text style={tw`text-center font-bold text-base text-white`}>Simpan data</Text>
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}

export default NewAccountScreen