import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc'; // Assurez-vous d'importer Tailwind CSS

export default function MenuScreen() {
  const navigation = useNavigation();

  return (
    <View style={tw`flex-1 bg-[#F7F8F3]`}>
      

      <View style={tw`flex-1 flex-row flex-wrap justify-around items-center mt-4`}>
        <TouchableOpacity 
          style={tw`w-40 h-32 bg-[#AADF87] rounded-lg shadow-md justify-center items-center mb-4`} 
          onPress={() => navigation.navigate('ListeMarchand')}
        >
          <FontAwesome5 name="shopping-cart" size={24} color="#B7C9E0" />
          <Text style={tw`mt-2 text-center text-white text-lg`}>Marchand</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={tw`w-40 h-32 bg-[#5E4B8E] rounded-lg shadow-md justify-center items-center mb-4`} 
          onPress={() => navigation.navigate('ListeReg')}
        >
          <FontAwesome5 name="money-bill-alt" size={24} color="#B7C9E0" />
          <Text style={tw`mt-2 text-center text-white text-lg`}>Régisseur</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={tw`w-40 h-32 bg-[#5E4B8E] rounded-lg shadow-md justify-center items-center mb-4`} 
          onPress={() => navigation.navigate('Pavillon')}
        >
          <FontAwesome5 name="calendar-alt" size={24} color="#B7C9E0" />
          <Text style={tw`mt-2 text-center text-white text-lg`}>Planification</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={tw`w-40 h-32 bg-[#5E4B8E] rounded-lg shadow-md justify-center items-center mb-4`} 
          onPress={() => navigation.navigate('CategoriePavillon')}
        >
          <FontAwesome5 name="calendar-alt" size={24} color="#B7C9E0" />
          <Text style={tw`mt-2 text-center text-white text-lg`}>Catégorie</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={tw`w-40 h-32 bg-[#5E4B8E] rounded-lg shadow-md justify-center items-center mb-4`} 
          onPress={() => navigation.navigate('Placeliste')}
        >
          <FontAwesome5 name="calendar-alt" size={24} color="#B7C9E0" />
          <Text style={tw`mt-2 text-center text-white text-lg`}>Place</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
