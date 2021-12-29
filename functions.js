import { rpc, api } from "./core.js";
import axios from "axios";

async function getReward(_account, _id) {
  const result = await api.transact(
    {
      actions: [
        {
          account: "spacecraftxc",
          name: "getreward",
          authorization: [
            {
              actor: _account,
              permission: "active",
            },
          ],
          data: {
            asset_id: _id,
            owner: _account,
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );
}

export async function refillEn(_account, energy) {
  // energy to wave
  const wave = energy / 10;

  const result = await api.transact(
    {
      actions: [
        {
          account: "spacecraftxc",
          name: "buyenergy",
          authorization: [
            {
              actor: _account,
              permission: "active",
            },
          ],
          data: {
            waves_payment: wave,
            owner: _account,
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );
}

export function amountEnergyToBe500(energy) {
  return energy < 500 ? 500 - energy : 0;
}

export async function getAccountData(_account) {
  const data = await rpc.get_table_rows({
    json: true,
    code: "spacecraftxc",
    scope: "spacecraftxc",
    table: "users",
    index_position: 1,
    key_type: "name",
    limit: 1,
    reverse: false,
    show_payer: false,
    lower_bound: _account,
    upper_bound: _account,
  });

  return data.rows;
}

export async function stakedList(_account) {
  const data = await rpc.get_table_rows({
    json: true,
    code: "spacecraftxc",
    scope: _account,
    table: "stakedassets",
    lower_bound: "",
    upper_bound: "",
    index_position: 1,
    key_type: "i64",
    limit: 1000,
    reverse: false,
    show_payer: false,
  });

  // TODO: paging?
  return data.rows;
}

export function availableToClaim(readyAt) {
  // from lastClaimTime there has no Z
  const ready = new Date(readyAt + "Z");
  // const oneHour = 1000 * 60 * 60;
  // return now - last > oneHour;
  const now = new Date();

  return now - ready > 0;
}

export function getRepairAmount(basicStrength, strength) {
  const strNeed = basicStrength - strength;
  const repairAmount = strNeed * 1000;
  return repairAmount;
}

export async function repair(_account, _id, repairAmount) {
  const result = await api.transact(
    {
      actions: [
        {
          account: "spacecraftxc",
          name: "repairasset",
          authorization: [
            {
              actor: _account,
              permission: "active",
            },
          ],
          data: {
            asset_id: _id,
            dark_matter_payment: repairAmount, //120000
            owner: _account,
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );
}

export { getReward };
