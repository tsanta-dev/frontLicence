
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const RegisForm = () => {
  const [nom_reg, setNomReg] = useState('');
  const [cin_reg, setCinReg] = useState('');
  const [zone_occupe, setZoneOccupe] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://192.168.43.72:3000/addRegi', {
        nom_reg,
        cin_reg,
        zone_occupe
      });

      if (response.status === 200) {
        Alert.alert('Succès', 'Régisseur ajouté avec succès !');
        // Réinitialiser le formulaire
        setNomReg('');
        setCinReg('');
        setZoneOccupe('');
      } else {
        Alert.alert('Erreur', 'Erreur lors de l\'ajout du régisseur.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Erreur lors de l\'ajout du marchand.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom_reg}
        onChangeText={setNomReg}
      />
      <TextInput
        style={styles.input}
        placeholder="CIN"
        value={cin_reg}
        onChangeText={setCinReg}
      />
      <TextInput
        style={styles.input}
        placeholder="Zone"
        value={zone_occupe}
        onChangeText={setZoneOccupe}
      />
      <Button title="Ajouter Regisseur" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default RegisForm;
