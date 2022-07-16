import { validateUserPermissions } from "../utils/validateUserPermissions";
import { useAuth } from "./useAuth";

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions = [], roles = [] }: UseCanParams) {
  const { user, isAuthenticated } = useAuth();

  console.log(user);
  if (!isAuthenticated) return false;

  const userHasValidPermissions = validateUserPermissions({ permissions, roles, user });

  return userHasValidPermissions;
}
