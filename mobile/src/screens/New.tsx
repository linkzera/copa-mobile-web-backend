import { Heading, Text, useToast, VStack } from "native-base";
import { useState } from "react";
import { Alert } from "react-native";
import Logo from "../assets/logo.svg";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";

export const New = () => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()
  async function handlePoolCreate(){
   try{
      if(!title.trim()) return toast.show({
        title: "Informe um nome para o bolão",
        placement:'top',
        bgColor: 'red.500',
      });
      setIsLoading(true)
      await api.post('/pools',{
        title: title.toUpperCase()
      })
      toast.show({ 
        title: "Bolão criado com sucesso",
        placement:'top',
        bgColor: 'green.500',
      });
      setTitle('')
   }catch(err){
      console.error(err)
      toast.show({ title: "Erro ao criar bolão", placement:'top', bgColor: 'red.500',})
   }finally{
      setIsLoading(false)
   }
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Criar novo Bolão" />
      <VStack alignItems={"center"} mt={8} mx={5}>
        <Logo width={212} height={40} />
        <Heading
          fontFamily={"heading"}
          color="white"
          my={8}
          fontSize="xl"
          textAlign="center"
        >
          Crie seu próprio bolão da copa {"\n"} e compartilhe entre amigos!
        </Heading>

        <Input 
          placeholder="Qual nome do seu bolão?" 
          mb={2}
          onChangeText={setTitle}
          value={title}
        />
        <Button 
          title="CRIAR MEU BOLÃO"
          mb={4}
          onPress={handlePoolCreate}
          isLoading={isLoading}
          _spinner={{ color: 'black' }}
        />
        <Text color="gray.200">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
};
