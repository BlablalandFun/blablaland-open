import type { NextPage } from "next";

import Image from "next/image";
import { FormEvent, useState } from "react";
import logo from "../assets/logo_blablaland.png";
import { Layout } from "../components/Layout";
import cx from "classnames";

type RegistrationErrors = {
  username?: string;
  password?: string;
  confirmPassword?: string;
};

const RegisterPage: NextPage = () => {
  const [errors, setErrors] = useState<RegistrationErrors>({});

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
    console.log(res);
  }

  return (
    <Layout>
      <div className="p-5">
        <h1 className="font-medium text-2xl text-slate-100">Inscris-toi !</h1>
      </div>
      <form className="flex flex-col p-5 gap-y-10 flex-1" onSubmit={onSubmit}>
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
        <button className="self-center px-6 py-2 rounded-full font-medium text-white bg-sky-600 hover:bg-sky-700">Confirme ton inscription</button>
      </form>
    </Layout>
  );
};

export default RegisterPage;
