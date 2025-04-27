// hooks/useApiQuery.js
import { useQuery, useMutation } from "@tanstack/react-query";
import httpClient from "../../http-client/http-client";

export const useApiQuery = ({
  queryKey,
  url,
  method = "GET",
  params = {},
  headers = {},
  enabled = true,
  select,
  retry = false,
  staleTime = 0,
}) => {
  const actualQueryKey = [queryKey, method, params];

  const query = useQuery({
    queryKey: actualQueryKey,
    queryFn: async () => {
      const httpMethod = method.toLowerCase();

      if (!httpClient[httpMethod]) {
        throw new Error(`Unsupported HTTP method: ${method}`);
      }

      const response = await httpClient[httpMethod]({
        url,
        headers,
        params,
      });

      // Check if response has error status code
      if (response.status >= 400) {
        throw response;
      }

      return response;
    },
    enabled,
    select,
    retry,
    staleTime,
  });

  return {
    ...query,
    // Extract data and errors specifically
    apiData: query.data?.data,
    apiErrors: query.data?.errors,
  };
};

export const useApiMutation = ({
  url,
  method = "POST",
  headers = {},
  params = {},
  onSuccess,
  onError,
}) => {
  const mutation = useMutation({
    mutationFn: async (body) => {
      const httpMethod = method.toLowerCase();

      if (!httpClient[httpMethod]) {
        throw new Error(`Unsupported HTTP method: ${method}`);
      }

      const response = await httpClient[httpMethod]({
        url,
        body,
        headers,
        params,
      });

      if (response.status >= 400) {
        throw response;
      }

      return response;
    },
    onSuccess: (data, variables) => {
      if (onSuccess) {
        onSuccess(data.data, variables);
      }
    },
    onError,
  });

  return mutation;
};
