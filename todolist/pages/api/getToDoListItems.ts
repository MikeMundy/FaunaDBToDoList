// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { items } from "./data";

import { IToDoListItem } from "../../interfaces/IToDoListItem";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    res.statusCode = 200;

    console.log(JSON.stringify(items, null, 2));    

    res.json(items);
  } else {
    res.statusCode = 405;
  }

}
