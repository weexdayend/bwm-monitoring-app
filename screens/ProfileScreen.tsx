import React, { useEffect, useState } from 'react'

import { 
  View, 
  Text,
  Platform, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native'

import { useNavigation } from '@react-navigation/native';
import { DbResult, supabase } from "../lib/supabase";

import AsyncStorage from "@react-native-async-storage/async-storage";

import tw from 'twrnc'

import * as Solid from 'react-native-heroicons/solid'

type Props = {}

async function retrieveNumber(key: string) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // Convert the retrieved string back to a number
      return parseInt(value, 10);
    }
    return null; // Return null if the key doesn't exist in AsyncStorage
  } catch (error) {
    // Handle any errors that may occur during AsyncStorage operations
    console.error(`Error retrieving ${key}: ${error}`);
    return null; // Return null in case of an error
  }
}

const ProfileScreen = (props: Props) => {
  const navigation = useNavigation()

  const [profileData, setProfileData] = useState<any>([])

  const getProfile = async () => {
    const OperatorID = await retrieveNumber('OperatorID');

    const check = supabase
      .from("tbl_operator")
      .select()
      .eq("id", `${OperatorID}`)
    const response = await check;
    
    setProfileData(response.data)
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getProfile()]);
    };

    fetchData()
  }, [])

  return (
    <SafeAreaView
      style={tw`flex-1 bg-white`}
    >
      <View style={tw`flex flex-col px-4 pt-16 pb-4`}>
        <Text style={[tw`text-green-600 text-3xl font-bold`]}>Profile</Text>
        <Text style={[tw`text-gray-500 text-base`]}>Data diri dan setting aplikasi.</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={tw`flex-1 w-full px-4 ${ Platform.OS === "android" ? 'pt-10 pb-26' : 'pt-16 pb-26' }`}>
          <View style={tw`w-full flex flex-row px-4 py-4 border border-gray-100 rounded-xl bg-gray-50`}>
            <Solid.UserCircleIcon size={48} style={tw`text-green-600 mr-4`} />
            {
              profileData ? profileData.map((item: any, index: any) => (
                <View key={index} style={tw`flex-1 flex-col gap-1.5`}>
                  <Text style={tw`font-bold text-base text-gray-800`}>{item.fullname}</Text>
                  <Text style={tw`text-sm text-gray-400`}>{item.email}</Text>
                  <Text style={tw`text-sm text-gray-400`}>{item.phoneNumber}</Text>
                  <View style={tw`flex flex-row items-center`}>
                    <View style={tw`px-1 py-1 bg-blue-100 rounded-full`}>
                      <Solid.StarIcon size={20} style={tw`text-blue-500`} />
                    </View>
                    <Text style={tw`text-base text-gray-950 leading-5 px-2`}>Operator</Text>
                  </View>
                </View>)
              ) : (<></>)
            }
          </View>

          <View style={tw`w-full flex flex-col mt-12`}>
            <Text style={tw`text-sm text-gray-700 mb-4`}>Account</Text>
            <View style={tw`flex flex-row px-4 py-4 border-b border-gray-200 items-center justify-between`}>
              <View style={tw`flex flex-row gap-4 items-center`}>
                <Solid.BellIcon size={24} style={tw`text-gray-800`} />
                <Text style={tw`text-base font-medium text-gray-800`}>Notifikasi</Text>
              </View>
              <Solid.ChevronRightIcon size={24} style={tw`text-green-950`} />
            </View>
            <View style={tw`flex flex-row px-4 py-4 border-b border-gray-200 items-center justify-between`}>
              <View style={tw`flex flex-row gap-4 items-center`}>
                <Solid.ShieldExclamationIcon size={24} style={tw`text-gray-800`} />
                <Text style={tw`text-base font-medium text-gray-800`}>Keamanan Akun</Text>
              </View>
              <Solid.ChevronRightIcon size={24} style={tw`text-green-950`} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ManageAccount' as never)} style={tw`flex flex-row px-4 py-4 border-b border-gray-200 items-center justify-between`}>
              <View style={tw`flex flex-row gap-4 items-center`}>
                <Solid.Cog6ToothIcon size={24} style={tw`text-gray-800`} />
                <Text style={tw`text-base font-medium text-gray-800`}>Pengaturan Akun</Text>
              </View>
              <Solid.ChevronRightIcon size={24} style={tw`text-green-950`} />
            </TouchableOpacity>
          </View>

          <View style={tw`w-full flex flex-col mt-12`}>
            <Text style={tw`text-sm text-gray-700 mb-4`}>General</Text>
            <View style={tw`flex flex-row px-4 py-4 border-b border-gray-200 items-center justify-between`}>
              <View style={tw`flex flex-row gap-4 items-center`}>
                <Solid.ShieldExclamationIcon size={24} style={tw`text-gray-800`} />
                <Text style={tw`text-base font-medium text-gray-800`}>Kebijakan Privasi</Text>
              </View>
              <Solid.ChevronRightIcon size={24} style={tw`text-green-950`} />
            </View>
            <View style={tw`flex flex-row px-4 py-4 border-b border-gray-200 items-center justify-between`}>
              <View style={tw`flex flex-row gap-4 items-center`}>
                <Solid.ClipboardDocumentListIcon size={24} style={tw`text-gray-800`} />
                <Text style={tw`text-base font-medium text-gray-800`}>Ketentuan Layanan</Text>
              </View>
              <Solid.ChevronRightIcon size={24} style={tw`text-green-950`} />
            </View>
            <View style={tw`flex flex-row px-4 py-4 border-b border-gray-200 items-center justify-between`}>
              <View style={tw`flex flex-row gap-4 items-center`}>
                <Solid.MapPinIcon size={24} style={tw`text-gray-800`} />
                <Text style={tw`text-base font-medium text-gray-800`}>Atribusi Data</Text>
              </View>
              <Solid.ChevronRightIcon size={24} style={tw`text-green-950`} />
            </View>
            <View style={tw`flex flex-row px-4 py-4 border-b border-gray-200 items-center justify-between`}>
              <View style={tw`flex flex-row gap-4 items-center`}>
                <Solid.StarIcon size={24} style={tw`text-gray-800`} />
                <Text style={tw`text-base font-medium text-gray-800`}>Bandung Waste Management App</Text>
              </View>
              <Text style={tw`text-base font-medium text-gray-500`}>1.0.1</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen