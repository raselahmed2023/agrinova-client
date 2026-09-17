import {
  apiRequest,
} from "./api.client";

export interface AdminFarm {
  _id: string;

  farmerId?: string;

  farmerEmail?: string;

  name: string;

  farmType?:
    | "Crop"
    | "Orchard"
    | "Poultry"
    | "Livestock"
    | "Fishery";

  division?: string;

  district?: string;

  upazila?: string;

  landArea?: number;

  unit?:
    | "Bigha"
    | "Acre"
    | "Hectare"
    | "Decimal";

  soilType?: string;

  coverImage?: string;

  description?: string;

  status?:
    | "Active"
    | "Inactive";

  createdAt?: string;

  updatedAt?: string;
}

export const adminFarmService =
  {
    
    async getAdminFarms(
      queryString?:
        string
    ) {
      return apiRequest<
        AdminFarm[]
      >(
        "/admin/farms",
        "GET",
        undefined,
        queryString
      );
    },

    async getAdminFarmById(
      farmId:
        string
    ) {
      return apiRequest<
        AdminFarm
      >(
        `/admin/farms/${farmId}`
      );
    },
  };