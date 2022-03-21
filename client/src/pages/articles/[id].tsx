import { useRouter } from "next/router";

import { GraphQLClient, gql } from "graphql-request";
import useSWR from "swr";

const API = "/api/graphql";

const getArticleById = gql`
  query ($getArticleId: Int!) {
    getArticle(id: $getArticleId) {
      id
      title
      content
    }
  }
`;

type FetchData = {
  getArticle: {
    id: string;
    title: string;
    content: string;
  };
};

const GetArticles = () => {
  const router = useRouter();

  const { id } = router.query;
  const client = new GraphQLClient(API);

  const { data, error } = useSWR<FetchData>(
    [getArticleById],
    // fetcher
    (query) =>
      client.request(query, {
        getArticleId: Number(id),
      })
  );
  console.log(data);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return <li key={data.getArticle.id}>{data.getArticle.title}</li>;
};

const SingleArticlePage = () => (
  <>
    <h1>Articles List</h1>
    {GetArticles()}
  </>
);

export default SingleArticlePage;
