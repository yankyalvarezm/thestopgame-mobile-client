import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
};

type AccordionItem = {
  id: string;
  number: string;
  title: string;
  content: string;
};

const accordionItems: AccordionItem[] = [
  {
    id: "summary",
    number: "",
    title: "Summary",
    content:
      '"Stop" is a word game where players quickly come up with words starting with a random letter. Fill categories like professions, sports, and countries within 20 seconds.',
  },
  {
    id: "how-to-win",
    number: "",
    title: "Winning",
    content:
      "Score points by listing unique words in each category. The player with the most points wins.",
  },
  {
    id: "how-to-lose",
    number: "",
    title: "Losing",
    content:
      "You lose by failing to come up with unique words in time or not accumulating enough points. This game requires quick thinking, vocabulary, and strategic choices!",
  },
];

export default function ModalHowToPlay({ visible, onClose }: Props) {
  const [expandedSection, setExpandedSection] = useState<string>("summary");

  const toggleSection = (id: string) => {
    // Si se hace click en la sección que ya está abierta, se cierra
    // Si se hace click en otra, se abre esa y se cierra la anterior
    setExpandedSection(expandedSection === id ? "" : id);
  };

  const isExpanded = (id: string) => expandedSection === id;

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="fade"
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-md relative">
          {/* Botón de cerrar */}
          <Pressable
            onPress={onClose}
            className="absolute top-4 right-4 w-10 h-10 items-center justify-center active:opacity-70 z-10"
          >
            <Text className="text-3xl text-gray-700 font-bold">✕</Text>
          </Pressable>

          {/* Título */}
          <View className="mb-6">
            <Text className="text-2xl font-bold">
              the <Text className="text-red">STOP</Text> game
            </Text>
          </View>

          {/* Acordeón */}
          <ScrollView showsVerticalScrollIndicator={false} className="max-h-96">
            <View className="gap-2">
              {accordionItems.map((item) => {
                const expanded = isExpanded(item.id);

                return (
                  <View key={item.id} className="overflow-hidden rounded-lg">
                    {/* Header del acordeón */}
                    <Pressable
                      onPress={() => toggleSection(item.id)}
                      className="bg-black p-4 flex-row items-center justify-between active:opacity-90"
                    >
                      <Text className="text-white text-base font-medium">
                        {item.number} {item.title}
                      </Text>
                      <Ionicons
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="white"
                      />
                    </Pressable>

                    {/* Contenido del acordeón */}
                    {expanded && (
                      <View className="bg-white p-4 border-b border-l border-r border-gray-200">
                        <Text className="text-gray-800 text-sm leading-6">
                          {item.id === "summary" ? (
                            <>
                              <Text className="text-red font-bold">"Stop"</Text>
                              {
                                " is a word game where players quickly come up with words starting with a random letter. Fill categories like professions, sports, and countries within "
                              }
                              <Text className="text-red font-bold">
                                20 seconds
                              </Text>
                              {"."}
                            </>
                          ) : item.id === "how-to-win" ? (
                            <>
                              {"Score "}
                              <Text className="text-red font-bold">points</Text>
                              {" by listing "}
                              <Text className="text-red font-bold">
                                unique words
                              </Text>
                              {
                                " in each category. The player with the most points wins."
                              }
                            </>
                          ) : (
                            <>
                              {
                                "You lose by failing to come up with unique words in time or not accumulating enough points. This game requires "
                              }
                              <Text className="text-red font-bold">
                                quick thinking
                              </Text>
                              {", "}
                              <Text className="text-red font-bold">
                                vocabulary
                              </Text>
                              {", and "}
                              <Text className="text-red font-bold">
                                strategic
                              </Text>
                              {" choices!"}
                            </>
                          )}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
