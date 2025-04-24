import httpClient from "http-client/http-client";

const getHotels = async ({ page = 1, pageSize = 10 }) => {
  const url = `/api/hotels?page=${page}&pageSize=${pageSize}`;
  const { data, errors } = await httpClient.get({
    url,
  });
  return { data, errors };
};

export default getHotels;


export const getHotelDetailsById = async ({ id }) => {
  const url = `/api/hotel-details/${id}`;
  const { data, errors } = await httpClient.get({
    url,
  });
  return { data, errors };
};