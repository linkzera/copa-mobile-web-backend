import { useToast, VStack, Text, HStack } from "native-base";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { Header } from "../components/Header";
import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { PoolCardProps } from "../components/PoolCard";
import { Loading } from "../components/Loading";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Share } from "react-native";
import { Guesses } from "../components/Guesses";

interface DetailsProps {
  id: string;
}

export const Details = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pool, setPool] = useState<PoolCardProps>({} as PoolCardProps);
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const route = useRoute();
  const { id } = route.params as DetailsProps;
  const toast = useToast();

  async function fetchPool() {
    try {
      const response = await api.get(`/pools/${id}`);
      setPool(response.data.pools);
    } catch (error) {
      toast.show({
        title: "Erro ao buscar bolão",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: `Olha o bolão que eu participo no Bolão da Copa! use o código ${pool.code} para participar!`,
    });
  }

  useEffect(() => {
    fetchPool();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor={"gray.900"}>
      <Header title={pool?.title} showBackButton showShareButton onShare={handleCodeShare} />
      {pool._count.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={pool} />
          <HStack bgColor={"gray.800"} rounded={"sm"} p={1} mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === "ranking"}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>
          <Guesses poolId={pool.id} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pool.code} onShare={handleCodeShare}  />
      )}
    </VStack>
  );
};
