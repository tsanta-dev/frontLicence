import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Modal, TextInput, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import tw from 'twrnc'; // Import TailwindCSS
import { Picker } from '@react-native-picker/picker';


const Pavillon = () => {
  const [pavillons, setPavillons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPavi, setSelectedPavi] = useState(null);
  const [Type, setType] = useState('');
  const [Numero, setNumero] = useState('');
  const [Localite, setLocalite] = useState('');
  const [Disponibilite, setDisponibilite] = useState('Libre');
  const [Categorie, setCategorie] = useState('Neant');
  const [Loyer, setLoyer] = useState('Neant');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPavillon, setFilteredPavillon] = useState([]);
  const navigation = useNavigation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const data = [
    { label: 'Sélectionner une localité', value: '' },
    { label: 'Anjoma', value: 'Anjoma' },
    { label: 'Talata', value: 'Talata' }
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const onSelect = (value) => {
    setLocalite(value);
    setIsDropdownOpen(false);
  };

  
  useEffect(() => {
    const fetchPavillon = async () => {
      try {
        const response = await axios.get('http://192.168.43.72:3000/pavillons');
        setPavillons(response.data.data);
      } catch (error) {
        console.error('Erreur lors du chargement des pavillons:', error);
        Alert.alert('Erreur', 'Impossible de charger les pavillons');
      } finally {
        setLoading(false);
      }
    };

    fetchPavillon();
  }, []);

  const handleAdd = () => {
    setSelectedPavi(null);
    setType('');
    setNumero('');
    setLocalite('');
    setDisponibilite('Libre');
    setCategorie('Neant');
    setLoyer('Neant');
    setModalVisible(true);
  };

  const handleEdit = (pavillon) => {
    setSelectedPavi(pavillon);
    setType(pavillon.Type);
    setNumero(pavillon.Numero);
    setLocalite(pavillon.Localite);
    setDisponibilite(pavillon.Disponibilite);
    setCategorie(pavillon.Categorie);
    setLoyer(pavillon.Loyer);
    setModalVisible(true);
  };

  const saveChanges = async () => {
    if (!Type || !Numero || !Localite || !Disponibilite || !Loyer) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      if (selectedPavi) {
        const response = await axios.put(`http://192.168.43.72:3000/pavillons/${selectedPavi.Numero}`, {
          Type,
          Localite,
          Disponibilite,
          Categorie,
          Loyer,
        });

        if (response.status === 200) {
          const updatedPavillon = pavillons.map((r) =>
            r.Numero === selectedPavi.Numero ? { ...r, Type, Localite, Disponibilite, Categorie, Loyer } : r
          );
          setPavillons(updatedPavillon);
          Alert.alert('Succès', 'Pavillon modifié avec succès.');
        } else {
          throw new Error('Erreur lors de la modification');
        }
      } else {
        const response = await axios.post('http://192.168.43.72:3000/addPavi', {
          Type,
          Numero,
          Localite,
          Disponibilite,
          Categorie,
          Loyer,
        });

        if (response.status === 200) {
          setPavillons([...pavillons, { Type, Numero, Localite, Disponibilite, Categorie, Loyer }]);
          Alert.alert('Succès', 'Pavillon ajouté avec succès !');
        } else {
          throw new Error('Erreur lors de l\'ajout');
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les modifications.');
    }
  };

  const handleDelete = async (Numero) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer ce pavillon ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              const response = await axios.delete(`http://192.168.43.72:3000/pavillons/${Numero}`);
              if (response.status === 200) {
                setPavillons(pavillons.filter((pavillon) => pavillon.Numero !== Numero));
                Alert.alert('Succès', 'Pavillon supprimé avec succès.');
              } else {
                throw new Error('Erreur lors de la suppression');
              }
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le pavillon.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query === '') {
      setFilteredPavillon(pavillons);
    } else {
      const filtered = pavillons.filter((pavillon) =>
        pavillon.Numero.toLowerCase().includes(query.toLowerCase()) ||
        pavillon.Type.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPavillon(filtered);
    }
  };

  const handlePress = (item) => {
    navigation.navigate('DetailPavillon', { pavillon: item });
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
        placeholder="Rechercher par type ou numéro"
        value={searchQuery}
        onChangeText={handleSearch}
      />

<TouchableOpacity
  // style={tw`absolute right-5 bottom-5 bg-teal-500 rounded-full w-16 h-16 justify-center items-center`}
  onPress={handleAdd}
>
  <FontAwesome5 name="plus" size={24} color="#fff" />
</TouchableOpacity>

      <FlatList
        data={searchQuery ? filteredPavillon : pavillons}
        keyExtractor={(item) => item.Numero.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View style={tw`bg-gray-100 p-3 mb-4 rounded-lg`}>
              <Text style={tw`text-lg font-bold`}>{item.Numero}</Text>
              <Text>Type: {item.Type}</Text>
              <Text>Localité: {item.Localite}</Text>
              <Text>Disponibilité: {item.Disponibilite}</Text>
              <Text>Categorie: {item.Categorie}</Text>
              <Text>Loyer: {item.Loyer}</Text>

              <View style={tw`flex-row justify-end mt-2`}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <MaterialIcons name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.Numero)} style={tw`ml-4`}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`w-11/12 p-6 bg-white rounded-lg`}>
            <Text style={tw`text-xl font-bold mb-5`}>
              {selectedPavi ? 'Modifier le pavillon' : 'Ajouter un pavillon'}
            </Text>

            <TextInput
              style={tw`h-12 border border-gray-300 rounded-lg px-3 mb-4`}
              placeholder="Type"
              value={Type}
              onChangeText={setType}
            />
            <TextInput
              style={tw`h-12 border border-gray-300 rounded-lg px-3 mb-4`}
              placeholder="Numéro"
              value={Numero}
              onChangeText={setNumero}
              editable={!selectedPavi}
            />
          

          <View style={tw`border border-gray-300 rounded-lg mb-4`}>
  <TouchableOpacity
    style={tw`flex-row justify-between items-center bg-teal-600 h-12 px-3 rounded-lg`}
    onPress={toggleDropdown}
  >
    <Text style={tw`text-white text-base`}>
      {Localite || 'Sélectionner une localité'}
    </Text>
    <Text style={tw`text-white text-base`}>
      {isDropdownOpen ? '▲' : '▼'}
    </Text>
  </TouchableOpacity>

  {isDropdownOpen && (
    <View style={tw`absolute top-14 left-0 right-0 bg-teal-600 rounded-lg p-2 z-10`}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`py-2 px-2`}
            onPress={() => onSelect(item.value)}
          >
            <Text style={tw`text-white text-base`}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )}
</View>
          
          
        
  

            {/* <TextInput
              style={tw`h-12 border border-gray-300 rounded-lg px-3 mb-4`}
              placeholder="Loyer"
              value={Loyer}
              onChangeText={setLoyer}
              keyboardType="numeric"
            /> */}

            <TouchableOpacity
              style={tw`bg-teal-500 p-3 rounded-lg`}
              onPress={saveChanges}
            >
              <Text style={tw`text-center text-white text-lg`}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Pavillon;
