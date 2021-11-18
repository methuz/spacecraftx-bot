import { rpc, api } from "./core.js";
import  axios  from "axios";

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

export { getReward};
