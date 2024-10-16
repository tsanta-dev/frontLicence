// frontend/Dropdown.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';

const Dropdown = ({ label, value, onValueChange, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (itemValue) => {
    onValueChange(itemValue);
    setIsOpen(false); // Fermer le menu après la sélection
  };

  return (
    <View style={tw`mb-5`}>
      <Text style={tw`mb-2 text-gray-700`}>{label}</Text>
      
      {/* Bouton pour ouvrir/fermer le dropdown */}
      <TouchableOpacity onPress={toggleDropdown} style={tw`border border-gray-300 p-3 rounded bg-white`}>
        <Text>{value || 'Sélectionnez un élément'}</Text>
      </TouchableOpacity>

      {/* Menu déroulant */}
      {isOpen && (
        <View style={tw`absolute left-0 right-0 bg-white border border-gray-300 rounded mt-1 z-50`}>
          <ScrollView style={tw`max-h-40`} /* Limite la hauteur du menu pour ajouter le défilement */>
            {items.map((item) => (
              <TouchableOpacity key={item.value} onPress={() => handleSelect(item.value)} style={tw`p-3 border-b border-gray-200`}>
                <Text>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Dropdown;
