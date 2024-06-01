import { useNavigation } from "@react-navigation/native";
import { Heading, useToast, VStack } from "native-base";
import { useState } from "react";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";

export const Find = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const toast = useToast()
  const {navigate} = useNavigation();
  async function fetchPoolByCode(){
    try{
      setIsLoading(true)
      if(!code.trim()) return toast.show({title: "Informe o código do bolão", placement:"top", bgColor: "red.500"})
      await api.post(`pools/${code}/join`,{code})
      toast.show({ 
        title: `Entrou com sucesso no bolão ${code}`,
        placement:'top',
        bgColor: 'green.500',
      });
      navigate("pools")
    }catch(err){
      setIsLoading(false);
      console.error(err)
      toast.show({ title: "Erro ao buscar bolão", placement:'top', bgColor: 'red.500',})
      if(err.response.status === 404){
        return toast.show({ title: "Bolão não encontrado", placement:'top', bgColor: 'red.500',})
      }
      if(err.response.status === 400){
        return toast.show({ title: "Você já está nesse bolão", placement:'top', bgColor: 'red.500',})
      }
    }
  }


  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack alignItems={"center"} mt={8} mx={5}>
        <Heading
          fontFamily={"heading"}
          color="white"
          mb={8}
          fontSize="xl"
          textAlign="center"
        >
          Encontre um bolão através de {"\n"} seu código único
        </Heading>

        <Input placeholder="Qual o código do bolão?" mb={2} onChangeText={setCode} value={code} autoCapitalize="characters" />
        <Button title="BUSCAR BOLÃO" onPress={fetchPoolByCode} isLoading={isLoading} />
      </VStack>
    </VStack>
  );
};
