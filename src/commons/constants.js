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
};
