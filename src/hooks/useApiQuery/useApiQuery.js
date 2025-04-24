// hooks/useApiQuery.js
import { useQuery } from "@tanstack/react-query";
import httpClient from "http-client/http-client";

export const useApiQuery = ({
  queryKey,
  url,
  method = "GET",
  body,
  params = {},
  headers = {},
  enabled = true,
  select,
  retry = false,
}) => {
  return useQuery({
    queryKey: [queryKey, method, params],
    queryFn: async () => {
      const httpMethod = method.toLowerCase();

      if (!httpClient[httpMethod]) {
        throw new Error(`Unsupported HTTP method: ${method}`);
      }

      const { data, errors } = await httpClient[httpMethod]({
        url,
        body,
        headers,
        params,
      });

      if (errors.length) {
        throw new Error(errors.map((e) => e.message).join(", "));
      }

      return data;
    },
    enabled,
    select,
    retry,
  });
};
