// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { addItem, items } from "./data";
import { IToDoListItem } from "../../interfaces/IToDoListItem";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const newItem = req.body as IToDoListItem;
    addItem(newItem);

    console.log(JSON.stringify(items, null, 2));

    res.statusCode = 200;
    res.json("New item added");
  } else {
    res.statusCode = 405;
  }

}
