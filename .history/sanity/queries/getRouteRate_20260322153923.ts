import { groq } from "next-sanity";

export const getRouteRateQuery = groq`
*[_type == "routeRate"
  && fromCity->name == $fromCity
  && toCity->name == $toCity
  && vehicleType->name == $vehicleType
  && active == true
][0]{
  priceType,
  price
}
`;
