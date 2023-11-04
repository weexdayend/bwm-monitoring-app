import React, { useState } from "react";

import { 
  View,
  Text,
  Platform,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from "@react-navigation/native";

import tw from 'twrnc';
import * as Solid from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DbResult, supabase } from "../lib/supabase";

async function save(key: any, value: any) {
  await AsyncStorage.setItem(key, value);
}

type Props = {}

const LoginScreen = (props: Props) => {
  const navigation = useNavigation()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [showPassword, setShowPassword] = useState<boolean>(true)

  const padding = Platform.OS === "ios" ? 'px-4 py-4' : ''
  const titleSize = Platform.OS === "ios" ? 'text-lg' : 'text-3xl'

  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)

  const handleSubmitted = async () => {
    try {
      setLoading(true)
      setModalVisible(true)
      setRegistrationError(null)

      const checkEmail = supabase
        .from("tbl_operator")
        .select("id")
        .eq("email", email).eq("password", password)
      const CheckUserEmailEvent: DbResult<typeof checkEmail> = await checkEmail;

      if (CheckUserEmailEvent.data?.length === 0) {
        setRegistrationError('Email atau Password kamu salah!')
        return
      }

      const user = CheckUserEmailEvent.data && CheckUserEmailEvent.data[0].id
      const checkTPS = supabase
        .from("tbl_operator_tps")
        .select("tpsId")
        .eq("operatorId", `${user}`)
      const CheckTPSEvent: DbResult<typeof checkTPS> = await checkTPS;
      const tps = CheckTPSEvent.data && CheckTPSEvent.data[0].tpsId

      save('OperatorID', JSON.stringify(user))
      save('TPS', JSON.stringify(tps))
    } catch (error: any) {
      setRegistrationError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[tw`bg-white`,{ flex: 1 }]}
    >
      <Modal
        transparent={false}
        animationType='slide'
        visible={modalVisible}
      >
        {
          loading ? (
            <View style={tw`flex-1 items-center justify-center gap-4`}>
              <Text style={tw`font-bold text-base`}>Checking your data...</Text>
              <ActivityIndicator size="large" color="#16a34a" />
            </View>
          ) : (
            <View style={tw`flex-1 items-center justify-center gap-4`}>
              {
                registrationError ? (
                  <>
                    <Text style={tw`font-bold text-base text-gray-900`}>Login Error</Text>
                    <Text style={tw`font-medium text-sm text-gray-900`}>{registrationError}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false)
                        setRegistrationError(null)
                      }}
                      style={tw`px-6 py-2 rounded-full bg-green-600`}
                    >
                      <Text style={tw`font-bold text-sm text-white`}>Close</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={tw`font-bold text-base text-gray-900`}>Yeayyyy</Text>
                    <Text style={tw`font-medium text-sm text-gray-900`}>Wilujeng sumping wargi bandung!</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false)
                        navigation.navigate('Home' as never)
                      }}
                      style={tw`px-6 py-2 rounded-full bg-green-600`}
                    >
                      <Text style={tw`font-bold text-sm text-white`}>Hayu Mulai Bebersih</Text>
                    </TouchableOpacity>
                  </>
                )
              }
            </View>
          )
        }
      </Modal>
    <View style={tw`w-full bg-gray-50 px-4 pt-16 pb-2`}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-transparent flex flex-row gap-2 items-center`}>
        <Solid.ArrowLeftIcon size={28} style={tw`text-green-600`} />
      <Text style={tw`${titleSize} font-bold text-green-600 text-center`}>Login</Text>
      </TouchableOpacity>
    </View>
    <View style={tw`flex-1 w-full bg-white px-4 gap-6 ${ Platform.OS === "android" ? 'pt-16' : 'pt-6'}`}>
      <View>
        <Text style={tw`font-bold text-xl text-gray-900`}>Masukkan Email dan Password</Text>
        <Text style={tw`text-sm text-gray-600`}>Buat masuk ke akun Bandung Waste Management.</Text>
      </View>
      <View style={tw`flex flex-col gap-2`}>
        <Text style={tw`text-gray-800`}>Email</Text>
        <TextInput
          placeholder="example@email.com"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          style={tw`px-4 py-4 border border-gray-300 rounded-xl text-gray-800`}
          returnKeyType="done"
          autoCapitalize="none"
          placeholderTextColor={'#9ca3af'}
        />
      </View>
      <View style={tw`flex flex-col gap-2`}>
        <Text style={tw`text-gray-800`}>Password</Text>
        <TextInput
          placeholder=""
          onChangeText={(text) => setPassword(text)}
          value={password}
          keyboardType="default"
          style={tw`px-4 py-4 border border-gray-300 rounded-xl text-gray-800`}
          returnKeyType="done"
          secureTextEntry={showPassword}
          autoCapitalize="none"
          placeholderTextColor={'#9ca3af'}
        />
      </View>
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={tw`px-4 leading-5 py-4 -mt-4`}>
        <Text style={tw`text-gray-900`}>Show password</Text>
      </TouchableOpacity>
      <View style={tw`w-full mt-10`}>
        <TouchableOpacity onPress={() => handleSubmitted()} style={tw`w-full flex flex-row items-center justify-center gap-1 px-6 py-4 bg-green-600 rounded-full shadow-xl shadow-black/30`}>
          <Text style={tw`text-center font-bold text-base text-white`}>Lanjut</Text>
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen