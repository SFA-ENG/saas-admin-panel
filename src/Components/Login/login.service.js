import httpClient from "../../http-client/http-client";

export const validatePassword = async (body) => {
  const url = `/api/stakeholders/login`;
  const { data, errors } = await httpClient.post({
    url,
    body,
  });
  return { data, errors };
};
