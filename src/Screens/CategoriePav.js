import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Modal, TextInput, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import tw from 'twrnc'; // Import TailwindCSS
import { Picker } from '@react-native-picker/picker'; // Importer Picker

const CategoriePavillon = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState(null);
  const [TypeCategorie, setTypeCategorie] = useState('');
  const [NumeroCategorie, setNumeroCategorie] = useState('');
  const [Loyer, setLoyer] = useState('');
  const [Localite, setLocalite] = useState(''); // Valeur initiale pour Localite
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://192.168.43.72:3000/categoriePavillon');
        setCategories(response.data.data);
        setFilteredCategories(response.data.data);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        Alert.alert('Erreur', 'Impossible de charger les catégories de pavillons');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAdd = () => {
    setSelectedCategorie(null);
    setTypeCategorie('');
    setNumeroCategorie('');
    setLoyer('');
    setLocalite(''); // Réinitialiser la valeur de Localite
    setModalVisible(true);
  };

  const handleEdit = (categorie) => {
    setSelectedCategorie(categorie);
    setTypeCategorie(categorie.TypeCategorie);
    setNumeroCategorie(categorie.NumeroCategorie);
    setLoyer(categorie.Loyer);
    setLocalite(categorie.Localite); // Mettre à jour avec la localité de la catégorie sélectionnée
    setModalVisible(true);
  };

  const saveChanges = async () => {
    if (!TypeCategorie || !Loyer || !Localite) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      if (selectedCategorie) {
        // Modifier la catégorie existante
        const response = await axios.put(`http://192.168.43.72:3000/categoriePavillon/${selectedCategorie.NumeroCategorie}`, {
          TypeCategorie,
          Loyer,
          Localite,
        });

        if (response.status === 200) {
          const updatedCategories = categories.map((r) =>
            r.NumeroCategorie === selectedCategorie.NumeroCategorie
              ? { ...r, TypeCategorie, Loyer, Localite }
              : r
          );
          setCategories(updatedCategories);
          Alert.alert('Succès', 'Catégorie modifiée avec succès.');
        } else {
          throw new Error('Erreur lors de la modification');
        }
      } else {
        // Ajouter une nouvelle catégorie
        const response = await axios.post('http://192.168.43.72:3000/addCategoriePavillon', {
          TypeCategorie,
          Loyer,
          Localite,
        });

        if (response.status === 200) {
          const newCategorie = { TypeCategorie, Loyer, Localite, NumeroCategorie: 'Nouveau' };
          setCategories([...categories, newCategorie]);
          Alert.alert('Succès', 'Catégorie ajoutée avec succès !');
        } else {
          throw new Error("Erreur lors de l'ajout");
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les modifications.');
    }
  };

  const handleDelete = async (NumeroCategorie) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cette catégorie ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              const response = await axios.delete(`http://192.168.43.72:3000/categoriePavillon/${NumeroCategorie}`);
              if (response.status === 200) {
                setCategories(categories.filter((categorie) => categorie.NumeroCategorie !== NumeroCategorie));
                Alert.alert('Succès', 'Catégorie supprimée avec succès.');
              } else {
                throw new Error('Erreur lors de la suppression');
              }
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la catégorie.');
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
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((categorie) =>
        (categorie.NumeroCategorie && categorie.NumeroCategorie.toLowerCase().includes(query.toLowerCase())) ||
        (categorie.TypeCategorie && categorie.TypeCategorie.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
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

      <TouchableOpacity onPress={handleAdd}>
        <FontAwesome5 name="plus" size={24} color="#009688" />
      </TouchableOpacity>

      <FlatList
        data={searchQuery ? filteredCategories : categories}
        keyExtractor={(item) => item.NumeroCategorie ? item.NumeroCategorie.toString() : Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View style={tw`bg-gray-100 p-3 mb-4 rounded-lg`}>
              <Text style={tw`text-lg font-bold`}>{item.NumeroCategorie ? item.NumeroCategorie : 'N/A'}</Text>
              <Text>Type: {item.TypeCategorie ? item.TypeCategorie : 'N/A'}</Text>
              <Text>Localité: {item.Localite ? item.Localite : 'N/A'}</Text>
              <Text>Loyer: {item.Loyer ? item.Loyer : 'N/A'}</Text>

              <View style={tw`flex-row justify-end mt-2`}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <MaterialIcons name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.NumeroCategorie)} style={tw`ml-4`}>
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
              {selectedCategorie ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
            </Text>

            <TextInput
              style={tw`h-12 border border-gray-300 rounded-lg px-3 mb-4`}
              placeholder="Type de catégorie"
              value={TypeCategorie}
              onChangeText={setTypeCategorie}
            />
            <TextInput
              style={tw`h-12 border border-gray-300 rounded-lg px-3 mb-4`}
              placeholder="Loyer"
              value={Loyer}
              onChangeText={setLoyer}
              keyboardType="numeric"
            />

            {/* Dropdown pour Localité */}
            <Picker
              selectedValue={Localite}
              onValueChange={(itemValue) => setLocalite(itemValue)}
              style={tw`h-12 border border-gray-300 rounded-lg mb-4`}
            >
              <Picker.Item label="Sélectionnez une localité" value="" />
              <Picker.Item label="Anjoma" value="Anjoma" />
              <Picker.Item label="Tambohobe" value="Tambohobe" />
            </Picker>

            <TouchableOpacity onPress={saveChanges} style={tw`bg-green-500 h-12 justify-center items-center rounded-lg`}>
              <Text style={tw`text-white font-bold`}>Enregistrer</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={tw`mt-4`}>
              <Text style={tw`text-red-500 font-bold`}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoriePavillon;
