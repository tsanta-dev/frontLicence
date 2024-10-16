import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

const Placeliste = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://192.168.43.72:3000/places'); // Remplacez par l'URL de votre API
        setPlaces(response.data.data);
        setFilteredPlaces(response.data.data); // Initialiser la liste filtrée avec toutes les places
      } catch (error) {
        console.error('Erreur lors du chargement des places:', error);
        Alert.alert('Erreur', 'Impossible de charger les places');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query === '') {
      setFilteredPlaces(places);
    } else {
      const filtered = places.filter((place) =>
        place.NumeroPlace.toLowerCase().includes(query.toLowerCase()) ||
        place.Localite.toLowerCase().includes(query.toLowerCase()) ||
        (place.nom && place.nom.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredPlaces(filtered);
    }
  };

  const handlePress = (item) => {
    navigation.navigate('DetailPlace', { place: item });
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 p-5`}>
      <TextInput
        style={tw`h-12 border border-gray-300 rounded-lg px-3 mb-5 bg-white`}
        placeholder="Rechercher par numéro, localité ou nom du marchand"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item.NumeroPlace.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={tw`bg-gray-100 p-3 mb-4 rounded-lg`}>
              <Text style={tw`text-lg font-bold`}>{item.NumeroPlace}</Text>
              <Text>Localité: {item.Localite}</Text>
              <Text>Catégorie: {item.Categorie}</Text>
              <Text>Ticket: {item.Ticket}</Text>
              {item.nom && (
                <>
                  <Text>Marchand: {item.nom}</Text>
                  <Text>Numero Marchand: {item.NumeroMarchand}</Text>
                </>
              )}

              <View style={tw`flex-row justify-end mt-2`}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <MaterialIcons name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.NumeroPlace)} style={tw`ml-4`}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Placeliste;
