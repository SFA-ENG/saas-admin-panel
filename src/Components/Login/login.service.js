import httpClient from "../../http-client/http-client";

export const onboardTenant = async (payload) => {
  const url = `/api/stakeholders/login`;
  const { data, errors } = await httpClient.post({
    url,
    body: payload,
  });
  return { data, errors };
};
