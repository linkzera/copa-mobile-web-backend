import { Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Icon, Text, useToast, VStack, FlatList } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { api } from "../services/api";
import { useCallback, useState } from "react";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { Loading } from "../components/Loading";

export const Pools = () => {
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardProps[]>([]);

  const toast = useToast();
  async function fetchPools() {
    try {
      setIsLoading(true);
      const response = await api.get("/pools");
      setPools(response.data.pools);
    } catch (error) {
      toast.show({
        title: "Erro ao buscar bolões",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools();
  },[]));

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Meus Bolões" />
      <VStack
        alignItems={"center"}
        mt={6}
        mb={4}
        mx={5}
        pb={4}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate("find")}
        />
      </VStack>
      {isLoading ? <Loading/> :
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
          <PoolCard data={item}
          onPress={() => navigate("details", { id: item.id })}
          />
          
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 10 }}
          ListEmptyComponent={<EmptyPoolList />}
          
        />
      }
    </VStack>
  );
};
