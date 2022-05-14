import type { NextPage } from "next";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="p-5 flex-1">
        <h1 className="font-medium text-2xl text-slate-900 dark:text-slate-100">Serveur de développement</h1>

        <div className="text-slate-600 dark:text-slate-300 text-sm mt-2">
          <p>Le projet est actuellement en développement et peut contenir de nombreux bogues.</p>

          <p className="mt-2 ">
            Pour plus d'informations, merci de vous rendre{" "}
            <a className="text-blue-300 hover:text-blue-400" href="https://github.com/BlablalandFun/open">
              ici
            </a>
            .
          </p>

          <p className="mt-10">Pour naviguer sur le site, vous pouvez utiliser les boutons situés en bas de la page.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
