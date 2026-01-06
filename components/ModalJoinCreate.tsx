import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import React from "react";

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
  const handleJoin = () => {
    if (onJoin) {
      onJoin();
    } else {
      console.log("Join pressed");
    }
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      console.log("Create pressed");
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="fade"
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          {/* Botón de cerrar */}
          <Pressable
            onPress={onClose}
            className=" w-full h-10 items-end justify-end active:opacity-70 z-10"
          >
            <Text className="text-3xl text-gray-700 font-bold">✕</Text>
          </Pressable>

          {/* Botones */}
          <View className="gap-3">
            <Pressable
              onPress={handleJoin}
              className="bg-red px-6 py-4 rounded-md active:opacity-80 items-center"
            >
              <Text className="text-white text-lg font-light">Join</Text>
            </Pressable>

            <Pressable
              onPress={handleCreate}
              className="bg-black px-6 py-4 rounded-md active:opacity-80 items-center"
            >
              <Text className="text-white text-lg font-light">Create</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
