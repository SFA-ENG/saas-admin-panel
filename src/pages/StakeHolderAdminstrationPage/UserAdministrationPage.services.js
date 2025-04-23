import httpClient from "../../http-client/http-client";

export const fetchStakeHolders = async ({ page, page_size, stakeholderId }) => {
  const url = stakeholderId
    ? `/api/stakeholders/${stakeholderId}`
    : `/api/stakeholders?page=${page}&page_size=${page_size}`;
  const { data, status, errors } = await httpClient.get({
    url,
  });
  return { data, status, errors };
};

export const handleStakeHolderStatus = async ({ payload, stakeholderId }) => {
  const url = `/api/stakeholders/${stakeholderId}`;
  const { data, errors } = await httpClient.put({
    url,
    body: payload,
  });
  return { data, errors };
};

export const createUsers = async ({ body }) => {
  const url = `/v1/users`;
  const { data, status, errors } = await httpClient.post({
    url,
    body,
  });
  return { data, status, errors };
};

export const updateUserByEmail = async ({ body }) => {
  const url = `/v1/users`;
  const { data, status, errors } = await httpClient.patch({
    url,
    body,
  });

  return { data, status, errors };
};

export const resetUserPasswordByPhoneNumber = async ({ body }) => {
  const url = `/v1/users/reset-password`;
  const { data, status, errors } = await httpClient.patch({
    url,
    body,
  });
  return { data, status, errors };
};

export const fetchRoles = async (query) => {
  const url = `/api/roles`;
  const { data, status, errors } = await httpClient.get({
    url,
    params: { ...query },
  });

  return { data, status, errors };
};

export const createRole = async ({ body }) => {
  const url = `/api/roles`;
  const { data, status, errors } = await httpClient.post({
    url,
    body,
  });
  return { data, status, errors };
};

export const updateRole = async ({ body, role_id }) => {
  const url = `/api/roles/${role_id}`;
  const { data, status, errors } = await httpClient.put({
    url,
    body,
  });
  return { data, status, errors };
};

export const fetchUserDetails = async ({ email }) => {
  const url = `/v1/users`;
  const { data, status, errors } = await httpClient.get({
    url,
    params: { email, type: "DETAIL" },
  });
  return { data, status, errors };
};

export const updateStakeHolderRoles = async ({ payload }) => {
  const url = `/api/stakeholders/manage-role`;
  const { data, status, errors } = await httpClient.post({
    url,
    body: payload,
  });

  return { data, status, errors };
};

export const createAdminSlo = async ({ payload }) => {
  const url = `/api/slo`;
  const { data, errors } = await httpClient.post({
    url,
    body: payload,
  });
  return { data, errors };
};
