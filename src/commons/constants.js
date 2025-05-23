import { sideMenuConfig } from "../routing";
import { v5 as uuidv5 } from "uuid";

const NAMESPACE = "b3b3c4f6-4d6e-4b19-8c70-3fc8c2216a0d"; // <-- You should define your own namespace UUID
export const getAllPermissionsList = () => {
  if (!sideMenuConfig || !Array.isArray(sideMenuConfig)) {
    console.error("sideMenuConfig is missing or not an array", sideMenuConfig);
    return [];
  }

  return sideMenuConfig
    .flatMap((item) => item.allowed_permisions || [])
    .map((perm) => {
      const uuid = uuidv5(perm, NAMESPACE);
      return {
        label: perm,
        value: uuid,
      };
    });
};

export const userAccessTypes = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
};

export const countryCodes = {
  IN: "+91",
  US: "+1",
  UK: "+44",
};

export const tenant_type = [
  { label: "Tournament Creator", value: "Tournament Creator" },
  { label: "Coach", value: "Coach" },
  { label: "Technical Official", value: "Technical Official" },
  { label: "Physio", value: "Physio" },
  { label: "Tournament Sponsorer", value: "Tournament Sponsorer" },
  { label: "Association/Federation", value: "Association/Federation" },
  { label: "Schools", value: "Schools" },
  { label: "Colleges", value: "Colleges" },
  { label: "Academics", value: "Academics" },
  { label: "Clubs", value: "Clubs" },
  { label: "Corporate", value: "Corporate" },
  { label: "Other", value: "Other" }
];

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
  LOGOUT: "logout",
  USERS_LIST: "users_list",
  ROLES_LIST: "roles_list",
  GET_USER_BY_PHONE: "get_user_by_phone",
  TOURNAMENTS: "tournaments",
};
