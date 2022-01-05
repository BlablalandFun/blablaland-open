import type { NextPage } from "next";

import Image from "next/image";
import logo from "../assets/logo_blablaland.png";

function toFlashVars(value: object) {
  const entries = Object.entries(value).map(([key, value]) => [key, value]);
  const result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

const Home: NextPage = () => {
  const FLASH_VARS: object = {
    SESSION: "TEST_SESSION",
    DAILYMSG: "Projet open-source",
    DAILYMSGSECU: "Message de sécurité",
    CACHE_VERSION: 1,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900">
      <div className="mt-4">
        <Image src={logo} alt="logo" />
      </div>
      <div className="flex flex-col bg-white/10 backdrop-blur rounded-xl my-4">
        <div className="p-5">
          <h1 className="font-medium text-2xl text-slate-100">Serveur de développement</h1>
        </div>
        <div className="self-center max-w-[950px] max-h-[560px]">
          <embed
            // @ts-expect-error
            flashvars={new URLSearchParams(toFlashVars(FLASH_VARS)).toString()}
            height="560"
            quality="high"
            src="/chat/chat.swf"
            type="application/x-shockwave-flash"
            width="950"
          />
        </div>
        <div className="px-3 py-2 border-white/50 inline-flex items-center text-xs text-slate-400">
          <span className="flex-1 justify-items-start">Déconseillé en production</span>
          <span className="flex-1 text-right justify-self-end">Développé par l'équipe de Blablaland.fun</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
