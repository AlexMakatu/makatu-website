export type CsvRow = {
  fromCity: string;
  toCity: string;
  vehicleType: string;
  priceType: "fixed" | "startingFrom" | "negotiable" | "quoteRequired";
  price?: string;
  active?: string;
  transitTime?: string;
};

export type UploadResult =
  | { row: CsvRow; success: true }
  | { row: CsvRow; success?: false; error: string };
