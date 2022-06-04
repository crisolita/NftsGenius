import { GraphQLClient } from "graphql-request";

export const ethaProtocolClient = new GraphQLClient(
  // process.env.REACT_APP_SUBGRAPH_URL,
  "https://api.thegraph.com/subgraphs/name/crisolita/nftandmarketmainnet"
);
