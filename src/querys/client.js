import { GraphQLClient } from "graphql-request";

export const ethaProtocolClient = new GraphQLClient(
  // "https://api.thegraph.com/subgraphs/name/crisolita/testnetpues"
  "https://api.thegraph.com/subgraphs/name/crisolita/nftandmarketmainnet"
);
