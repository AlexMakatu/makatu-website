import { groq } from "next-sanity";

export const getRouteRateQuery = groq`
*[_type == "routeRate"
  && lower(fromCity->name) == lower($fromCity)
  && lower(toCity->name) == lower($toCity)
  && lower(vehicleType->name) == lower($vehicleType)
  && active == true
][0]{
  priceType,
  price,
  "vehicleName": vehicleType->name
}
`;
