// hooks/useApiQuery.js
import { useMutation, useQuery } from "@tanstack/react-query";
import httpClient from "../../http-client/http-client";
import { useEffect } from "react";

export const useApiQuery = ({
  queryKey,
  url,
  method = "GET",
  params = {},
  headers = {},
  enabled = true,
  select,
  retry = false,
  staleTimeInMinutes = 0,
  onSuccess,
  onError,
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

      if (response.status >= 400) {
        throw response;
      }

      return response;
    },
    enabled,
    select,
    retry,
    staleTime: staleTimeInMinutes * 60 * 1000,
  });

  // Call user-defined onSuccess when query becomes successful
  useEffect(() => {
    if (query.isSuccess) {
      onSuccess?.(query.data?.data);
    }
  }, [query.isSuccess, query.data, onSuccess]);

  // Call user-defined onError when query fails
  useEffect(() => {
    if (query.isError) {
      onError?.(query.error?.errors);
    }
  }, [query.isError, query.error, onError]);

  return {
    ...query,
    data: query.data?.data,
    errors: query.error?.errors,
  };
};

// export const useApiQuery = ({
//   queryKey,
//   url,
//   method = "GET",
//   params = {},
//   headers = {},
//   enabled = true,
//   select,
//   retry = false,
//   staleTime = 0,
//   onSuccess,
//   onError,
// }) => {
//   const actualQueryKey = [queryKey, method, params];
//   const query = useQuery({
//     queryKey: actualQueryKey,
//     queryFn: async () => {
//       const httpMethod = method.toLowerCase();
//       if (!httpClient[httpMethod]) {
//         throw new Error(`Unsupported HTTP method: ${method}`);
//       }

//       const response = await httpClient[httpMethod]({
//         url,
//         headers,
//         params,
//       });

//       // Check if response has error status code
//       if (response.status >= 400) {
//         throw response;
//       }

//       return response;
//     },
//     enabled,
//     select,
//     retry,
//     staleTime,
//     onSuccess: (data) => {
//       console.log(data, "onSuccess");
//     },
//     onError: (error) => {
//       console.log(error, "onError");
//     },
//   });

//   return query;
// };

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
