import Image from "next/image";
import celular from "../assets/app-nlw-copa-preview.png";
import logo from "../assets/logo.svg";
import usersAvatar from "../assets/users-avatar-example.png";
import iconCheck from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";
import { GetStaticProps } from "next";
interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}
export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function createPool(e: FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;
      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso, o código foi copiado para área de transferência!')
      setPoolTitle('')
    } catch (err) {
      alert("Falha ao criar o bolão, tente novamente.");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main className="">
        <Image src={logo} alt="logo nlw copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatar} alt="avatares de usuários" />
          <span className="text-gray-100 font-bold text-xl">
            <span className="text-green-500">+{props.userCount} </span>pessoas
            já estão usando
          </span>
        </div>
        <form onSubmit={(e) => createPool(e)} className="mt-10 flex gap-2">
          <input
            type="text"
            required
            placeholder="Qual nome do seu bolão ?"
            className="flex-1 px-6 py-4 rounded border border-gray-600 bg-gray-800 text-gray-100 placeholder:text-gray-200"
            onChange={(e) => setPoolTitle(e.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-700 px-6 py-4 rounded text-sm font-bold uppercase"
          >
            Criar meu Bolão
          </button>
        </form>
        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 flex border-t border-t-gray-600">
          <div className="flex gap-6 items-center">
            <Image src={iconCheck} alt="" width={40} height={40} />
            <div className="flex flex-col text-gray-100">
              <span className="font-bold text-2xl">+{props?.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="w-px bg-gray-600 mx-16" />
          <div className="flex gap-6 items-center">
            <Image src={iconCheck} alt="" width={40} height={40} />
            <div className="flex flex-col text-gray-100">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={celular} quality={100} alt="celular" />
    </div>
  );
}

export async function getStaticProps(){
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 60 * 10
  };
};
