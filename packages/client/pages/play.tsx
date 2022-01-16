import type { GetServerSideProps, NextPage } from "next";
import nookies, { destroyCookie } from "nookies";
import { Layout } from "../components/Layout";
import { SwfContainer } from "../components/SwfContainer";
import { checkJwtAuth } from "../src/helpers";

type PlayProps = {
  SESSION: string;
};

const PlayPage: NextPage<PlayProps> = (props: PlayProps) => {
  const FLASH_VARS = {
    SESSION: props.SESSION,
    DAILYMSG: "Projet open-source",
    DAILYMSGSECU: "Message de sécurité",
    CACHE_VERSION: 1,
  };

  return (
    <Layout className="flex flex-col bg-white/10 backdrop-blur rounded-xl">
      <div className="p-5 inline-flex items-center">
        <h1 className="flex-1 font-medium text-2xl text-slate-100">Serveur de développement</h1>
      </div>
      <SwfContainer src="/chat/chat.swf" className="self-center max-w-[950px] max-h-[560px]" flashVars={FLASH_VARS} height={560} width={950} />
    </Layout>
  );
};

export default PlayPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { SESSION } = nookies.get(ctx);
  if (!SESSION) {
    try {
      await checkJwtAuth(SESSION);
    } catch (err) {
      destroyCookie(ctx, "SESSION");
      return {
        props: {},
        redirect: {
          destination: "/login",
        },
      };
    }
  }
  return {
    props: {
      SESSION,
    },
  };
};
