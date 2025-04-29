import httpClient from "http-client/http-client";

export const deleteUserByuserId = async (tenant_user_id) => {
  const url = `/iam/users/${tenant_user_id}`;
  const { data, errors } = await httpClient.delete({ url });
  return { data, errors };
};
