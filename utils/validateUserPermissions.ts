interface User {
  permissions: string[];
  roles: string[];
}

type ValidadeUserPermissionsParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
};

export function validateUserPermissions({
  permissions,
  roles,
  user,
}: ValidadeUserPermissionsParams) {
  if (permissions && permissions?.length > 0) {
    const hasAllPermissions = permissions.every((permission) => {
      console.log(user);
      return user.permissions?.includes(permission);
    });

    if (!hasAllPermissions) return false;
  }
  if (roles && roles?.length > 0) {
    const hasAllRoles = roles?.some((role) => {
      return user.roles?.includes(role);
    });

    console.log(hasAllRoles);

    if (!hasAllRoles) return false;
  }

  return true;
}
