import { GraphQLClient, gql } from "graphql-request";
import useSWR from "swr";

const API = "/api/graphql";

const getArticlesQuery = gql`
  query {
    getArticles {
      id
      title
      content
    }
  }
`;

type FetchData = {
  getArticles: [
    {
      id: string;
      title: string;
      content: string;
    }
  ];
};

const GetArticles = () => {
  const client = new GraphQLClient(API);

  const { data, error } = useSWR<FetchData>(
    [getArticlesQuery],
    // fetcher
    (query) => client.request(query)
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return data.getArticles.map((article) => (
    <li key={article.id}>{article.title}</li>
  ));
};

const ArticlePage = () => (
  <>
    <h1>Articles List</h1>
    {GetArticles()}
  </>
);

export default ArticlePage;
