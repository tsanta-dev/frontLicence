import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import MarchandForm from './MarchandForm';
import PlaceForm from './PlaceForm';
import tw from 'twrnc';

const ListeMarchand = () => {
  const [marchands, setMarchands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States pour gérer les deux modals indépendamment
  const [marchandModalVisible, setMarchandModalVisible] = useState(false);
  const [placeModalVisible, setPlaceModalVisible] = useState(false);

  const [selectedMarchand, setSelectedMarchand] = useState(null);
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const pavillonAnimation = useRef(new Animated.Value(0)).current;
  const marchandAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fonction pour récupérer les marchands depuis l'API
    const fetchMarchands = async () => {
      try {
        const response = await axios.get('http://192.168.43.72:3000/marchands');
        setMarchands(response.data.data);
        setLoading(false);
      }
       catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchMarchands();
  }, []);

  // Fonction pour afficher/masquer les boutons flottants
  const toggleMenu = () => {
    const toValue = isMenuOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  // Styles d'animation pour les boutons flottants
  const pavillonStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80], // Position du bouton Pavillon
        }),
      },
    ],
  };

  const marchandStyle = {
    transform: [
      { scale: animation },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80], // Position du bouton Marchand
        }),
      },
    ],
  };

  // Modifier un marchand sélectionné
  const handleEdit = (marchand) => {
    setSelectedMarchand(marchand);
    setNom(marchand.nom);
    setTelephone(marchand.telephone);
    setMarchandModalVisible(true); // Ouvre le modal MarchandForm pour modification
  };

  // Sauvegarder les changements après modification
  const saveChanges = async () => {
    try {
      await axios.put(`http://192.168.43.72:3000/marchands/${selectedMarchand.NumeroMarchand}`, {
        nom,
        telephone,
      });
      setMarchandModalVisible(false);
      // Actualiser la liste des marchands
      const updatedMarchands = marchands.map((m) =>
        m.NumeroMarchand === selectedMarchand.NumeroMarchand ? { ...m, nom, telephone } : m
      );
      setMarchands(updatedMarchands);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  // Supprimer un marchand
  const handleDelete = async (NumeroMarchand) => {
    try {
      await axios.delete(`http://192.168.43.72:3000/marchands/${NumeroMarchand}`);
      setMarchands(marchands.filter((marchand) => marchand.NumeroMarchand !== NumeroMarchand));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Fonction pour fermer les modals et réinitialiser les champs
  const onCloseModal = () => {
    setNom('');
    setTelephone('');
    setSelectedMarchand(null);
    setMarchandModalVisible(false);
    setPlaceModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={tw`flex-1 justify-center items-center`}>
      <FlatList
        data={marchands}
        keyExtractor={(item, index) => item.NumeroMarchand ? item.NumeroMarchand.toString() : index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.nom}</Text>
            <Text>CIN: {item.cin}</Text>
            <Text>Téléphone: {item.telephone}</Text>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.NumeroMarchand)}>
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

        {/* Boutons flottants */}
        <View style={tw`flex-1 justify-end items-center mb-10`}>
          {/* Bouton Pavillon */}
          <Animated.View style={[tw`absolute`, pavillonStyle]}>
            <TouchableOpacity
              style={tw`p-4 bg-blue-500 rounded-full`}
              onPress={() => setMarchandModalVisible(true)}
            >
              <FontAwesome5 name="building" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {/* Bouton Marchand */}
          <Animated.View style={[tw`absolute`, marchandStyle]}>
            <TouchableOpacity
              style={tw`p-4 bg-green-500 rounded-full`}
              onPress={() => setPlaceModalVisible(true)}
            >
              <FontAwesome5 name="store" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {/* Bouton principal flottant */}
          <TouchableOpacity
            style={tw`p-5 bg-red-500 rounded-full`}
            onPress={toggleMenu}
          >
            <MaterialIcons name={isMenuOpen ? 'close' : 'add'} size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Modal pour MarchandForm */}
        <MarchandForm
          visible={marchandModalVisible}
          onClose={onCloseModal}
          nom={nom}
          telephone={telephone}
          onSave={saveChanges}
        />

        {/* Modal pour PlaceForm */}
        <PlaceForm
          visible={placeModalVisible}
          onClose={onCloseModal}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60, // Largeur pour les icônes
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ListeMarchand;
