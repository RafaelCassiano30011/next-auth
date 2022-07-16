import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { setupAPIClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Metrics() {
  const { user } = useAuth();

  useEffect(() => {}, []);

  return (
    <>
      <h1>Metrics</h1>
    </>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const newCtx = ctx as unknown as undefined;
    const apiClient = setupAPIClient(newCtx);
    const response = await apiClient.get("/me");

    return {
      props: {},
    };
  },
  {
    permissions: ["metrics.list"],
    roles: ["administrator"],
  }
);
