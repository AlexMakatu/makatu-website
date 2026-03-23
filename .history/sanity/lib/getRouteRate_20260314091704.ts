import { client } from "@/sanity/lib/client";
import { getRouteRateQuery } from "@/sanity/queries/getRouteRate";

export async function getRouteRate(
  fromCity: string,
  toCity: string,
  vehicleType: string,
) {
  const rate = await client.fetch(getRouteRateQuery, {
    fromCity,
    toCity,
    vehicleType,
  });

  return rate;
}
