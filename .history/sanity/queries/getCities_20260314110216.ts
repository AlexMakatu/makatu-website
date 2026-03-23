import { client } from "../lib/client";
import { groq } from "next-sanity";

export async function getCities() {
  return client.fetch(
    groq`*[_type == "city"] | order(name asc){
      _id,
      name
    }`,
  );
}
