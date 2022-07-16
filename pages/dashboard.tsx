import { destroyCookie } from "nookies";
import { useEffect } from "react";
import { Can } from "../components/Can";
import { AuthTokenError } from "../errors/AuthTokenError";
import { useAuth } from "../hooks/useAuth";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";

import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user, signOut } = useAuth();

  useEffect(() => {}, []);

  return (
    <>
      <h1>{user.email}</h1>

      <button onClick={signOut}>Sing Out</button>

      <Can permissions={[`metrics.list`]}>
        <div>Metricas</div>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const newCtx = ctx as unknown as undefined;

  const apiClient = setupAPIClient(newCtx);

  const response = await apiClient.get("/me");

  return {
    props: {},
  };
});
