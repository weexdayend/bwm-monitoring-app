import React, { 
  useCallback, 
  useEffect, 
  useMemo, 
  useRef, 
  useState 
} from 'react'

import { 
  View, 
  Text, 
  Pressable, 
  VirtualizedList, 
  Platform, 
  RefreshControl, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator
} from 'react-native'

import BottomSheet, { 
  BottomSheetScrollView, 
  BottomSheetBackdrop 
} from "@gorhom/bottom-sheet";

import tw from 'twrnc'
import moment from 'moment-timezone';
import 'moment/locale/id';

import CircularProgressBar from '../components/ProgressCircular';
import Skeleton from '../components/Skeleton';
import DatePicker from 'react-native-date-picker'

import * as Outline from 'react-native-heroicons/outline'
import * as Solid from 'react-native-heroicons/solid'

import { useNavigation } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { TextInput } from 'react-native';

type RootStackParamList = {
  DetailSector: { sektor: string };
};

type DetailSectorScreenRouteProp = RouteProp<RootStackParamList, 'DetailSector'>;

const DetailSectorScreen = () => {
  const navigation = useNavigation()

  const route = useRoute<DetailSectorScreenRouteProp>();
  const sektor = route.params?.sektor;

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const sheetRef = useRef<BottomSheet>(null);

  const filterDate = ['Semua Data', 'Filter berdasarkan tanggal']

  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const snapPoints = useMemo(() => ["55%"], []);

  const [selectFilterDate, setSelectFilterDate] = useState<any>('Semua Data')
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

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

  const fetchData = async () => {
    if (isLoading || !hasMoreData || isLoadingMore) {
      return;
    }
  
    setIsLoading(true);
  
    try {
      const check = await supabase
        .from("tbl_sektor")
        .select(`nama_sektor, tbl_subsektor(id, tbl_penanggung_jawab(nama))`)
        .eq("nama_sektor", sektor)
        .single();
  
      const checkEvent = check.data;
      const subsektors = checkEvent?.tbl_subsektor || [];
  
      const fetchPromises = subsektors.map(async (subsektor) => {
        const subsektorId = subsektor.id;
        const dinas = subsektor.tbl_penanggung_jawab?.nama;
  
        const get = await supabase
          .from("tbl_tps")
          .select(`*, tbl_kelola(*), tbl_olah(*)`)
          .eq("subsektor_id", `${subsektorId}`)
  
        const response = get.data;
  
        if (response) {
          // Filter out items with tbl_kelola count equal to 0
          const dataWithPenanggungJawabNama = response
            .filter((item: any) => item.tbl_kelola.length > 0)
            .map((item: any) => {
              const penanggungJawabNama = dinas;
              return {
                ...item,
                penanggungJawabNama,
              };
            });
      
          return dataWithPenanggungJawabNama;
        }
  
        return [];
      });
  
      // Use Promise.all to fetch data concurrently
      const fetchedData = await Promise.all(fetchPromises);
      const concatenatedData = fetchedData.flat(); // Flatten the array of arrays

      setData(concatenatedData);
    } catch (error) {
      // Handle any errors here
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleEndReached = () => {
    if (!isLoadingMore && hasMoreData) {
      setIsLoadingMore(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderFilterItem = useCallback(
    (item: any) => (
      <Pressable
        key={item}
        onPress={() => handleFilterSelected(item)}
        style={tw`w-full flex flex-row items-center justify-between py-2 my-2 px-4 border-b border-gray-200 rounded-lg`}
      >
        <Text style={tw`text-lg text-gray-800`}>{item}</Text>
        {selectFilterDate === item && (
          <Solid.CheckCircleIcon size={26} style={tw`text-green-600`} />
        )}
      </Pressable>
    ),
    [selectFilterDate, handleFilterSelected]
  );

  const [filteredData, setFilteredData] = useState<any>(data);
  const [searchQuery, setSearchQuery] = useState<string>('')

  const applyFilters = () => {
    // Filter the data based on the search query
    const filtered = data.filter((item: any) => {
      // Check if the search query is empty or if the 'nama' includes the search query
      return searchQuery.trim() === '' || item.nama_tps.toLowerCase().includes(searchQuery.toLowerCase());
    });
  
    // Update the filtered data state
    setFilteredData(filtered);
  };
  
  useEffect(() => {
    applyFilters();
  }, [searchQuery, data]);

  const currentDate = new Date(date).toISOString().split("T")[0];

  const renderItem = ({ item }: any) => {
    const totalKelolaVolume = item.tbl_kelola
    .filter((olah: any) => olah.status === 'Approved')
    .filter((item: any) => {
      if (selectFilterDate !== 'Semua Data') {
        const itemDate = item.created_at.split('T')[0]; // Extract the date part
        const currentDate = date.toISOString().split('T')[0]; // Convert date to the same format
        return itemDate === currentDate; // Compare without milliseconds
      } else {
        return true;
      }
    })
    .reduce((total: any, kelolaItem: any) => {
      return total + kelolaItem.volume;
    }, 0);

    const totalTransferVolume = item.tbl_kelola
    .filter((olah: any) => olah.status === 'Transfered')
    .filter((item: any) => {
      if (selectFilterDate !== 'Semua Data') {
        const itemDate = item.created_at.split('T')[0]; // Extract the date part
        const currentDate = date.toISOString().split('T')[0]; // Convert date to the same format
        return itemDate === currentDate; // Compare without milliseconds
      } else {
        return true;
      }
    })
    .reduce((total: any, kelolaItem: any) => {
      return total + kelolaItem.volume;
    }, 0);

    const fixedTotal = totalKelolaVolume - totalTransferVolume

    const totalOlah = item.tbl_olah
    .filter((item: any) => {
      if (selectFilterDate !== 'Semua Data') {
        const itemDate = item.created_at.split('T')[0]; // Extract the date part
        const currentDate = date.toISOString().split('T')[0]; // Convert date to the same format
        return itemDate === currentDate; // Compare without milliseconds
      } else {
        return true;
      }
    })
    .reduce((total: any, olahItem: any) => {
      if (olahItem.klasifikasi != "Kirim ke TPS") {
        return total + parseFloat(olahItem.total);
      }
      return total;
    }, 0);

    const totalBuang = item.tbl_olah
    .filter((item: any) => {
      if (selectFilterDate !== 'Semua Data') {
        const itemDate = item.created_at.split('T')[0]; // Extract the date part
        const currentDate = date.toISOString().split('T')[0]; // Convert date to the same format
        return itemDate === currentDate; // Compare without milliseconds
      } else {
        return true;
      }
    })
    .reduce((total: any, olahItem: any) => {
      if (olahItem.klasifikasi == "Kirim ke TPS") {
        return total + parseFloat(olahItem.total);
      }
      return total;
    }, 0);

    let cek = parseFloat(((totalOlah / totalKelolaVolume) * 100).toFixed(1));
    if (isNaN(cek)) {
      cek = 0;
    }

    return(
      <View style={tw`border ${cek > 79 ? 'border-[#16a34a]' : cek < 80 && cek > 50 ? 'border-[#f59e0b]' : 'border-[#dc2626]'} rounded-xl mb-4`}>
        <View style={tw`p-4 flex flex-col items-center justify-between gap-4`}>
          <View style={tw`flex flex-col gap-4`}>
            <View style={tw`flex flex-col items-center`}>
              <Text style={tw`text-base text-zinc-500 font-bold uppercase`}>{item.penanggungJawabNama}</Text>
              <Text style={tw`text-lg text-gray-950 font-bold uppercase`}>{item.nama_tps}</Text>
              <Text style={tw`text-sm text-gray-500`}>{item.alamat}</Text>
            </View>
          </View>
          <View style={tw`flex flex-row justify-between`}>
            <View style={tw`flex flex-col items-center gap-4`}>
              <CircularProgressBar percentage={cek} color={cek > 79 ? '#16a34a' : cek < 80 && cek > 50 ? '#f59e0b' : '#dc2626'} />
              <Text style={tw`text-xs font-medium text-zinc-900`}>Persentase Olahan Sampah</Text>
              <View style={tw`px-2 py-1.5 rounded-lg ${cek > 79 ? 'bg-[#16a34a]' : cek < 80 && cek > 50 ? 'bg-[#f59e0b]' : 'bg-[#dc2626]'}`}>
                <Text style={tw`text-white font-bold text-sm`}>
                  {cek > 79 ? 'Sae Pisan!' : cek < 80 && cek > 50 ? 'Lumayan!' : 'Kedah di Kawal!'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={tw`w-full flex flex-row justify-center items-center bg-gray-50 rounded-b-xl py-3`}>
          <View style={tw`px-2 flex flex-col items-center justify-between`}>
            <Text style={tw`text-gray-800 text-xs`}>Total Sampah</Text>
            <Text style={tw`text-sm text-gray-800`}><Text style={tw`text-base font-bold`}>{(fixedTotal).toFixed(1)}</Text> {`(Kg)`}</Text>
          </View>
          <View style={tw`px-2 flex flex-col items-center justify-between`}>
            <Text style={tw`text-gray-800 text-xs`}>Sisa Sampah</Text>
            <Text style={tw`text-sm text-gray-800`}><Text style={tw`text-base font-bold`}>{(fixedTotal-totalOlah) > 0 ? ((fixedTotal-totalOlah).toFixed(1)) : 0}</Text> {`(Kg)`}</Text>
          </View>
          <View style={tw`px-2 flex flex-col items-center justify-between`}>
            <Text style={tw`text-gray-800 text-xs`}>Yang Diolah</Text>
            <Text style={tw`text-sm text-gray-800`}><Text style={tw`text-base font-bold`}>{(totalOlah).toFixed(1)}</Text> {`(Kg)`}</Text>
          </View>
          <View style={tw`px-2 flex flex-col items-center justify-between`}>
            <Text style={tw`text-gray-800 text-xs`}>Yang Transfer</Text>
            <Text style={tw`text-sm text-gray-800`}><Text style={tw`text-base font-bold`}>{(totalBuang).toFixed(1)}</Text> {`(Kg)`}</Text>
          </View>
        </View>
      </View>
    )
  };

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text); // Update the search query state
    applyFilters(); // Apply the filter with the new search query
  };

  const renderFooter = () => (
    <View style={tw`flex items-center justify-center border border-gray-200 py-24 rounded-3xl`}>
      {
        isLoadingMore === true ? (<Text style={tw`font-bold text-gray-500 text-base`}>List data sudah mentok sampai bawah.</Text>) : (<ActivityIndicator />)
      }
    </View>
  )

  const renderEmpty = () => (
    <View style={tw`flex items-center justify-center border border-gray-200 py-24 rounded-3xl`}>
      <Text style={tw`font-bold text-gray-500 text-base`}>Belum ada data.</Text>
    </View>
  )

  return (
    <View style={tw`flex-1 bg-white w-full h-full ${ Platform.OS === "android" ? 'pt-16' : 'pt-16' }`}>
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
      <View style={tw`px-4`}>
        <View style={tw`flex flex-col`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-transparent flex flex-row gap-2`}>
            <Solid.ArrowLeftIcon size={28} style={tw`text-green-600 mt-1`} />
            <View style={tw`flex flex-col pb-4`}>
              <Text style={[tw`text-green-600 text-3xl font-bold`]}>Sektor {sektor}</Text>
              <Text style={[tw`text-gray-500 text-base`]}>Report data sampah sub-Sektoral.</Text>
            </View>
          </TouchableOpacity>
          <TextInput
            placeholder="Cari Kawasan Bebas Sampah..."
            placeholderTextColor={'#64748b'}
            value={searchQuery}
            onChangeText={handleSearchInputChange}
            style={tw`w-full bg-gray-50 rounded-lg  px-4 text-gray-900`}
            autoCapitalize='none'
          />
          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={tw`flex-1 flex-row items-center gap-2 pt-2 pb-4`}>
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
        </View>
        {
          isLoading ? (
            <View style={tw`border border-gray-200 rounded-xl mb-4`}>
              <View style={tw`p-4 flex flex-row items-center justify-between`}>
                <View style={tw`flex-1 flex-row items-center gap-4`}>
                  <Skeleton width={'flex-1'} height={'h-6'} />
                  <Skeleton width={'flex-1'} height={'h-6'} />
                  <View style={tw`flex flex-col`}>
                    <Skeleton width={'flex-1'} height={'h-6'} />
                    <Skeleton width={'flex-1'} height={'h-6'} />
                  </View>
                </View>
                <Skeleton width={'flex-1'} height={'h-6'} />
              </View>
              <View style={tw`h-0.2 bg-gray-200 rounded-full my-2`} />
              <View style={tw`px-4 pb-4 flex flex-row items-center justify-between gap-4 mt-2`}>
                <Skeleton width={'flex-1'} height={'h-6'} />
              </View>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item: any, index: any) => item.id.toString()+index+1}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={renderEmpty}
              contentContainerStyle={{paddingBottom: 240}}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.1}
              showsVerticalScrollIndicator={false}
            />
          )
        }
      </View>
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
    </View>
  )
}

export default DetailSectorScreen