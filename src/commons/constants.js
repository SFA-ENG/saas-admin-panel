import { sideMenuConfig } from "../routing";

export const userAccessTypes = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
};

export const countryCodes = {
  IN: "+91",
  US: "+1",
  UK: "+44",
};

export const countryCodeOptions = Object.entries(countryCodes).map(
  ([key, value]) => ({
    value: key,
    label: `${value} (${key})`,
  })
);

export const CACHE_KEYS = {
  TENANTS_LIST: "tenants_list",
  ONBOARD_TENANT: "onboard_tenant",
  LOGIN: "login",
  USERS_LIST: "users_list",
  ROLES_LIST: "roles_list",
};

export const getAllPermissionsList = () => {
  if (!sideMenuConfig || !Array.isArray(sideMenuConfig)) {
    console.error(
      "sideMenuConfig is missing or not an array",
      sideMenuConfig
    );
    return [];
  }

  return sideMenuConfig
    .flatMap((item) => item.allowed_permisions || [])
    .map((perm) => ({
      label: perm,
      value: perm,
    }));
};
