import { apiRequest } from "./api.client";
import type { IFarm } from "@/types/farm";

export const getMyFarms = () => apiRequest<IFarm[]>("/farms");