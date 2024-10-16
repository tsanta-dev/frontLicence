import React, { useState } from 'react';
import { View, Alert, Modal } from 'react-native';
import axios from 'axios';
import { TextInput, Button } from 'react-native-paper';
import tw from 'twrnc';

const PlaceForm = ({ visible, onClose }) => {
  const [nom, setNom] = useState('');
  const [cin, setCin] = useState('');
  const [telephone, setTelephone] = useState('');
  const [numeroplace, setNumeroPlace] = useState('');
  const [localite, setLocalite] = useState('');  // Ajout du champ Localité
  const [categorie, setCategorie] = useState(''); // Ajout du champ Catégorie
  const [ticket, setTicket] = useState('');      // Ajout du champ Ticket

  const handleSubmit = async () => {
    if (!numeroplace || !nom || !cin || !telephone || !localite || !categorie || !ticket) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.43.72:3000/addWithPlace', {
        nom,
        cin,
        telephone,
        numeroplace,
        localite,   // Envoi de Localité
        categorie,  // Envoi de Catégorie
        ticket      // Envoi de Ticket
      });

      if (response.status === 200) {
        Alert.alert('Succès', 'Marchand ajouté avec succès !');
        setNom('');
        setCin('');
        setTelephone('');
        setNumeroPlace('');
        setLocalite('');
        setCategorie('');
        setTicket('');
        onClose(); // Fermer le modal après succès
      } else {
        Alert.alert('Erreur', 'Erreur lors de l\'ajout du marchand.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du marchand:', error.message);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <View style={tw`bg-white p-5 rounded-lg w-80`}>
          <TextInput
            label="Nom"
            value={nom}
            onChangeText={setNom}
            style={tw`mb-4`}
          />
          <TextInput
            label="CIN"
            value={cin}
            onChangeText={setCin}
            style={tw`mb-4`}
          />
          <TextInput
            label="Téléphone"
            value={telephone}
            onChangeText={setTelephone}
            style={tw`mb-4`}
          />
          <TextInput
            label="Numéro de place"
            value={numeroplace}
            onChangeText={setNumeroPlace}
            style={tw`mb-4`}
          />
          <TextInput
            label="Localité"
            value={localite}
            onChangeText={setLocalite}
            style={tw`mb-4`}
          />
          <TextInput
            label="Catégorie"
            value={categorie}
            onChangeText={setCategorie}
            style={tw`mb-4`}
          />
          <TextInput
            label="Ticket"
            value={ticket}
            onChangeText={setTicket}
            style={tw`mb-4`}
          />

          <Button mode="contained" onPress={handleSubmit} style={tw`mb-2`}>
            Ajouter Marchand
          </Button>
          <Button mode="outlined" onPress={onClose}>
            Annuler
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default PlaceForm;
