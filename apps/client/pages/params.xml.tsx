import { NextPageContext } from "next";

const Params = () => {};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const serverIp = process.env.SERVER_IP ?? "localhost";
  const xml = `<params><scriptAdr value="/scripts/"/><socket port="12301" host="${serverIp}"/></params>`;

  ctx.res.setHeader("Content-Type", "text/xml");
  ctx.res.write(xml);
  ctx.res.end();

  return {
    props: {},
  };
};

export default Params;
