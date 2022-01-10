import type { NextPage } from "next";

import Image from "next/image";
import { FormEvent } from "react";
import logo from "../assets/logo_blablaland.png";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  async function onSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    const req = await fetch("/api/auth", {
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    // const res = await req.json();
    console.log(evt);
  }

  return (
    <Layout>
        <div className="p-5">
          <h1 className="font-medium text-2xl text-slate-100">Serveur de développement</h1>
          <p className="pt-2 text-slate-300 text-sm">
            Il est <u>déconseillé</u> de l'utiliser en production !
          </p>
        </div>
        <form className="flex flex-col p-5 gap-y-16 flex-1" onSubmit={onSubmit}>
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
          <button className="self-center px-8 py-2 rounded-full font-medium text-white bg-sky-600 hover:bg-sky-700">Rejoindre le serveur</button>
        </form>
      </Layout>
  );
};

export default Home;
