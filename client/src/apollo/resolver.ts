import { Config } from "apollo-server-micro";

const SAMPLE_DB = {
  articles: [
    { id: 1, title: "foo", content: "fooooo" },
    { id: 2, title: "bar", content: "baaaar" },
    { id: 3, title: "baz", content: "baaaaz" },
  ],
};

const getArticleResolver = (_: any, { id }: { id: number }) =>
  SAMPLE_DB.articles?.filter((article) => article.id === id)[0] ?? [];

const getArticles = () => SAMPLE_DB.articles;

export const resolvers: Config["resolvers"] = {
  Query: {
    getArticle: getArticleResolver,
    getArticles: getArticles,
  },
};
