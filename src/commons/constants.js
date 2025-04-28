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

export const permissionList = [
  {
    id: "623e0949-99e5-4ecf-af99-6735520b7f1e",
    name: "READ:SUB_MODULE_1"
  },
  {
    id: "9ab57abf-3cac-4696-b2ae-53c54564be52",
    name: "UPDATE:SUB_MODULE_1"
  },
  {
    id: "f2b97e7e-3a0d-44d0-bedc-697ea94edaf5",
    name: "DELETE:SUB_MODULE_1"
  },
  {
    id: "f8220e87-938e-4d44-9e78-0d76db00a1d9",
    name: "CREATE:SUB_MODULE_1"
  }  
]

export const CACHE_KEYS = {
  TENANTS_LIST: "tenants_list",
  ONBOARD_TENANT: "onboard_tenant",
  LOGIN: "login",
  USERS_LIST: "users_list",
  ROLES_LIST: "roles_list",
};
