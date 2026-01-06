import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  onJoin?: () => void;
  onCreate?: () => void;
};

export default function ModalJoinCreate({
  visible,
  onClose,
  onJoin,
  onCreate,
}: Props) {
  const [showJoinView, setShowJoinView] = useState(false);

  const handleJoin = () => {
    setShowJoinView(true);
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      console.log("Create pressed");
    }
  };

  const handleClose = () => {
    setShowJoinView(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="fade"
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
          {/* Botón de cerrar */}
          <Pressable
            onPress={handleClose}
            className="absolute top-4 right-4 w-10 h-10 items-center justify-center active:opacity-70 z-10"
          >
            <Text className="text-3xl text-gray-700 font-bold">✕</Text>
          </Pressable>

          {!showJoinView ? (
            <>
              {/* Título */}
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Selecciona una opción
              </Text>

              {/* Botones */}
              <View className="gap-4">
                {/* Botón Join - Rojo */}
                <Pressable
                  onPress={handleJoin}
                  className="bg-red rounded-lg p-4 active:opacity-80 flex-row items-center"
                >
                  <Ionicons name="person-add" size={24} color="white" />
                  <View className="ml-4 flex-1">
                    <Text className="text-white text-lg font-bold">
                      Join Room
                    </Text>
                    <Text className="text-white/90 text-sm">
                      Únete a una sala con código
                    </Text>
                  </View>
                </Pressable>

                {/* Botón Create - Azul */}
                <Pressable
                  onPress={handleCreate}
                  className="bg-black rounded-lg p-4 active:opacity-80 flex-row items-center"
                >
                  <Ionicons name="add-circle" size={24} color="white" />
                  <View className="ml-4 flex-1">
                    <Text className="text-white text-lg font-bold">
                      Create Room
                    </Text>
                    <Text className="text-white/90 text-sm">
                      Crea una nueva sala para jugar
                    </Text>
                  </View>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              {/* Vista de Join Room */}
              <Text className="text-2xl font-bold text-gray-900 mb-6">
                Unirse a una sala
              </Text>

              {/* Input para código */}
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-2">
                  Código de la sala
                </Text>
                <TextInput
                  placeholder="Ingresa el código"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Opción de escanear */}
              <Pressable className="bg-gray-100 rounded-lg p-4 active:opacity-80 flex-row items-center justify-center">
                <Ionicons name="qr-code-outline" size={24} color="#374151" />
                <Text className="text-gray-700 text-base font-medium ml-2">
                  Escanear código QR
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
