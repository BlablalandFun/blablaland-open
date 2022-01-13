import type { NextPage } from "next";
import { useAuthContext } from "../components/AuthStore";
import { Layout } from "../components/Layout";
import { SwfContainer } from "../components/SwfContainer";

const Home: NextPage = () => {
  const FLASH_VARS = {
    SESSION: "TEST_SESSION",
    DAILYMSG: "Projet open-source",
    DAILYMSGSECU: "Message de sécurité",
    CACHE_VERSION: 1,
  };

  const auth = useAuthContext();

  return (
    <Layout className="flex flex-col bg-white/10 backdrop-blur rounded-xl my-4">
      <div className="p-5 inline-flex items-center">
        <h1 className="flex-1 font-medium text-2xl text-slate-100">Serveur de développement</h1>
        {auth?.data?.username && (
          <a title="Gérer mon compte" href="/my-account" className="font-medium text-2xl text-blue-300 hover:text-blue-400">
            {auth.data.username}
          </a>
        )}
      </div>
      <SwfContainer src="/chat/chat.swf" className="self-center max-w-[950px] max-h-[560px]" flashVars={FLASH_VARS} height={560} width={950} />
    </Layout>
  );
};

export default Home;
