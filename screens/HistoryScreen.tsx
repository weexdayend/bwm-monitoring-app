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
  TouchableOpacity 
} from 'react-native'

import BottomSheet, { 
  BottomSheetScrollView, 
  BottomSheetBackdrop 
} from "@gorhom/bottom-sheet";

import tw from 'twrnc'
import moment from 'moment-timezone';
import 'moment/locale/id';

import * as Outline from 'react-native-heroicons/outline'
import * as Solid from 'react-native-heroicons/solid'

type Props = {}

const HistoryScreen = (props: Props) => {

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const [selectFilter, setSelectFilter] = useState<string>('')

  const [selectJenis, setSelectJenis] = useState<string>('Semua Jenis')
  const [selectKlasifikasi, setSelectKlasifikasi] = useState<string>('Semua Klasifikasi')

  const fetchData = async () => {
    setIsLoading(true);
  
    const newData = Array.from({ length: 32 }, (_, index) => ({
      key: String(index),
      date: moment().subtract(index, 'days'),
      TotalSampah: Math.floor(Math.random() * 1000),
      JenisSampah: ['Organik', 'Anorganik', 'Residu'][index % 3],
      KlasifikasiPengolahan: ['Daur Ulang', 'Buang'][index % 2],
    }));

    setData(newData);
    setRefreshing(false);
    setIsLoading(false);
  };

  const [filteredData, setFilteredData] = useState<any>(data);

  const applyFilters = () => {
    const filtered = data.filter((item: any) => {
      // Check if the item matches selected filters
      const jenisMatch = !selectJenis || selectJenis === 'Semua Jenis' || item.JenisSampah === selectJenis;
      const klasifikasiMatch = !selectKlasifikasi || selectKlasifikasi === 'Semua Klasifikasi' || item.KlasifikasiPengolahan === selectKlasifikasi;
      return jenisMatch && klasifikasiMatch;
    });
    setFilteredData(filtered);
  };  

  useEffect(() => {
    applyFilters();
  }, [selectJenis, selectKlasifikasi, data]);

  const sheetRef = useRef<BottomSheet>(null);

  const filterJenis = ['Semua Jenis', 'Organik', 'Anorganik', 'Residu']
  const filterKlasifikasi = ['Semua Klasifikasi', 'Daur Ulang', 'Buang']

  const snapPoints = useMemo(() => ["55%"], []);

  const handleSnapPress = useCallback((index: any, filter: any) => {
    setSelectFilter(filter)
    sheetRef.current?.snapToIndex(index)
  }, []);

  const handleFilterSelected = (item: any) => {
    selectFilter == "jenis" ? setSelectJenis(item) : setSelectKlasifikasi(item) 
  }

  const handleFilterClear = () => {
    setSelectJenis('Semua Jenis')
    setSelectKlasifikasi('Semua Klasifikasi')
  }

  const renderFilterItem = useCallback(
    (item: any) => (
      <Pressable
        key={item}
        onPress={() => handleFilterSelected(item)}
        style={tw`w-full flex flex-row items-center justify-between py-2 my-2 px-4 border-b border-gray-200 rounded-lg`}
      >
        <Text style={tw`text-lg text-gray-800`}>{item}</Text>
        {selectJenis === item && (
          <Solid.CheckCircleIcon size={26} style={tw`text-green-600`} />
        )}
        {selectKlasifikasi === item && (
          <Solid.CheckCircleIcon size={26} style={tw`text-green-600`} />
        )}
      </Pressable>
    ),
    [selectJenis, selectKlasifikasi, handleFilterSelected]
  );

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

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }: any) => {
    const dateObject = moment(item.date)

    // Extract date and time components
    const formattedDate = dateObject.format('LL');
    const formattedTime = dateObject.format('LT');
    
    return(
      <View style={tw`border border-gray-200 rounded-xl mb-4`}>
        <View 
          style={tw`
            flex flex-row items-center px-4 py-3 gap-2 rounded-t-xl
            ${(item.JenisSampah === 'Organik') ? 'bg-green-600' : (item.JenisSampah === 'Anorganik') ? 'bg-amber-500' : 'bg-rose-500'}
          `}
        >
          <Text style={tw`text-lg text-white font-bold`}>{item.JenisSampah}</Text>
        </View>
        <View style={tw`p-4 flex flex-row items-center justify-between`}>
          <View style={tw`flex-1 flex-row items-center gap-4`}>
            <Outline.CalendarIcon size={28} style={tw`text-green-600`} />
            <View style={tw`flex flex-col`}>
              <Text style={tw`text-base text-gray-500`}>{formattedDate},</Text>
              <Text style={tw`text-base text-gray-500`}>{formattedTime}</Text>
            </View>
          </View>
          {
            item.KlasifikasiPengolahan === "Daur Ulang" && (
              <View style={tw`px-1.5 py-1 rounded-md bg-green-100`}>
                <Text style={tw`text-base text-green-800 font-bold`}>{item.KlasifikasiPengolahan}</Text>
              </View>
            )
          }
          {
            item.KlasifikasiPengolahan === "Buang" && (
              <View style={tw`px-1.5 py-1 rounded-md bg-amber-100`}>
                <Text style={tw`text-base text-red-500 font-bold`}>{item.KlasifikasiPengolahan}</Text>
              </View>
            )
          }
        </View>
        <View style={tw`h-0.2 bg-gray-200 rounded-full my-2`} />
        <View style={tw`px-4 pb-4 flex flex-row items-center justify-between`}>
          <Text style={tw`text-gray-800`}>Total Sampah</Text>
          <Text style={tw`font-bold text-xl text-gray-800`}>{item.TotalSampah} TON</Text>
        </View>
      </View>
    )
  };

  return (
    <View style={tw`flex-1 bg-white w-full h-full ${ Platform.OS === "android" ? 'pt-16' : 'pt-16' }`}>
      <View style={tw`px-4`}>
        <View style={tw`flex flex-col`}>
          <Text style={[tw`text-green-600 text-3xl font-bold`]}>Riwayat Laporan</Text>
          <Text style={[tw`text-gray-500 text-base`]}>Daftar laporan per 30 Hari.</Text>
        </View>
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={tw`flex-1 flex-row items-center gap-2 pt-6 pb-4`}>
            {
              (selectJenis !== 'Semua Jenis' || selectKlasifikasi !== 'Semua Klasifikasi') ? (
                <TouchableOpacity 
                  onPress={() => handleFilterClear()} 
                  style={tw`px-1 border border-gray-300 py-1 rounded-lg`}
                >
                  <Outline.XMarkIcon size={26} style={tw`text-green-600`} />
                </TouchableOpacity>
              ) : null
            }
            <TouchableOpacity
              onPress={() => handleSnapPress(0, 'jenis')} 
              style={tw`rounded-xl border ${selectJenis !== 'Semua Jenis' ? 'border-green-600 bg-green-50':'border-gray-300'}`}
            >
              <View style={tw`flex flex-row items-center px-2 py-2 gap-3`}>
                <Text style={tw`text-lg text-gray-500 leading-5`}>{selectJenis ? selectJenis : 'Semua Jenis'}</Text>
                <Outline.ChevronDownIcon style={tw`text-gray-500`} size={18} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSnapPress(0, 'klasifikasi')} 
              style={tw`rounded-xl border ${selectKlasifikasi !== 'Semua Klasifikasi' ? 'border-green-600 bg-green-50':'border-gray-300'}`}
            >
              <View style={tw`flex flex-row items-center px-2 py-2 gap-3`}>
                <Text style={tw`text-lg text-gray-500 leading-5`}>{selectKlasifikasi ? selectKlasifikasi : 'Semua Klasifikasi'}</Text>
                <Outline.ChevronDownIcon style={tw`text-gray-500`} size={18} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <VirtualizedList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.key}
          getItemCount={() => filteredData.length}
          getItem={(data, index) => data[index]}
          contentContainerStyle={{paddingBottom: 80}}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchData();
              }}
              title="Tarik untuk Refresh"
              titleColor="#555"
              tintColor="#555"
            />
          }
        />
      </View>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <Text style={tw`font-bold text-xl px-4 pb-2 text-gray-800`}>Mau lihat { selectFilter == "jenis" ? "Jenis Sampah" : "Klasifikasi Pengolahan" } apa?</Text>
        <View style={tw`h-0.2 w-full bg-gray-300 rounded-full`} />
        <BottomSheetScrollView contentContainerStyle={tw`flex-1 py-4`}>
          {
            selectFilter == 'jenis' ? (filterJenis.map(renderFilterItem)) : (filterKlasifikasi.map(renderFilterItem))
          }
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  )
}

export default HistoryScreen