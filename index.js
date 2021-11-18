import { readFile } from "fs/promises";

import {
  getReward
} from "./functions.js";

const itemList = JSON.parse(
  await readFile(new URL("./items.json", import.meta.url))
);

const account = process.env.ACCOUNT;

for (let i = 0; i < itemList.length; i++) {
  const itemID = itemList[i];

  try {
    await getReward(account, itemID);
  } catch (error) {
    console.error(error);
  }
}
