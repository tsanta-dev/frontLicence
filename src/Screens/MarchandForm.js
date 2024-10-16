import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Modal } from 'react-native';
import axios from 'axios';
import { TextInput, Button } from 'react-native-paper';
import Dropdown from './Dropdown'; // Assurez-vous que le fichier Dropdown existe et fonctionne
import tw from 'twrnc'; // Tailwind CSS pour React Native
import RNPickerSelect from 'react-native-picker-select';

const MarchandForm = ({ visible, onClose }) => {
  const [nom, setNom] = useState('');
  const [cin, setCin] = useState('');
  const [telephone, setTelephone] = useState('');
  const [pavillons, setPavillons] = useState([]); // Liste des pavillons disponibles
  const [selectedPavillon, setSelectedPavillon] = useState(''); // Pavillon sélectionné
  const [categorie, setCategorie] = useState(''); // Catégorie du pavillon
  const [loyer, setLoyer] = useState(''); // Loyer du pavillon
  const [categories, setCategories] = useState([]); // Catégories filtrées par localité
  const [localiteSelected, setLocaliteSelected] = useState(''); // Localité du pavillon sélectionné

  // Récupération des pavillons disponibles
  useEffect(() => {
    const fetchPavillons = async () => {
      try {
        const response = await axios.get('http://192.168.43.72:3000/pavillons/libres');
        if (response.status === 200 && Array.isArray(response.data.data)) {
          setPavillons(response.data.data); // Mise à jour de la liste des pavillons
        } else {
          Alert.alert('Erreur', 'Aucune donnée de pavillons disponible');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des pavillons:', error.message);
        Alert.alert('Erreur', 'Impossible de récupérer les pavillons disponibles.');
      }
    };

    if (visible) {
      fetchPavillons(); // Appel de l'API seulement lorsque la modal est visible
    }
  }, [visible]);

  // Récupération des catégories en fonction de la localité du pavillon sélectionné
  useEffect(() => {
    const fetchCategoriesByLocalite = async () => {
      if (selectedPavillon) {
        // Récupérer la localité du pavillon sélectionné
        const selectedPavillonData = pavillons.find(pavillon => pavillon.Numero === selectedPavillon);
        if (selectedPavillonData) {
          setLocaliteSelected(selectedPavillonData.Localite);

          try {
            const response = await axios.get(`http://192.168.43.72:3000/categories/${selectedPavillonData.Localite}`);
            if (response.status === 200) {
              const filteredCategories = response.data.data; // Assurez-vous que l'API renvoie les catégories
              setCategories(filteredCategories); // Mise à jour de la liste des catégories filtrées
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error.response ? error.response.data : error.message);
            Alert.alert('Erreur', 'Impossible de récupérer les catégories pour cette localité.');
          }
        }
      } else {
        setCategories([]); // Réinitialiser les catégories si aucun pavillon n'est sélectionné
        setLocaliteSelected('');
      }
    };

    fetchCategoriesByLocalite();
  }, [selectedPavillon, pavillons]);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async () => {
    if (!nom || !cin || !telephone || !selectedPavillon || !categorie || !loyer) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
  
    try {
      // Envoi des données pour ajouter un marchand avec un pavillon et mise à jour catégorie et loyer
      const response = await axios.post('http://192.168.43.72:3000/addWithPavillon', {
        nom,
        cin,
        telephone,
        pavillon_numero: selectedPavillon,
        categorie,  // Envoi de la catégorie sélectionnée
        loyer       // Envoi du loyer récupéré
      });
  
      if (response.status === 200) {
        // Mise à jour de la disponibilité du pavillon à "Prise"
        await axios.put(`http://192.168.43.72:3000/pavillons/${selectedPavillon}`, {
          Disponibilite: 'Prise',
        });
  
        Alert.alert('Succès', 'Marchand ajouté avec succès et pavillon mis à jour !');
  
        // Réinitialisation des champs du formulaire
        setNom('');
        setCin('');
        setTelephone('');
        setSelectedPavillon(''); // Correction ici
        setCategorie('');
        setLoyer('');
        onClose();
      } else {
        Alert.alert('Erreur', 'Erreur lors de l\'ajout du marchand.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du marchand:', error.message);
      Alert.alert('Erreur', 'Erreur lors de l\'ajout du marchand.');
    }
  };

  // Récupération du loyer en fonction de la catégorie sélectionnée
  const fetchLoyerForCategorie = async (typeCategorie) => {
    try {
      const response = await axios.get(`http://192.168.43.72:3000/loyerByCategorie/${typeCategorie}`);
      
      if (response.status === 200) {
        setLoyer(response.data.loyer.toString()); // Mise à jour du champ Loyer avec la valeur récupérée
      } else {
        Alert.alert('Erreur', 'Impossible de récupérer le loyer pour cette catégorie.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert('Erreur', 'Aucun loyer trouvé pour cette catégorie.');
      } else {
        console.error('Erreur lors de la récupération du loyer:', error.message);
        Alert.alert('Erreur', 'Erreur lors de la récupération du loyer.');
      }
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <View style={tw`bg-white p-5 rounded-lg w-80`}>
          {/* Champs du formulaire */}
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
          {/* Dropdown pour sélectionner un pavillon */}
          <Dropdown
            label="Sélectionnez un pavillon"
            value={selectedPavillon}
            onValueChange={value => {
              setSelectedPavillon(value);
              setCategorie(''); // Réinitialiser la catégorie lors du changement de pavillon
            }}
            items={pavillons.map(pavillon => ({
              label: pavillon.Numero, // Affichage du numéro du pavillon
              value: pavillon.Numero, // Utilisation de la valeur du pavillon pour la sélection
            }))}
          />

          <View style={tw`p-5`}>
            <RNPickerSelect
              placeholder={{
                label: 'Sélectionner une catégorie',
                value: null,
              }}
              items={categories.map((cat) => ({
                label: cat.TypeCategorie, // Affiche le nom de la catégorie
                value: cat.TypeCategorie, // Valeur de la catégorie
                key: cat.NumeroCategorie,   // Clé unique pour chaque catégorie
              }))}
              onValueChange={(value) => {
                setCategorie(value); // Mise à jour de la catégorie sélectionnée
                fetchLoyerForCategorie(value); // Appel de la fonction pour récupérer le loyer
              }}
              style={{
                inputIOS: tw`border border-gray-300 rounded-lg px-3 py-2 mb-4`, // Style pour iOS
                inputAndroid: tw`border border-gray-300 rounded-lg px-3 py-2 mb-4`, // Style pour Android
              }}
              value={categorie} // Valeur sélectionnée
            />
          </View>

          {/* Champ Loyer */}
          <TextInput
            label="Loyer"
            value={loyer} // Le loyer est mis à jour automatiquement
            editable={false} // Empêcher l'édition manuelle (si souhaité)
            style={tw`mb-4`}
          />

          {/* Bouton pour soumettre le formulaire */}
          <Button mode="contained" onPress={handleSubmit} style={tw`mb-2`}>
            Ajouter Marchand
          </Button>
          {/* Bouton pour fermer la modal */}
          <Button mode="outlined" onPress={onClose}>
            Annuler
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default MarchandForm;
