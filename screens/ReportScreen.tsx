import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";

import { 
  ScrollView,
  Platform, 
  View,
  Text,
  BackHandler,
  Pressable,
  TouchableOpacity,
} from 'react-native';

import BottomSheet, { 
  BottomSheetScrollView, 
  BottomSheetBackdrop 
} from "@gorhom/bottom-sheet";

import { useNavigation, useRoute } from '@react-navigation/native';
import { DbResult, supabase } from "../lib/supabase";

import StatusBarPercentage from "../components/ProgressBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import tw from 'twrnc'
import moment from 'moment-timezone';
import 'moment/locale/id';

import * as Outline from 'react-native-heroicons/outline'
import * as Solid from 'react-native-heroicons/solid'

import Skeleton from "../components/Skeleton"
import CircularProgressBar from "../components/ProgressCircular";

import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  DetailSector: { sektor: string };
};

type DetailSectorScreenRouteProp = RouteProp<RootStackParamList, 'DetailSector'>;

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

const ReportScreen = (props: Props) => {
  const navigation = useNavigation<any>()

  const sheetRef = useRef<BottomSheet>(null);

  const [selectFilter, setSelectFilter] = useState<string>('')

  const [selectSector, setSelectSector] = useState<string>('Semua Sektor')
  const [selectPersen, setSelectPersen] = useState<string>('Default')

  const filterSector = ['Semua Sektor', 'Bisnis / Pariwisata', 'Residence', 'Ekonomi / Pasar', 'Pendidikan' , 'Perkantoran / UMKM', 'Perhubungan', 'Kesehatan', 'Sosial', 'OPD']
  const filterPersen = ['Default', 'Persentase Tertinggi ke Terendah', 'Persentase Terendah ke Tertinggi']

  const snapPoints = useMemo(() => ["55%"], []);

  const handleSnapPress = useCallback((index: any, filter: any) => {
    setSelectFilter(filter)
    sheetRef.current?.snapToIndex(index)
  }, []);

  const handleFilterSelected = (item: any) => {
    selectFilter == "sektor" ? setSelectSector(item) : setSelectPersen(item)
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

  const [kelolaSampah, setKelolaSampah] = useState<any>([])
  const [olahSampah, setOlahSampah] = useState<any>([])
  const [transferedSampah, setTransferedSampah] = useState<any>([])

  const [loadSkeleton, setLoadSkeleton] = useState<boolean>(false)

  const getTotalSampah = async () => {
    const check = supabase
      .from("tbl_kelola")
      .select(`*, tbl_tps(subsektor_id, tbl_subsektor(*, tbl_sektor(nama_sektor)))`)
      .eq("status", 'Approved')
    const response = await check;

    return response.data
  }

  const getTransferedSampah = async () => {
    const check = supabase
      .from("tbl_kelola")
      .select(`*, tbl_tps(subsektor_id, tbl_subsektor(*, tbl_sektor(nama_sektor)))`)
      .eq("status", 'Transfered')
    const response = await check;
    
    return response.data
  }

  const getOlahSampah = async () => {
    const check = supabase
      .from("tbl_olah")
      .select(`*, tbl_tps(subsektor_id, tbl_subsektor(*, tbl_sektor(nama_sektor)))`)
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
    const Kelola = supabase.channel('ReportChannel')
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

  const groupTotal = kelolaSampah
  ? kelolaSampah.reduce((result: any, item: any) => {
      const sekt = item.tbl_tps.tbl_subsektor.tbl_sektor;
      const key = sekt.nama_sektor;
      
      // Find the group based on the sektor name
      const existingGroup = result.find((group: any) => group.sektor === key);

      // Create a new data object
      const dataItem = { total: item.volume };

      if (existingGroup) {
        // If the group exists, push the data item into its 'data' array
        existingGroup.data.push(dataItem);
      } else {
        // If the group doesn't exist, create a new group
        result.push({ sektor: key, data: [dataItem] });
      }

      return result;
    }, [])
  : [];

  const transferSampah = transferedSampah
  ? transferedSampah.reduce((result: any, item: any) => {
      const sekt = item.tbl_tps.tbl_subsektor.tbl_sektor;
      const key = sekt.nama_sektor;
      
      // Find the group based on the sektor name
      const existingGroup = result.find((group: any) => group.sektor === key);

      // Create a new data object
      const dataItem = { total: item.volume };

      if (existingGroup) {
        // If the group exists, push the data item into its 'data' array
        existingGroup.data.push(dataItem);
      } else {
        // If the group doesn't exist, create a new group
        result.push({ sektor: key, data: [dataItem] });
      }

      return result;
    }, [])
  : [];

  const groupOlah = olahSampah
  ? olahSampah.reduce((result: any, item: any) => {
      const sekt = item.tbl_tps.tbl_subsektor.tbl_sektor;
      const key = sekt.nama_sektor;
      
      // Find the group based on the sektor name
      const existingGroup = result.find((group: any) => group.sektor === key);

      // Create a new data object
      const dataItem = { klasifikasi: item.klasifikasi, total: item.total };

      if (existingGroup) {
        // If the group exists, push the data item into its 'data' array
        existingGroup.data.push(dataItem);
      } else {
        // If the group doesn't exist, create a new group
        result.push({ sektor: key, data: [dataItem] });
      }

      return result;
    }, [])
  : [];

  groupOlah.forEach((item: any) => {
    const totalsByKlasifikasi: any = {};
  
    item.data.forEach((entry: any) => {
      const { klasifikasi, total } = entry;
  
      if (totalsByKlasifikasi[klasifikasi]) {
        totalsByKlasifikasi[klasifikasi] += total;
      } else {
        totalsByKlasifikasi[klasifikasi] = total;
      }
    });
  
    // Update the 'data' property to contain the totals grouped by 'klasifikasi'
    item.data = Object.keys(totalsByKlasifikasi).map((klasifikasi) => ({
      klasifikasi,
      total: totalsByKlasifikasi[klasifikasi],
    }));
  });

  const renderFilterItem = useCallback(
    (item: any) => (
      <TouchableOpacity
        key={item}
        onPress={() => handleFilterSelected(item)}
        style={tw`w-full flex flex-row items-center justify-between py-2 my-1 px-4 border-b border-gray-200 rounded-lg`}
      >
        <Text style={tw`text-lg text-gray-800`}>{item}</Text>
        {selectSector === item && (
          <Solid.CheckCircleIcon size={26} style={tw`text-green-600`} />
        )}
        {selectPersen === item && (
          <Solid.CheckCircleIcon size={26} style={tw`text-green-600`} />
        )}
      </TouchableOpacity>
    ),
    [selectSector, selectPersen, handleFilterSelected]
  );

  return (
    <View style={tw`flex-1 bg-white w-full h-full ${ Platform.OS === "android" ? 'pt-16' : 'pt-16' }`}>
      <View style={tw`px-4`}>
        <View style={tw`flex flex-col pb-4`}>
          <Text style={[tw`text-green-600 text-3xl font-bold`]}>Report</Text>
          <Text style={[tw`text-gray-500 text-base`]}>Report data sampah per-Sektoral.</Text>
          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={tw`flex-1 flex-row items-center gap-2 pt-6`}>
              <TouchableOpacity
                onPress={() => handleSnapPress(0, 'sektor')} 
                style={tw`rounded-xl border ${selectSector !== 'Semua Sektor' ? 'border-green-600 bg-green-50':'border-gray-300'}`}
              >
                <View style={tw`flex flex-row items-center px-2 py-2 gap-3`}>
                  <Text style={tw`text-lg text-gray-500 leading-5`}>{selectSector}</Text>
                  <Outline.ChevronDownIcon style={tw`text-gray-500`} size={18} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSnapPress(0, 'persen')} 
                style={tw`rounded-xl border ${selectPersen !== 'Default' ? 'border-green-600 bg-green-50':'border-gray-300'}`}
              >
                <View style={tw`flex flex-row items-center px-2 py-2 gap-3`}>
                  <Text style={tw`text-lg text-gray-500 leading-5`}>{selectPersen}</Text>
                  <Outline.ChevronDownIcon style={tw`text-gray-500`} size={18} />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 250}}
        >
          <View style={tw`bg-white h-full pt-6 gap-4`}>
            {
              loadSkeleton ? (
                <View style={tw`bg-white w-full px-4 py-4 rounded-3xl shadow-xl shadow-blue-600/30 gap-4 py-6`}>
                  <View style={tw`flex flex-row justify-between gap-6`}>
                    <Skeleton width={'flex-1'} height={'h-10'} />
                    <Skeleton width={'flex-1'} height={'h-10'} />
                  </View>
                  <View style={tw`flex flex-row justify-between gap-4`}>
                    <Skeleton width={'flex-1'} height={'h-4'} />
                    <Skeleton width={'flex-1'} height={'h-4'} />
                  </View>
                  <View style={tw`flex flex-row justify-between gap-4`}>
                    <Skeleton width={'flex-1'} height={'h-4'} />
                    <Skeleton width={'flex-1'} height={'h-4'} />
                  </View>
                  <View style={tw`flex flex-row justify-between gap-4`}>
                    <Skeleton width={'flex-1'} height={'h-4'} />
                    <Skeleton width={'flex-1'} height={'h-4'} />
                  </View>
                </View>
              ) : groupOlah.length > 0 ? (
                groupOlah
                .filter((olah: any) => {
                  // Check if selectSector is 'Semua Sektor'
                  if (selectSector === 'Semua Sektor') {
                    return true; // Return true to include this item
                  } else {
                    // Check if the item's sector matches selectSector
                    const jenisMatch = olah.sektor === selectSector;
                    return jenisMatch;
                  }
                })
                .sort((a: any, b: any) => {
                  // Calculate 'cek' for both 'a' and 'b'
                  const filterTotalA = groupTotal.filter((total: any) => total.sektor === a.sektor);
                  const totalSampahA = filterTotalA.length > 0
                    ? filterTotalA[0].data.reduce((total: any, item: any) => total + item.total, 0)
                    : 0;
                  const totalOlahanA = a.data.reduce((total: number, item: any) => {
                    if (item.klasifikasi !== "Kirim ke TPS") {
                      return total + parseFloat(item.total);
                    }
                    return total;
                  }, 0);
                  const cekA = parseFloat(((totalOlahanA / totalSampahA) * 100).toFixed(2));
                
                  const filterTotalB = groupTotal.filter((total: any) => total.sektor === b.sektor);
                  const totalSampahB = filterTotalB.length > 0
                    ? filterTotalB[0].data.reduce((total: any, item: any) => total + item.total, 0)
                    : 0;
                  const totalOlahanB = b.data.reduce((total: number, item: any) => {
                    if (item.klasifikasi !== "Kirim ke TPS") {
                      return total + parseFloat(item.total);
                    }
                    return total;
                  }, 0);
                  const cekB = parseFloat(((totalOlahanB / totalSampahB) * 100).toFixed(2));
                
                  if (selectPersen === 'Default') {
                    return true
                  } else if (selectPersen === 'Persentase Terendah ke Tertinggi') {
                    return cekA - cekB;
                  } else {
                    return cekB - cekA
                  }
                })
                .map((olah: any, parent: any) => {
                  
                  const filterTotal = groupTotal.filter((total: any) => total.sektor === olah.sektor);
                  const filterTransfer = transferSampah.filter((total: any) => total.sektor === olah.sektor);

                  const totalSampah = filterTotal.length > 0
                    ? filterTotal[0].data.reduce((total: string, item: any) => ((parseFloat(total) + parseFloat(item.total)).toFixed(2)).toString(), 0)
                    : 0;

                  const totalTransfer = filterTransfer.length > 0
                    ? transferSampah[0].data.reduce((total: string, item: any) => ((parseFloat(total) + parseFloat(item.total)).toFixed(2)).toString(), 0)
                    : 0;

                  const fixedTotal = totalSampah - totalTransfer

                  const totalOlahan = olah.data.reduce((total: string, item: any) => {
                    if (item.klasifikasi != "Kirim ke TPS") {
                      return ((parseFloat(total) + parseFloat(item.total)).toFixed(2)).toString();
                    }
                    return total;
                  }, 0);

                  const cek = parseFloat(((totalOlahan / fixedTotal) * 100).toFixed(2));

                  return(
                    <View key={olah.sektor+parent} style={tw`bg-white w-full px-4 py-4 rounded-3xl shadow-xl shadow-blue-600/30`}>
                      <View style={tw`${cek > 79 ? 'bg-green-600' : cek < 80 && cek > 50 ? 'bg-amber-500' : 'bg-red-600'} rounded-3xl`}>
                        <View style={tw`flex flex-row items-center justify-between px-4 py-4 pt-4`}>
                          <View style={tw`flex flex-row gap-2 leading-5`}>
                            {cek > 79 ? (<Solid.HandThumbUpIcon size={32} style={tw`text-white`} />) : cek < 80 && cek > 50 ? (<Solid.BellAlertIcon size={32} style={tw`text-white`} />) : (<Solid.ExclamationTriangleIcon size={32} style={tw`text-white`} />)}
                            <Text style={tw`text-xl font-bold text-white`}>
                              {cek > 79 ? 'Sae Pisan!' : cek < 80 && cek > 50 ? 'Lumayan!' : 'Kedah di Kawal!'}
                            </Text>
                          </View>
                          <TouchableOpacity onPress={() => navigation.navigate('DetailSector', { sektor: olah.sektor })} style={tw`px-4 py-1.5 leading-5 bg-white rounded-xl`}>
                            <Text style={tw`text-zinc-900`}>Lihat detail</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={tw`bg-white ${cek > 79 ? 'border-4 border-green-600' : cek < 80 && cek > 50 ? 'border-4 border-amber-500' : 'border-4 border-red-600'} p-4 flex-1 flex-row justify-between items-center rounded-2xl shadow-xl shadow-black/30`}>
                          <View style={tw`flex-1 flex-col`}>
                            <Text style={tw`text-sm text-zinc-900`}>Sektor</Text>
                            <Text style={tw`font-bold text-2xl ${cek > 79 ? 'text-green-600' : cek < 80 && cek > 50 ? 'text-amber-500' : 'text-red-600' }`}>{olah.sektor}</Text>                          
                          </View>
                          <View style={tw`w-0.4 rounded-full h-full bg-gray-200 mx-4`} />
                          <View style={tw`flex-1 flex-col items-center gap-4`}>
                            <CircularProgressBar percentage={cek} color={cek > 79 ? '#16a34a' : cek < 80 && cek > 50 ? '#f59e0b' : '#dc2626'} />
                            <Text style={tw`text-xs font-medium ${cek > 79 ? 'text-zinc-900' : cek < 80 && cek > 50 ? 'text-zinc-900' : 'text-zinc-900'}`}>Persentase Olahan Sampah</Text>
                          </View>
                        </View>
                      </View>
                      <View style={tw`px-4 py-4 gap-6`}>
                        <View style={tw`flex-1 flex-col justify-between`}>
                          <View style={tw`flex-1 flex-col justify-between gap-2`}>
                            <View style={tw`flex flex-row justify-between`}>
                              <Text style={tw`text-zinc-900 font-bold`}>Total Sampah</Text>
                              <Text style={tw`text-zinc-900 text-sm`}>
                                <Text style={tw`font-bold text-base`}>{fixedTotal}</Text> {`(Kg)`}
                              </Text>
                            </View>
                            <StatusBarPercentage color={cek > 79 ? 'bg-green-600' : cek < 80 && cek > 50 ? 'bg-amber-500' : 'bg-red-500' } percentage={(totalSampah / totalSampah) * 100} />
                          </View>
                        </View>
                        {
                          olah.data
                          .sort((a: any, b: any) => b.klasifikasi.localeCompare(a.klasifikasi))
                          .map((list: any, child: any) => (
                            <View key={child} style={tw`flex-1 flex-col justify-between`}>
                              <View style={tw`flex-1 flex-col justify-between gap-2`}>
                                <View style={tw`flex flex-row justify-between`}>
                                  <Text style={tw`text-zinc-900 font-bold`}>{list.klasifikasi == 'Kirim ke TPS' ? 'Sampah Di Kirim / Transfer' : 'Sampah Yang Diolah'}</Text>
                                  <Text style={tw`text-zinc-900 text-sm`}>
                                    <Text style={tw`font-bold text-base`}>{parseFloat(list.total).toFixed(2)}</Text> {`(Kg)`}
                                  </Text>
                                </View>
                                <StatusBarPercentage color={cek > 79 ? 'bg-green-600' : cek < 80 && cek > 50 ? 'bg-amber-500' : 'bg-red-500' } percentage={(list.total / totalSampah) * 100} />
                              </View>
                            </View>
                          ))
                        }
                      </View>
                    </View>
                  )
                })
              ) : (
                <View style={tw`bg-white w-full px-4 py-4 rounded-3xl shadow-xl shadow-blue-600/30`}>
                  <Text style={tw`w-full flex items-center py-8 text-gray-900 text-center py-4 px-2 rounded-xl border border-gray-200`}>
                    Belum ada data.
                  </Text>
                </View>
              )
            }
          </View>
        </ScrollView>
      </View>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <Text style={tw`font-bold text-xl px-4 pb-2 text-gray-800`}>{ selectFilter == "sektor" ? "Mau lihat sektor apa?" : "Urutkan berdasarkan persentase!" }</Text>
        <View style={tw`h-0.2 w-full bg-gray-300 rounded-full`} />
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: 200
          }}
        >
          {
            selectFilter == 'sektor' ? (filterSector.map(renderFilterItem)) : (filterPersen.map(renderFilterItem))
          }
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  )
}

export default ReportScreen