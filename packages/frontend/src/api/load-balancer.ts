import http from "./http";

type getRoomNumberBody = {
  server: string;
  type: string;
  urlId: string;
};

export async function getRoomNumber(type: string, spaceUrlPath: string) {
  const response = await http.get<getRoomNumberBody>(
    `/lb/${type}/${spaceUrlPath}`,
  );
  return response.data;
}
