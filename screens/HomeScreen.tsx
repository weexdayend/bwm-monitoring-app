import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { 
  Image, 
  ScrollView,
  Platform, 
  SafeAreaView,
  Dimensions, 
  useColorScheme,
  View,
  Text,
  BackHandler,
  TouchableOpacity,
} from 'react-native';

import BottomSheet, { 
  BottomSheetScrollView, 
  BottomSheetBackdrop 
} from "@gorhom/bottom-sheet";

import { useNavigation } from '@react-navigation/native';
import { DbResult, supabase } from "../lib/supabase";

import StatusBarPercentage from "../components/ProgressBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from 'react-native-date-picker'

import * as Outline from 'react-native-heroicons/outline'
import * as Solid from 'react-native-heroicons/solid'

import tw from 'twrnc'
import moment from 'moment-timezone';
import 'moment/locale/id';

import Skeleton from "../components/Skeleton"
import AxesExample from "../components/LineChart";
import CircularProgressBar from "../components/ProgressCircular";

type Props = {}

async function retrieveNumber(key: string) {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return parseInt(value, 10)
    }
    return null
  } catch (error) {
    console.error(`Error retrieving ${key}: ${error}`)
    return null
  }
}

const HomeScreen = (props: Props) => {
  const navigation = useNavigation()

  const [selectFilterDate, setSelectFilterDate] = useState<any>('Semua Data')
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  const sheetRef = useRef<BottomSheet>(null);

  const filterDate = ['Semua Data', 'Filter berdasarkan tanggal']

  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const snapPoints = useMemo(() => ["55%"], []);

  const handleSnapPress = useCallback((index: any, filter: any) => {
    sheetRef.current?.snapToIndex(index)
  }, []);

  const handleFilterSelected = (item: any) => {
    setSelectFilterDate(item)
  }

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

  const renderFilterItem = useCallback(
    (item: any) => (
      <TouchableOpacity
        key={item}
        onPress={() => handleFilterSelected(item)}
        style={tw`w-full flex flex-row items-center justify-between py-2 my-2 px-4 border-b border-gray-200 rounded-lg`}
      >
        <Text style={tw`text-lg text-gray-800`}>{item}</Text>
        {selectFilterDate === item && (
          <Solid.CheckCircleIcon size={26} style={tw`text-green-600`} />
        )}
      </TouchableOpacity>
    ),
    [selectFilterDate, handleFilterSelected]
  );

  const { width } = Dimensions.get('window');

  const responsiveWidth = width * 0.8;
  const columnWidth = width / 5;

  const colorScheme = useColorScheme()
  const backgroundColor = colorScheme === 'dark' ? 'bg-blue-950' : 'bg-blue-200'

  const currentLocalizedDate = moment();
  const formattedDate = currentLocalizedDate.format('LL');

  const currentMonth = moment()
  const formattedMonth = currentMonth.format('MMMM YYYY');

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

  const [kelolaSampah, setKelolaSampah] = useState<any>([])
  const [olahSampah, setOlahSampah] = useState<any>([])
  const [transferedSampah, setTransferedSampah] = useState<any>([])

  const [loadSkeleton, setLoadSkeleton] = useState<boolean>(false)

  const getTotalSampah = async () => {
    const check = supabase
      .from("tbl_kelola")
      .select()
      .eq("status", 'Approved')
    const response = await check;
    
    return response.data
  }

  const getTransferedSampah = async () => {
    const check = supabase
      .from("tbl_kelola")
      .select()
      .eq("status", 'Transfered')
    const response = await check;
    
    return response.data
  }

  const getOlahSampah = async () => {
    const check = supabase
      .from("tbl_olah")
      .select(`*`)
    const response = await check;
    
    return response.data
  }

  const prom = () => {
    setLoadSkeleton(true)
    Promise.all([getTotalSampah(), getOlahSampah(), getTransferedSampah()])
      .then(([totalSampah, olahSampah, transferedSampah]) => {
        setKelolaSampah(totalSampah)
        setOlahSampah(olahSampah)
        setTransferedSampah(transferedSampah)

        setLoadSkeleton(false)
      })
      .catch((error) => {
        console.error('An error occurred:', error);
        setLoadSkeleton(false)
      });
  }

  useEffect(() => {
    const Kelola = supabase.channel('HomeChannel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tbl_kelola' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            prom()
          }
          if (payload.eventType === 'UPDATE') {
            prom()
          }
          if (payload.eventType === 'DELETE') {
            prom()
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tbl_olah' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            prom()
          }
          if (payload.eventType === 'UPDATE') {
            prom()
          }
          if (payload.eventType === 'DELETE') {
            prom()
          }
        }
      )
      .subscribe()

    return (() => {
      Kelola.unsubscribe()
    })
  }, [])

  useEffect(() => {
    prom()
  }, []);

  const transferSampah = transferedSampah && transferedSampah
  .filter((item: any) => {
    if (selectFilterDate !== 'Semua Data') {
      const itemDate = item.created_at.split('T')[0]; // Extract the date part
      const currentDate = date.toISOString().split('T')[0]; // Convert date to the same format
      return itemDate === currentDate; // Compare without milliseconds
    } else {
      return true;
    }
  })
  .reduce((total: any, item: any) => total + parseFloat(item.volume), 0)

  const totalSampah = kelolaSampah && kelolaSampah
  .filter((item: any) => {
    if (selectFilterDate !== 'Semua Data') {
      const itemDate = item.created_at.split('T')[0]; // Extract the date part
      const currentDate = date.toISOString().split('T')[0]; // Convert date to the same format
      return itemDate === currentDate; // Compare without milliseconds
    } else {
      return true;
    }
  })
  .reduce((total: any, item: any) => ((parseFloat(total) + parseFloat(item.volume)).toFixed(1)).toString(), 0)
  
  const fixedTotal = totalSampah - transferSampah

  const olahanSampah = olahSampah && olahSampah
  .filter((item: any) => {
    if (selectFilterDate !== 'Semua Data') {
      const itemDate = item.created_at.split('T')[0]; // Extract the date part
      const currentDate = date.toISOString().split('T')[0]; // Convert date to the same format
      return itemDate === currentDate; // Compare without milliseconds
    } else {
      return true;
    }
  })
  .reduce((total: string, item: any) => {
    if (item.klasifikasi != "Kirim ke TPS") {
      return ((parseFloat(total) + parseFloat(item.total)).toFixed(1)).toString();
    }
    return total;
  }, 0);

  let cek = parseFloat(((olahanSampah / totalSampah) * 100).toFixed(1));
  if (isNaN(cek)) {
    cek = 0;
  }

  const totalData = kelolaSampah
  ? kelolaSampah
      .slice()
      .sort((a: any, b: any) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateA.getTime() - dateB.getTime();
      })
      .reduce((result: any, item: any) => {
      // Extract date part without time or "T"
      const dateWithoutTime = item.created_at.split("T")[0];
      
      const existingItem = result.find((group: any) => group.date === dateWithoutTime);
      if (existingItem) {
        existingItem.volume += item.volume;
      } else {
        result.push({ date: dateWithoutTime, volume: item.volume });
      }
      return result;
    }, [])
  : [];

  const dateArray = totalData ? totalData.map((item: any) => item.date) : []
  const volumeArray = totalData ? totalData.map((item: any) => item.volume) : []

  const groupedData = olahSampah
  ? olahSampah
    .filter((item: any) => {
      if (selectFilterDate !== 'Semua Data') {
        const itemDate = item.created_at.split('T')[0]; // Extract the date part
        const currentDate = date.toISOString().split('T')[0]; // Convert date to the same format
        return itemDate === currentDate; // Compare without milliseconds
      } else {
        return true;
      }
    }).reduce((result: any, item: any) => {
      const existingItem = result
      .find((group: any) => group.klasifikasi === item.klasifikasi);
      if (existingItem) {
        existingItem.total += item.total;
      } else {
        result.push({ klasifikasi: item.klasifikasi, total: item.total });
      }
      return result;
    }, [])
  : [];

  const groupedDaurUlang = olahSampah
  ? olahSampah
    .filter((item: any) => {
      if (selectFilterDate !== 'Semua Data') {
        const itemDate = item.created_at.split('T')[0]; // Extract the date part
        const currentDate = date.toISOString().split('T')[0]; // Convert date to the same format
        return itemDate === currentDate; // Compare without milliseconds
      } else {
        return true;
      }
    }).reduce((result: any, item: any) => {
      const existingItem = result
      .find((group: any) => group.keterangan === item.keterangan);
      if (existingItem) {
        existingItem.total += item.total;
      } else {
        result.push({ keterangan: item.keterangan, total: item.total });
      }
      return result;
    }, [])
  : [];

  const groupedAndSummedData = olahSampah
  ? olahSampah
    .filter((item: any) => {
      if (selectFilterDate !== 'Semua Data') {
        const itemDate = item.created_at.split('T')[0]; // Extract the date part
        const currentDate = date.toISOString().split('T')[0]; // Convert date to the same format
        return itemDate === currentDate; // Compare without milliseconds
      } else {
        return true;
      }
    }).reduce((result: any, item: any) => {
      const existingItem = result
      .find((group: any) => group.jenis === item.jenis);
      if (existingItem) {
        existingItem.total += item.total;
      } else {
        result.push({ jenis: item.jenis, total: item.total });
      }
      return result;
    }, [])
  : [];

  const currentDate = new Date(date).toISOString().split("T")[0]; // Get current date in "YYYY-MM-DD" format
  
  return (
    <SafeAreaView
      style={tw`flex-1 ${backgroundColor}`}
    >
      <DatePicker
        modal
        open={open}
        date={date}
        mode='date'
        onConfirm={(date: any) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={tw`bg-transparent w-full ${ Platform.OS === "android" ? 'pt-10' : 'pt-0' }`}>
          <View style={tw`absolute -z-10 w-full px-4 py-18`}>
            <View style={tw`bg-white px-8 py-8 flex flex-row items-center justify-center rounded-3xl shadow-xl shadow-blue-600/30`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs font-medium text-zinc-900`}>Persentase Olahan Sampah</Text>
                <Text style={tw`font-bold text-2xl text-gray-800`}>Kota Bandung</Text>
                <View style={tw`mt-2 w-38 px-2 py-1.5 rounded-lg ${cek > 79 ? 'bg-[#16a34a]' : cek < 80 && cek > 50 ? 'bg-[#f59e0b]' : 'bg-[#dc2626]'}`}>
                  <Text style={tw`text-white font-bold text-sm text-center`}>
                    {cek > 79 ? 'Sae Pisan!' : cek < 80 && cek > 50 ? 'Lumayan!' : 'Kedah di Kawal!'}
                  </Text>
                </View>
                
              </View>

              <View style={tw`flex`}>
                <CircularProgressBar percentage={cek} color={cek > 79 ? '#16a34a' : cek < 80 && cek > 50 ? '#f59e0b' : '#dc2626'} />
              </View>
            </View>
          </View>
          <View style={[tw`z-10 w-full h-${responsiveWidth * 0.28} bg-transparent items-center`]}>
            <Image
              source={require('../assets/images/bwm-day.png')}
              style={[tw`w-full h-full`]}
              resizeMode="cover"
            />
          </View>
          <View style={tw`z-50 bg-white h-full rounded-t-3xl px-4 py-6 gap-4 -top-4 pb-24`}>
            {/* Widget untuk button kelola dan olah sampah */}
            <View style={tw`w-full flex flex-col px-4 py-4`}>
              <ScrollView
                horizontal
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View style={[tw`w-full flex flex-row items-center pr-4 gap-2 pt-2 pb-4`, { flexGrow: 1 }]}>
                  <TouchableOpacity
                    onPress={() => handleSnapPress(0, 'date')}
                    style={tw`rounded-xl border ${selectFilterDate != 'Semua Data' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}
                  >
                    <View style={tw`flex flex-row items-center px-2 py-2 gap-3`}>
                      <Text style={tw`text-lg text-gray-500 leading-5`}>{selectFilterDate}</Text>
                      <Outline.ChevronDownIcon style={tw`text-gray-500`} size={18} />
                    </View>
                  </TouchableOpacity>
                  {selectFilterDate != "Semua Data" && (
                    <TouchableOpacity
                      onPress={() => setOpen(true)}
                      style={tw`rounded-xl border border-green-600 bg-green-50`}
                    >
                      <View style={tw`flex flex-row items-center px-2 py-2 gap-3`}>
                        <Text style={tw`text-lg text-gray-500 leading-5`}>{currentDate}</Text>
                        <Outline.ChevronDownIcon style={tw`text-gray-500`} size={18} />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
              {
                loadSkeleton ? (
                  <View style={tw`w-full flex flex-col justify-between py-4 gap-2 mt-6`}>
                    <Skeleton width={"w-full"} height={"h-8"} />
                    <Skeleton width={"w-full"} height={"h-8"} />
                    <Skeleton width={"w-full"} height={"h-8"} />
                    <Skeleton width={"w-full"} height={"h-8"} />
                    <Skeleton width={"w-full"} height={"h-8"} />
                  </View>
                ) : (
                  <View style={tw`w-full flex flex-col justify-between py-4 gap-2 mt-6`}>
                    <View style={tw`flex flex-row justify-between border-b border-gray-300`}>
                      <Text style={tw`text-gray-800 font-bold`}>SAMPAH MASUK</Text>
                      {kelolaSampah && (
                        <Text style={tw`text-sm text-gray-800`}>
                          <Text style={tw`font-bold text-2xl py-2`}>{(fixedTotal)}</Text> {`(Kg)`}
                        </Text>
                      )}
                    </View>
                    <View style={tw`flex flex-row justify-between border-b border-gray-300`}>
                      <Text style={tw`text-green-600 font-bold`}>SAMPAH YANG DI DAUR ULANG</Text>
                      {olahSampah && (
                        <Text style={tw`text-sm text-green-600`}>
                          <Text style={tw`font-bold text-2xl py-2`}>{(olahanSampah)}</Text> <Text style={tw`text-gray-800`}>{`(Kg)`}</Text>
                        </Text>
                      )}
                    </View>
                    <View style={tw`flex flex-row justify-between`}>
                      <Text style={tw`text-amber-600 font-bold`}>SISA SAMPAH</Text>
                      {olahSampah && (
                        <Text style={tw`text-sm text-amber-600`}>
                          <Text style={tw`font-bold text-2xl py-2`}>{(fixedTotal-olahanSampah).toFixed(1)}</Text> <Text style={tw`text-gray-800`}>{`(Kg)`}</Text>
                        </Text>
                      )}
                    </View>
                    <View style={tw`h-0.5 bg-gray-300 w-full rounded-full my-6`} />
                    <Text style={tw`text-sm text-gray-700`}>Sampah masuk yang kemudian di kirim ke afiliasi KBS/TPS</Text>
                    <View style={tw`flex flex-row justify-between mb-8`}>
                      <Text style={tw`text-red-600 font-bold`}>SAMPAH DI KIRIM / TRANSFER</Text>
                      {olahSampah && (
                        <Text style={tw`text-sm text-red-600`}>
                          <Text style={tw`font-bold text-2xl py-2`}>{(transferSampah)}</Text> <Text style={tw`text-gray-800`}>{`(Kg)`}</Text>
                        </Text>
                      )}
                    </View>

                    {/* <AxesExample date={dateArray} volume={volumeArray} /> */}
                  </View>
                )
              }
            </View>

            <View style={tw`bg-white w-full px-4 py-4 rounded-3xl shadow-xl shadow-blue-600/30`}>
              <View style={tw`flex`}>
                <Text style={tw`text-xl font-bold text-gray-900`}>Jenis Sampah</Text>
              </View>
              <View style={tw`flex flex-col justify-between items-center py-4 gap-6 mt-4`}>
                {
                loadSkeleton ? (
                  <View style={tw`w-full flex flex-col justify-between gap-2`}>
                    <Skeleton width={'w-full'} height={'h-5'} />
                    <Skeleton width={'w-full'} height={'h-5'} />
                    <Skeleton width={'w-full'} height={'h-5'} />
                  </View>
                ) : groupedAndSummedData.length > 0 ? (
                  groupedAndSummedData.map((item: any, index: any) => (
                    <View key={index + 1} style={tw`w-full flex flex-col justify-between gap-2`}>
                      <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`text-gray-800 font-bold`}>{item.jenis}</Text>
                        <Text style={tw`text-sm text-gray-800`}>
                          <Text style={tw`font-bold text-base`}>{parseFloat(item.total).toFixed(1)}</Text> {`(Kg)`}
                        </Text>
                      </View>
                      <StatusBarPercentage color={item.jenis == 'Organik' ? 'bg-green-600' : item.jenis == 'Anorganik' ? 'bg-yellow-500' : 'bg-red-500'} percentage={(item.total / totalSampah) * 100} />
                    </View>
                  ))
                ) : (
                  <Text style={tw`w-full flex items-center py-8 text-gray-900 text-center py-4 px-2 rounded-xl border border-gray-200`}>
                    Belum ada data.
                  </Text>
                )}
              </View>
            </View>
            <View style={tw`bg-white w-full px-4 py-4 rounded-3xl shadow-xl shadow-blue-600/30`}>
              <View style={tw`flex`}>
                <Text style={tw`text-xl font-bold text-gray-900`}>Hasil Pengolahan</Text>
              </View>
              <View style={tw`flex flex-row justify-between items-center py-4 gap-6 mt-4`}>
                {
                loadSkeleton ? (
                  <View style={tw`flex flex-row justify-between gap-4`}>
                    <Skeleton width={'flex-1'} height={'h-5'} />
                    <Skeleton width={'flex-1'} height={'h-5'} />
                  </View>
                ) : groupedData.length > 0 ? (
                  groupedData.map((item: any, index: any) => (
                    <View key={index + 1} style={tw`flex-1 flex-col justify-between gap-2`}>
                      <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`text-gray-800 font-bold`}>{item.klasifikasi === 'Kirim ke TPS' ? 'Kirim / Transfer' : 'Daur Ulang'}</Text>
                        <Text style={tw`text-sm text-gray-800`}>
                          <Text style={tw`font-bold text-base`}>{parseFloat(item.total).toFixed(1)}</Text> {`(Kg)`}
                        </Text>
                      </View>
                      <StatusBarPercentage color={item.klasifikasi == 'Kirim ke TPS' ? 'bg-red-500' : 'bg-green-600'} percentage={(item.total / totalSampah) * 100} />
                    </View>
                  ))
                ) : (
                  <Text style={tw`w-full flex items-center py-8 text-gray-900 text-center py-4 px-2 rounded-xl border border-gray-200`}>
                    Belum ada data.
                  </Text>
                )}
              </View>
            </View>
            <View style={tw`bg-white w-full px-4 py-4 rounded-3xl shadow-xl shadow-blue-600/30`}>
              <View style={tw`flex`}>
                <Text style={tw`text-xl font-bold text-gray-900`}>Daur Ulang Sampah</Text>
              </View>
              <View style={tw`flex flex-col justify-between items-center py-4 gap-6 mt-4`}>
                {
                loadSkeleton ? (
                  <View style={tw`w-full flex flex-col justify-between gap-2`}>
                    <Skeleton width={'w-full'} height={'h-5'} />
                    <Skeleton width={'w-full'} height={'h-5'} />
                    <Skeleton width={'w-full'} height={'h-5'} />
                  </View>
                ) : groupedDaurUlang.length > 0 ? (
                  groupedDaurUlang
                  .filter((item: any) => item.keterangan !== 'Buang' && item.keterangan !== 'Kirim ke TPS')
                  .map((item: any, index: any) => (
                    <View key={index + 1} style={tw`w-full flex flex-col justify-between gap-2`}>
                      <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`text-gray-800 font-bold`}>{item.keterangan}</Text>
                        <Text style={tw`text-sm text-gray-800`}>
                          <Text style={tw`font-bold text-base`}>{parseFloat(item.total).toFixed(1)}</Text> {`(Kg)`}
                        </Text>
                      </View>
                      <StatusBarPercentage color={'bg-green-600'} percentage={(item.total / totalSampah) * 100} />
                    </View>
                  ))
                ) : (
                  <Text style={tw`w-full flex items-center py-8 text-gray-900 text-center py-4 px-2 rounded-xl border border-gray-200`}>
                    Belum ada data.
                  </Text>
                )}
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
        <Text style={tw`font-bold text-xl px-4 pb-2 text-gray-800`}>Mau filter data ?</Text>
        <View style={tw`h-0.2 w-full bg-gray-300 rounded-full`} />
        <BottomSheetScrollView contentContainerStyle={tw`flex-1 py-4`}>
          {
            filterDate.map(renderFilterItem)
          }
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  )
}

export default HomeScreen