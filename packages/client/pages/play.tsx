import type { NextPage } from "next";
import { useAuthContext } from "../components/AuthStore";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900">
      <div className="mt-4">{/* <Image src={logo} alt="logo" /> */}</div>
      <div className="flex flex-col bg-white/10 backdrop-blur rounded-xl my-4">
        <div className="p-5 inline-flex items-center">
          <h1 className="flex-1 font-medium text-2xl text-slate-100">Serveur de développement</h1>
          {auth?.data?.username && (
            <a title="Gérer mon compte" href="/my-account" className="font-medium text-2xl text-blue-300 hover:text-blue-400">
              {auth.data.username}
            </a>
          )}
        </div>
        <SwfContainer src="/chat/chat.swf" className="self-center max-w-[950px] max-h-[560px]" flashVars={FLASH_VARS} height={560} width={950} />
        <div className="px-3 py-2 border-white/50 inline-flex items-center text-xs text-slate-400">
          <span className="flex-1 justify-items-start">Déconseillé en production</span>
          <span className="flex-1 text-right justify-self-end">Développé par l'équipe de Blablaland.fun</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
