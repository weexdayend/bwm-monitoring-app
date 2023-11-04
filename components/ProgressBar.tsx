import React from 'react';
import { View, StyleSheet } from 'react-native';

import tw from 'twrnc'

type Props = {
  percentage: any
  color: any
}

const StatusBarPercentage = ({ percentage, color }: Props) => {
  return (
    <View style={tw`flex flex-row items-center bg-gray-100 h-2 rounded-full`}>
      <View style={[tw`rounded-full h-full ${color}`, { width: `${percentage}%` }]}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    height: 30,
  },
  bar: {
    backgroundColor: 'green', // Color of the progress bar
    height: '100%',
  },
  text: {
    marginLeft: 5,
    fontSize: 16,
    color: 'black', // Color of the percentage text
  },
});

export default StatusBarPercentage;
