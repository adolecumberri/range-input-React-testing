import { API_URL } from "./constants";

export const myFetch = async ({
    method = "GET",
    path,
  }: {
    path: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
  }) => {
    const response = await fetch(API_URL + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': "*"
      },
    });
    try {
      const json = await response.json();
      return json;
    } catch {
      return null;
    }
  };