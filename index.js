import { readFile } from "fs/promises";

import {
  amountEnergyToBe500,
  availableToClaim,
  getAccountData,
  getRepairAmount,
  getReward,
  refillEn,
  repair,
  stakedList,
} from "./functions.js";

const account = process.env.ACCOUNT;

async function main() {
  try {
    const list = await stakedList(account);
    console.log("list = ", list);
    const accountData = await getAccountData(account);
    console.log("accountData = ", accountData);

    const refillEnTo500 = amountEnergyToBe500(accountData[0].energy);

    if (refillEnTo500 > 0) {
      await refillEn(account, refillEnTo500);
    }

    for (let i = 0; i < list.length; i++) {
      const asset = list[i];

      /*  {
    asset_id: '1099580587721',
    type: 'waves',
    template_id: 343638,
    mining_power: 3,
    energy_usage: 10,
    strength_usage: 10,
    strength: 280,
    basic_strength: 400,
    last_claim_time: '2021-12-19T18:10:03.500',
    spare1: 0,
    spare2: 0
  }*/

      const itemID = asset.asset_id;
      const ableToClaim = availableToClaim(asset.ready_at);

      const amountToRepair = getRepairAmount(
        asset.basic_strength,
        asset.strength
      );

      if (amountToRepair > 0) {
        await repair(account, itemID, amountToRepair);
      }

      if (ableToClaim) {
        await getReward(account, itemID);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

main();
