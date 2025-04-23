import httpClient from "http-client/http-client";

export const uploadCsvForStakeHolderRegistration = async ({ formData }) => {
  const url = "/api/stakeholders/import";

  const { data, errors } = await httpClient.post({
    url,
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return { data, status, errors };
};

export const createHotel = async (payload) => {
  const url = "/api/hotels";

  const { data, errors } = await httpClient.post({
    url,
    body: payload,
  });

  return { data, errors };
};

export const updateHotel = async ({ payload, hotelId }) => {
  const url = `/api/hotels/${hotelId}`;

  const { data, errors } = await httpClient.put({
    url,
    body: payload,
  });

  return { data, errors };
};

export const uploadImages = async ({ formData, type }) => {
  const url = `/api/upload?document_type=${type}`;

  const { data, errors } = await httpClient.post({
    url,
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return { data, errors };
};
