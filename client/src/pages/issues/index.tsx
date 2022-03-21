import { GraphQLClient, gql } from "graphql-request";
import useSWR from "swr";

const API = "https://api.github.com/graphql"; // endpoint
const repositoryOwner = "vercel"; // the repository owner
const repositoryName = "next.js"; // the repository name
const issuesFirst = 100; // the number of issues

const getRepositoryQuery = gql`
  query GetRepository(
    ## variables①でしていしたものがこちらに入ってくる
    $repositoryOwner: String!
    $repositoryName: String!
    $issuesFirst: Int
  ) {
    repository(owner: $repositoryOwner, name: $repositoryName) {
      name
      issues(first: $issuesFirst) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  }
`;

type FetchData = {
  repository: {
    name: string;
    issues: {
      edges: {
        node: {
          id: string;
          title: string;
        };
      }[];
    };
  };
};

const GetIssues = () => {
  // use GraphQLClient to set Header
  const client = new GraphQLClient(API, {
    headers: {
      Authorization:
        "bearer " + process.env.NEXT_PUBLIC_GITHUB_PERSONAL_ACCESSTOKEN,
    },
  });

  const { data, error } = useSWR<FetchData>(
    [getRepositoryQuery, repositoryOwner, repositoryName, issuesFirst],
    // fetcher
    (query, owner, name, first) =>
      client.request(query, {
        // variables①
        repositoryOwner: owner,
        repositoryName: name,
        issuesFirst: first,
      })
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return data.repository.issues.edges.map((issue) => (
    <li key={issue.node.id}>{issue.node.title}</li>
  ));
};

const IssuesPage = () => (
  <>
    <h1>
      {repositoryOwner}/{repositoryName} Issue List
    </h1>
    {GetIssues()}
  </>
);

export default IssuesPage;
