import { request, gql } from "graphql-request";
import useSWR from "swr";

const API = "https://api.graphql.jobs/";

const query = gql`
  query {
    jobs {
      id
      title
      applyUrl
    }
  }
`;

type FetchData = {
  jobs: {
    id: string;
    title: string;
    applyUrl: string;
  }[];
};

const GetJobs = () => {
  const { data, error } = useSWR<FetchData>(
    query,
    // fecther
    (query) => request(API, query)
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return data.jobs.map((job) => (
    <div key={job.id}>
      <li>{job.title}</li>
      <li>{job.applyUrl}</li>
      <br />
    </div>
  ));
};

const JobPage = () => (
  <>
    <h1>Job List</h1>
    {GetJobs()}
  </>
);

export default JobPage;
