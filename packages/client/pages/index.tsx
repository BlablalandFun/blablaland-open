import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-pink-100"
    >
      <div
        className="flex-1 flex flex-col bg-white/40 backdrop-blur container rounded-xl my-8"
      >
        <div className="p-5 rounded-t-xl border-b border-white/50">
          <h1 className="font-medium text-2xl">
            Serveur local de test
          </h1>
        </div>
        <form className="flex flex-col p-5 gap-y-4 flex-1">
          <div className="flex flex-col gap-y-2 w-80">
            <label htmlFor="username">Saisir votre nom d'utilisateur :</label>
            <input
              id="username"
              name="username"
              className="rounded-lg px-3 py-0.5"
            />
          </div>
        </form>
        <div className="px-5 py-2 rounded-t-xl border-t border-white/50 inline-flex items-center justify-end">
          <span className="text-xs text-black/50 text-right">
            Développé par l'équipe de X
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
