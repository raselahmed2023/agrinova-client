export interface IFarm {
  _id: string;
  name: string;
  division: string;
  district: string;
  landArea: string;
  unit: string;
  soilType: string;
  status: 'Active' | 'Inactive';
  coverImage?: string;
  description?: string; // Optional description field
  activeCropsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type IFarmFormData = Omit<IFarm, '_id' | 'createdAt' | 'updatedAt' | 'activeCropsCount'> & {
  landArea: string | number;
  description?: string;
};