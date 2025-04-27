import { useState } from "react";
import { useApiQuery } from "../../hooks/useApiQuery/useApiQuery";

const Test = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [autoFetch, setAutoFetch] = useState(true);
  const [queryParams, setQueryParams] = useState({ limit: 10 });

  // Basic query with auto-fetching
  const {
    data: autoData,
    isLoading: autoLoading,
    isError: autoError,
    error: autoErrorDetails,
  } = useApiQuery({
    queryKey: ["auto-test"],
    url: "/api/test",
    params: queryParams,
    retry: retryCount, // Will retry failed requests 3 times
    enabled: autoFetch,
  });

  // Manual query (doesn't run automatically)
  const {
    data: manualData,
    isLoading: manualLoading,
    isError: manualError,
    refetch,
    isFetching,
  } = useApiQuery({
    queryKey: ["manual-test"],
    url: "/api/test/manual",
    enabled: false, // Don't run automatically
  });

  // POST example
  const {
    data: postData,
    isLoading: postLoading,
    refetch: postRefetch,
  } = useApiQuery({
    queryKey: ["post-test"],
    url: "/api/test/post",
    method: "POST",
    body: { name: "Test User" },
    enabled: false,
  });

  // Data transformation example
  const { data: transformedData } = useApiQuery({
    queryKey: ["transform-test"],
    url: "/api/test/items",
    select: (data) => {
      // Transform the data before it's stored in cache
      return data?.items?.map((item) => ({
        ...item,
        displayName: `${item.name} (${item.id})`,
      }));
    },
    enabled: autoFetch,
  });

  const handleFetchManual = () => {
    console.log("Manually fetching data");
    refetch();
  };

  const handlePostData = () => {
    console.log("Sending POST request");
    postRefetch();
  };

  const handleUpdateParams = () => {
    setQueryParams((prev) => ({ limit: prev.limit + 5 }));
    // Will automatically refetch with new params since queryKey includes params
  };

  const toggleAutoFetch = () => {
    setAutoFetch((prev) => !prev);
  };

  const changeRetryCount = (e) => {
    setRetryCount(Number(e.target.value));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">React Query Test Page</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Configuration</h2>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block mb-1">Auto-fetch:</label>
            <button
              onClick={toggleAutoFetch}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              {autoFetch ? "Disable Auto-fetch" : "Enable Auto-fetch"}
            </button>
          </div>

          <div>
            <label className="block mb-1">Retry Count:</label>
            <input
              type="number"
              value={retryCount}
              onChange={changeRetryCount}
              className="border p-1 rounded"
              min="0"
              max="10"
            />
          </div>

          <div>
            <label className="block mb-1">Update Query Params:</label>
            <button
              onClick={handleUpdateParams}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Increase Limit (+5)
            </button>
            <div className="text-sm mt-1">Current: {queryParams.limit}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Auto-fetch Query</h2>
          {autoLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : autoError ? (
            <div className="text-red-500">
              Error: {autoErrorDetails?.message || "Unknown error"}
            </div>
          ) : (
            <pre className="bg-gray-100 p-2 rounded">
              {JSON.stringify(autoData, null, 2)}
            </pre>
          )}
          <div className="mt-2 text-sm text-gray-500">
            Status: {autoLoading ? "Loading" : autoError ? "Error" : "Success"}
          </div>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Manual Query</h2>
          <button
            onClick={handleFetchManual}
            className="px-3 py-1 bg-blue-500 text-white rounded mb-3"
            disabled={manualLoading || isFetching}
          >
            {isFetching ? "Fetching..." : "Fetch Data Manually"}
          </button>

          {manualLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : manualError ? (
            <div className="text-red-500">Error fetching data</div>
          ) : manualData ? (
            <pre className="bg-gray-100 p-2 rounded">
              {JSON.stringify(manualData, null, 2)}
            </pre>
          ) : (
            <div className="text-gray-500">No data fetched yet</div>
          )}
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">POST Request</h2>
          <button
            onClick={handlePostData}
            className="px-3 py-1 bg-purple-500 text-white rounded mb-3"
            disabled={postLoading}
          >
            {postLoading ? "Sending..." : "Send POST Request"}
          </button>

          {postData && (
            <pre className="bg-gray-100 p-2 rounded">
              {JSON.stringify(postData, null, 2)}
            </pre>
          )}
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Data Transformation</h2>
          {transformedData ? (
            <pre className="bg-gray-100 p-2 rounded">
              {JSON.stringify(transformedData, null, 2)}
            </pre>
          ) : (
            <div className="text-gray-500">No transformed data yet</div>
          )}
          <div className="mt-2 text-sm">
            The <code>select</code> option transforms API data before caching
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
