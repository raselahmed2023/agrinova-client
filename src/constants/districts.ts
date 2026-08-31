export interface DistrictLocation {
  name: string;
  division: string;
  lat: number;
  lon: number;
}

// Approximate district-headquarter coordinates for weather lookup.
export const BD_DISTRICTS: DistrictLocation[] = [
  { name: 'Bagerhat', division: 'Khulna', lat: 22.6516, lon: 89.7859 },
  { name: 'Bandarban', division: 'Chattogram', lat: 22.1953, lon: 92.2184 },
  { name: 'Barguna', division: 'Barishal', lat: 22.1592, lon: 90.1266 },
  { name: 'Barishal', division: 'Barishal', lat: 22.7010, lon: 90.3535 },
  { name: 'Bhola', division: 'Barishal', lat: 22.6859, lon: 90.6482 },
  { name: 'Bogura', division: 'Rajshahi', lat: 24.8481, lon: 89.3730 },
  { name: 'Brahmanbaria', division: 'Chattogram', lat: 23.9571, lon: 91.1119 },
  { name: 'Chandpur', division: 'Chattogram', lat: 23.2333, lon: 90.6712 },
  { name: 'Chapainawabganj', division: 'Rajshahi', lat: 24.5965, lon: 88.2775 },
  { name: 'Chattogram', division: 'Chattogram', lat: 22.3569, lon: 91.7832 },
  { name: 'Chuadanga', division: 'Khulna', lat: 23.6402, lon: 88.8418 },
  { name: 'Cumilla', division: 'Chattogram', lat: 23.4607, lon: 91.1809 },
  { name: "Cox's Bazar", division: 'Chattogram', lat: 21.4272, lon: 92.0058 },
  { name: 'Dhaka', division: 'Dhaka', lat: 23.8103, lon: 90.4125 },
  { name: 'Dinajpur', division: 'Rangpur', lat: 25.6279, lon: 88.6332 },
  { name: 'Faridpur', division: 'Dhaka', lat: 23.6071, lon: 89.8429 },
  { name: 'Feni', division: 'Chattogram', lat: 23.0159, lon: 91.3976 },
  { name: 'Gaibandha', division: 'Rangpur', lat: 25.3288, lon: 89.5282 },
  { name: 'Gazipur', division: 'Dhaka', lat: 24.0023, lon: 90.4264 },
  { name: 'Gopalganj', division: 'Dhaka', lat: 23.0051, lon: 89.8266 },
  { name: 'Habiganj', division: 'Sylhet', lat: 24.3745, lon: 91.4155 },
  { name: 'Jamalpur', division: 'Mymensingh', lat: 24.9375, lon: 89.9378 },
  { name: 'Jashore', division: 'Khulna', lat: 23.1664, lon: 89.2081 },
  { name: 'Jhalokathi', division: 'Barishal', lat: 22.6406, lon: 90.1987 },
  { name: 'Jhenaidah', division: 'Khulna', lat: 23.5448, lon: 89.1539 },
  { name: 'Joypurhat', division: 'Rajshahi', lat: 25.0968, lon: 89.0227 },
  { name: 'Khagrachhari', division: 'Chattogram', lat: 23.1193, lon: 91.9847 },
  { name: 'Khulna', division: 'Khulna', lat: 22.8456, lon: 89.5403 },
  { name: 'Kishoreganj', division: 'Dhaka', lat: 24.4449, lon: 90.7766 },
  { name: 'Kurigram', division: 'Rangpur', lat: 25.8054, lon: 89.6362 },
  { name: 'Kushtia', division: 'Khulna', lat: 23.9013, lon: 89.1204 },
  { name: 'Lakshmipur', division: 'Chattogram', lat: 22.9447, lon: 90.8282 },
  { name: 'Lalmonirhat', division: 'Rangpur', lat: 25.9167, lon: 89.4457 },
  { name: 'Madaripur', division: 'Dhaka', lat: 23.1641, lon: 90.1897 },
  { name: 'Magura', division: 'Khulna', lat: 23.4855, lon: 89.4198 },
  { name: 'Manikganj', division: 'Dhaka', lat: 23.8617, lon: 90.0003 },
  { name: 'Meherpur', division: 'Khulna', lat: 23.7622, lon: 88.6318 },
  { name: 'Moulvibazar', division: 'Sylhet', lat: 24.4829, lon: 91.7774 },
  { name: 'Munshiganj', division: 'Dhaka', lat: 23.5422, lon: 90.5305 },
  { name: 'Mymensingh', division: 'Mymensingh', lat: 24.7471, lon: 90.4203 },
  { name: 'Naogaon', division: 'Rajshahi', lat: 24.8281, lon: 88.9300 },
  { name: 'Narail', division: 'Khulna', lat: 23.1725, lon: 89.5127 },
  { name: 'Narayanganj', division: 'Dhaka', lat: 23.6238, lon: 90.5000 },
  { name: 'Narsingdi', division: 'Dhaka', lat: 23.9193, lon: 90.7176 },
  { name: 'Natore', division: 'Rajshahi', lat: 24.4206, lon: 89.0003 },
  { name: 'Netrokona', division: 'Mymensingh', lat: 24.8709, lon: 90.7279 },
  { name: 'Nilphamari', division: 'Rangpur', lat: 25.9318, lon: 88.8560 },
  { name: 'Noakhali', division: 'Chattogram', lat: 22.8246, lon: 91.1017 },
  { name: 'Pabna', division: 'Rajshahi', lat: 24.0064, lon: 89.2372 },
  { name: 'Panchagarh', division: 'Rangpur', lat: 26.3411, lon: 88.5542 },
  { name: 'Patuakhali', division: 'Barishal', lat: 22.3596, lon: 90.3299 },
  { name: 'Pirojpur', division: 'Barishal', lat: 22.5841, lon: 89.9720 },
  { name: 'Rajbari', division: 'Dhaka', lat: 23.7574, lon: 89.6445 },
  { name: 'Rajshahi', division: 'Rajshahi', lat: 24.3745, lon: 88.6042 },
  { name: 'Rangamati', division: 'Chattogram', lat: 22.7324, lon: 92.2985 },
  { name: 'Rangpur', division: 'Rangpur', lat: 25.7439, lon: 89.2752 },
  { name: 'Satkhira', division: 'Khulna', lat: 22.7185, lon: 89.0705 },
  { name: 'Shariatpur', division: 'Dhaka', lat: 23.2423, lon: 90.4348 },
  { name: 'Sherpur', division: 'Mymensingh', lat: 25.0205, lon: 90.0153 },
  { name: 'Sirajganj', division: 'Rajshahi', lat: 24.4534, lon: 89.7007 },
  { name: 'Sunamganj', division: 'Sylhet', lat: 25.0658, lon: 91.3950 },
  { name: 'Sylhet', division: 'Sylhet', lat: 24.8949, lon: 91.8687 },
  { name: 'Tangail', division: 'Dhaka', lat: 24.2513, lon: 89.9167 },
  { name: 'Thakurgaon', division: 'Rangpur', lat: 26.0337, lon: 88.4617 },
];

const DISTRICT_ALIASES: Record<string, string> = {
  barisal: 'Barishal',
  bogra: 'Bogura',
  chittagong: 'Chattogram',
  comilla: 'Cumilla',
  coxsbazar: "Cox's Bazar",
  coxbazar: "Cox's Bazar",
  jessore: 'Jashore',
  kushtiasadar: 'Kushtia',
};

const normalizeDistrictName = (value: string) =>
  value
    .toLowerCase()
    .replace(/district/g, '')
    .replace(/sadar/g, '')
    .replace(/[^a-z]/g, '');

export const findDistrictLocation = (
  districtName?: string | null
): DistrictLocation | undefined => {
  if (!districtName) return undefined;

  const normalized = normalizeDistrictName(districtName);
  const aliasName = DISTRICT_ALIASES[normalized];

  if (aliasName) {
    return BD_DISTRICTS.find((district) => district.name === aliasName);
  }

  return BD_DISTRICTS.find(
    (district) => normalizeDistrictName(district.name) === normalized
  );
};
