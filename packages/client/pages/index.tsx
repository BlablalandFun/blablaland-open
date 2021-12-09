import type { NextPage } from "next";

import Image from "next/image";
import logo from "../assets/logo_blablaland.png";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900">
      <div className="mt-4">
        <Image src={logo} alt="logo" />
      </div>
      <div className="flex-1 flex flex-col bg-white/10 backdrop-blur container rounded-xl my-4 max-w-md">
        <div className="p-5">
          <h1 className="font-medium text-2xl text-slate-100">
            Serveur de développement
          </h1>
          <p className="pt-2 text-slate-300 text-sm">
            Il est <u>déconseillé</u> de l'utiliser en production !
          </p>
        </div>
        <form className="flex flex-col p-5 gap-y-16 flex-1">
          <div className="flex flex-col gap-y-2 ">
            <label htmlFor="username" className="text-slate-100 font-medium">
              Saisir votre nom d'utilisateur :
            </label>
            <input
              id="username"
              name="username"
              className="px-3 py-0.5 text-white bg-transparent border-b-2 border-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>
          <button className="self-center px-8 py-2 rounded-full font-medium text-white bg-sky-600 hover:bg-sky-700">
            Rejoindre le serveur
          </button>
        </form>
        <div className="px-3 py-2 border-white/50 inline-flex items-center justify-end">
          <span className="text-xs text-slate-400 text-right">
            Développé par l'équipe de Blablaland.fun
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
