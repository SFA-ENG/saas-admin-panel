import httpClient from "http-client/http-client";

export const deleteUserByuserId = async (tenant_user_id) => {
  const url = `/iam/users/${tenant_user_id}`;
  const { data, errors } = await httpClient.delete({ url });
  return { data, errors };
};

export const getUserByEmailAndTenantId = async ({ email, tenant_id }) => {
  const url = `/iam/users?email=${email}&tenant_id=${tenant_id}`;
  const { data, errors } = await httpClient.get({ url });
  return { data, errors };
};
