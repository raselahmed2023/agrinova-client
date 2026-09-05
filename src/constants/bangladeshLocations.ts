import locationData from './bangladeshLocations.json';

interface LocationName {
  local: string;
  en: string;
  slug: string;
}

interface Upazila {
  id: string;
  name: LocationName;
}

interface District {
  id: string;
  name: LocationName;
  upazila: Upazila[];
}

interface Division {
  id: string;
  name: LocationName;
  district: District[];
}

interface BangladeshLocationData {
  _attribution?: string;
  data: Division[];
}

const bangladeshLocations =
  locationData as BangladeshLocationData;

/**
 * All Bangladesh divisions
 */
export const DIVISIONS =
  bangladeshLocations.data
    .map((division) => division.name.en)
    .sort((a, b) => a.localeCompare(b));

/**
 * Returns districts only under
 * the selected division.
 */
export const getDistrictsByDivision = (
  divisionName: string
): string[] => {
  if (!divisionName) return [];

  const division =
    bangladeshLocations.data.find(
      (item) =>
        item.name.en.toLowerCase() ===
        divisionName.toLowerCase()
    );

  if (!division) return [];

  return division.district
    .map((district) => district.name.en)
    .sort((a, b) => a.localeCompare(b));
};

/**
 * Returns upazilas only under
 * the selected district.
 */
export const getUpazilasByDistrict = (
  divisionName: string,
  districtName: string
): string[] => {
  if (!divisionName || !districtName) {
    return [];
  }

  const division =
    bangladeshLocations.data.find(
      (item) =>
        item.name.en.toLowerCase() ===
        divisionName.toLowerCase()
    );

  if (!division) return [];

  const district =
    division.district.find(
      (item) =>
        item.name.en.toLowerCase() ===
        districtName.toLowerCase()
    );

  if (!district) return [];

  return district.upazila
    .map((upazila) => upazila.name.en)
    .sort((a, b) => a.localeCompare(b));
};

/**
 * Check whether a selected
 * Division → District → Upazila
 * combination is valid.
 */
export const isValidFarmLocation = (
  divisionName: string,
  districtName: string,
  upazilaName: string
): boolean => {
  const upazilas =
    getUpazilasByDistrict(
      divisionName,
      districtName
    );

  return upazilas.some(
    (item) =>
      item.toLowerCase() ===
      upazilaName.toLowerCase()
  );
};