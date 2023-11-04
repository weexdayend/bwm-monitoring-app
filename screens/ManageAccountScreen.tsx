import React, { useCallback, useMemo, useRef } from 'react'

import { 
  View, 
  Text,
  Platform, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native'

import BottomSheet, { 
  BottomSheetScrollView, 
  BottomSheetBackdrop 
} from "@gorhom/bottom-sheet";

import { useNavigation } from '@react-navigation/native';

import tw from 'twrnc'

import * as Solid from 'react-native-heroicons/solid'

type Props = {}

const ManageAccountScreen = (props: Props) => {
  const navigation = useNavigation()
  
  const sheetRef = useRef<BottomSheet>(null);

  const { height: screenHeight } = Dimensions.get('window');

  // Calculate the desired height as a percentage of the screen height
  const desiredHeightPercentage = 20; // Change this value as needed
  const desiredHeight = (screenHeight * desiredHeightPercentage) / 100;
  const snapPoints = useMemo(() => [desiredHeight], []);

  const handleSnapPress = useCallback((index: any) => {
    sheetRef.current?.snapToIndex(index)
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <SafeAreaView
      style={tw`flex-1 bg-white`}
    >
      <View style={tw`flex flex-col px-4 pt-16 pb-4`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-transparent flex flex-row gap-2 items-center`}>
          <Solid.ArrowLeftIcon size={28} style={tw`text-green-600`} />
          <Text style={tw`text-xl font-bold text-green-600 text-center`}>Manage Account</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={tw`flex px-4 ${ Platform.OS === "android" ? 'pt-10 pb-26' : 'pt-16 pb-26' }`}>
          <View style={tw`flex flex-col`}>
            <TouchableOpacity onPress={() => handleSnapPress(0)} style={tw`flex flex-row px-4 py-4 border-b border-gray-200 items-center justify-between`}>
              <View style={tw`flex flex-row gap-4 items-center`}>
                <Solid.ArrowUpTrayIcon size={24} style={[tw`text-gray-800`, { transform: [{ rotate: '90deg' }] }]} />
                <View style={tw`flex-1 pr-12 flex-col flex-nowrap gap-1`}>
                  <Text style={tw`text-base font-medium text-gray-800`}>Log out</Text>
                  <Text style={tw`text-sm text-gray-500`}>Kamu harus log in kembali jika kamu ingin menggunakan Bandung Waste Management lagi.</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={tw`flex flex-row px-4 py-4 border-b border-gray-200 items-center justify-between`}>
              <View style={tw`flex flex-row gap-4 items-center`}>
                <Solid.TrashIcon size={24} style={[tw`text-gray-800`]} />
                <View style={tw`flex-1 pr-12 flex-col flex-nowrap gap-1`}>
                  <Text style={tw`text-base font-medium text-gray-800`}>Hapus akun</Text>
                  <Text style={tw`text-sm text-gray-500`}>Akun kamu akan di hapus permanen, dan kamu tidak akan bisa memiliki akses untuk mendapatkan segala bentuk informasi di Bandung Waste Management.</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <View style={tw`rounded-3xl px-6 py-6`}>
          <Text style={tw`text-2xl font-bold text-gray-900 mb-6`}>Apakah kamu yakin ingin log out?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Welcome' as never)}
            style={tw`w-full px-4 py-4 bg-red-600 rounded-full`}
          >
            <Text style={tw`text-base font-bold text-center text-white`}>Log out</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  )
}


export default ManageAccountScreen