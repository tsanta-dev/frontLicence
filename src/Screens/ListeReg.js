// frontend/listeMarchand.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator,  Modal, TextInput, Button  } from 'react-native';
import { TouchableOpacity} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 


const ListeReg = () => {
  const [regisseurs, setRegisseur] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedRegi, setSelectedRegi] = useState(null);
  const [nom_reg, setNomReg] = useState('');
  const [zone_occupe, setZoneOccupe] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // Fonction pour récupérer les données depuis l'API
    const fetchRegisseur = async () => {
      try {
        const response = await axios.get('http://192.168.43.72:3000/regisseur');
        setRegisseur(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchRegisseur();
  }, []);

   //modif
   const handleEdit = (regisseur) => {
    setSelectedRegi(regisseur);
    setNomReg(regisseur.nom_reg);
    setZoneOccupe(regisseur.zone_occupe);
    setModalVisible(true);
  };

  const saveChanges = async () => {
    try {
      await axios.put(`http://192.168.43.72:3000/regisseurs/${selectedRegi.cin_reg}`, {
        nom_reg,
        zone_occupe,
      });
      setModalVisible(false);
      // Actualiser la liste après modification
      const updatedRegi = regisseurs.map((m) =>
        m.cin_reg === selectedRegi.cin_reg ? { ...m, nom_reg, zone_occupe } : m
      );
      setRegisseur(updatedRegi);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  }

  
  //suppr
  const handleDelete = async (cin_reg) => {
    try {
      await axios.delete(`http://192.168.43.72:3000/regisseurs/${cin_reg}`);
      setRegisseur(regisseurs.filter((regisseur) => regisseur.cin_reg !== cin_reg));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
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
    <View style={styles.grid}>
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => navigation.navigate('RegisForm')} // Naviguer vers MarchandForm
      >
        <FontAwesome5 name="shopping-cart" size={24} color="#009688" />
        <Text style={styles.gridText}>Régisseur</Text>
      </TouchableOpacity>
    </View>
         

  
    <FlatList
      data={regisseurs}
      keyExtractor={(item) => item.cin_reg.toString()} // Utilise l'ID du marchand comme clé
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.nom_reg}</Text>
          <Text>CIN: {item.cin_reg}</Text>
          <Text>Téléphone: {item.zone_occupe}</Text>

          <TouchableOpacity onPress={() => handleEdit(item)}>
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.cin_reg)}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
 )}
 />
        
          {/* Modal pour modifier les informations */}
          <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le régisseur</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={nom_reg}
              onChangeText={setNomReg}
            />
            <TextInput
              style={styles.input}
              placeholder="Zone"
              value={zone_occupe}
              onChangeText={setZoneOccupe}
            />
            <Button title="Sauvegarder" onPress={saveChanges} />
            <Button title="Annuler" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  gridItem: {
    width: '40%',
    height: 120,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    width: '100%',
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 60, // Largeur pour les icônes d'édition et de suppression
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ListeReg;
