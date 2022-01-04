import { NextPageContext } from 'next';
import React from 'react';

const Params = () => {};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const xml = 'BBL=0'

  ctx.res.setHeader("Content-Type", "text/html");
  ctx.res.write(xml);
  ctx.res.end();

  return {
    props: {}
  }
}

export default Params;