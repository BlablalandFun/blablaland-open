import cx from "classnames";
import type { NextPage } from "next";
import Router from "next/router";
import { FormEvent, useState } from "react";
import { Layout } from "../components/Layout";

type RegistrationErrors = {
  username?: string;
  password?: string;
  confirmPassword?: string;
};

const RegisterPage: NextPage = () => {
  const [errors, setErrors] = useState<RegistrationErrors>({});

  const [remaining, setRemaining] = useState(0);

  async function onSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    const req = await fetch("/api/auth/register", {
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const res = await req.json();

    setErrors(res.errors ?? {});
    if (Object.entries(res.errors).length === 0) {
      Router.push("/play");
    }
    console.log(res);
  }

  return (
    <Layout>
      <div className="p-5">
        <h1 className="font-medium text-2xl text-slate-100">Inscris-toi !</h1>
      </div>
      <form className="flex flex-col p-5 gap-y-10 flex-1" onSubmit={onSubmit}>
        {/* <div className="flex justify-center p-4 text-green-900 font-medium bg-green-300 border border-green-400 rounded-xl">
          Votre compte a été créé avec succès, redirection dans 5 secondes..
        </div> */}
        <div className="flex flex-col gap-y-1">
          <label htmlFor="username" className="text-slate-100 font-medium">
            Entre ton nom d'utilisateur :
          </label>
          <input
            id="username"
            name="username"
            className={cx("px-1 py-1 text-white bg-transparent border-b-2 border-slate-500 focus:border-sky-500 focus:outline-none", {
              "border-red-500 focus:border-red-600": errors.username,
            })}
          />
          {errors.username && <small className="text-red-500 mt-1.5">{errors.username}</small>}
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="password" className="text-slate-100 font-medium">
            Entre ton mot de passe :
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={cx("px-1 py-1 text-white bg-transparent border-b-2 border-slate-500 focus:border-sky-500 focus:outline-none", {
              "border-red-500 focus:border-red-600": errors.password,
            })}
          />
          {errors.password && <small className="text-red-500 mt-1.5">{errors.password}</small>}
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="confirmPassword" className="text-slate-100 font-medium">
            Confirme ton mot de passe :
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={cx("px-1 py-1 text-white bg-transparent border-b-2 border-slate-500 focus:border-sky-500 focus:outline-none", {
              "border-red-500 focus:border-red-600": errors.confirmPassword,
            })}
          />
          {errors.confirmPassword && <small className="text-red-500 mt-1.5">{errors.confirmPassword}</small>}
        </div>
        <div className="flex gap-x-4">
          <button className="flex-1 self-start px-6 py-2 rounded-full font-medium text-white bg-sky-600 hover:bg-sky-700">S'inscire</button>
          <a href="/login" className="self-end px-6 py-2 rounded-full font-medium text-white bg-teal-600 hover:bg-teal-700">Déjà inscrit ?</a>
        </div>
      </form>
    </Layout>
  );
};

export default RegisterPage;
