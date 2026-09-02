import { adminUserService } from "./admin.user.service";
import { adminExpertService } from "./admin.expert.service";
import { adminFarmService } from "./admin.farm.service";
import { marketplaceService } from "./admin.marketplace.service";
import { consultationService } from "./admin.consultation.service";

export const adminService = {
  ...adminUserService,
  ...adminExpertService,
  ...adminFarmService,
  ...marketplaceService,
  ...consultationService,
};