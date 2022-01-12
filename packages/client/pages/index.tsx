import type { NextPage } from "next";
import Router from "next/router";
import { useAuthContext } from "../components/AuthStore";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  const auth = useAuthContext();
  if (auth?.data?.username) {
    Router.push("/play");
  }

  return (
    <Layout>
      <div className="p-5">
        <h1 className="font-medium text-2xl text-slate-100">Serveur de développement</h1>
        <p className="pt-2 text-slate-300 text-sm">
          Il est <u>déconseillé</u> de l'utiliser en production !
        </p>
      </div>
    </Layout>
  );
};

export default Home;
