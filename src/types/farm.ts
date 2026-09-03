export type FarmType =
  | 'Crop'
  | 'Orchard'
  | 'Poultry'
  | 'Livestock'
  | 'Fishery';

export type FarmUnit =
  | 'Bigha'
  | 'Acre'
  | 'Hectare'
  | 'Decimal';

export interface IFarm {
  _id: string;

  name: string;

  farmType: FarmType;

  division: string;
  district: string;
  upazila: string;

  landArea?: number | string;
  unit?: FarmUnit;

  soilType?: string;

  status: 'Active' | 'Inactive';

  coverImage?: string;
  description?: string;

  createdAt: string;
  updatedAt: string;
}

export interface IFarmFormData {
  name: string;

  farmType: FarmType | '';

  division: string;
  district: string;
  upazila: string;

  landArea?: string | number;
  unit?: FarmUnit;

  soilType?: string;

  status: 'Active' | 'Inactive';

  coverImage?: string;
  description?: string;
}