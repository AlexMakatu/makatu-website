import { groq } from "next-sanity";

export const getRouteRateQuery = groq`
*[_type == "routeRate"
  && fromCity->name == $fromCity
  && toCity->name == $toCity
  && vehicleType == $vehicleType
  && active == true
][0]{
  priceType,
  price
}
`;
