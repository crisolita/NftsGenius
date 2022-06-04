const { GraphQLClient } = require("graphql-request");
const { gql } = require("graphql-tag");

const client = new GraphQLClient(
  "https://api.thegraph.com/subgraphs/name/crisolita/nftandmarketmainnet"
);

const GET_ERC1155_NEWS = () => {
  const queryString = `
    query {
  tokens (first:500){
    id
    uri
    creator
    amount
  }
}`;

  return gql(queryString);
};

const GET_SALES = () => {
  const queryString = `
    query {
   sales (first:500){
    id
    seller
    amount
    price
    tokenID
  }}`;
  return gql(queryString);
};

module.exports = {
  GET_SALES,
  GET_ERC1155_NEWS,
  client,
};
