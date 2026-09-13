import {
  apiRequest,
} from "./api.client";

import {
  adminUserService,
} from "./admin.user.service";

import {
  adminExpertService,
} from "./admin.expert.service";

import {
  adminFarmService,
} from "./admin.farm.service";

import {
  marketplaceService,
} from "./admin.marketplace.service";

import {
  consultationService,
} from "./admin.consultation.service";

export interface AdminRecentUser {
  _id: string;

  name: string;

  email: string;

  role:
    | "FARMER"
    | "EXPERT"
    | "ADMIN"
    | string;

  status:
    | "APPROVED"
    | "PENDING"
    | "REJECTED"
    | "BLOCKED"
    | string;

  createdAt?: string;
}

export interface AdminDashboardData {
  totalFarmers: number;

  totalExperts: number;

  pendingExpertApprovals: number;

  totalFarms: number;

  activeListings: number;

  totalConsultations: number;

  recentUsers: AdminRecentUser[];
}

export interface AdminAnalyticsData {
  users: {
    farmers: number;

    experts: number;

    admins: number;
  };

  farms: {
    total: number;

    active: number;

    inactive: number;
  };

  marketplace: {
    active: number;

    pending: number;

    outOfStock: number;

    disabled: number;

    removed: number;
  };

  consultations: {
    pending: number;

    accepted: number;

    scheduled: number;

    ongoing: number;

    completed: number;

    rejected: number;

    cancelled: number;
  };

  expertApprovals: {
    pending: number;

    approved: number;

    rejected: number;

    blocked: number;
  };
}

const getDashboard =
  async () =>
    apiRequest<AdminDashboardData>(
      "/admin/dashboard"
    );

const getAdminAnalytics =
  async () =>
    apiRequest<AdminAnalyticsData>(
      "/admin/analytics"
    );

export const adminService = {
  ...adminUserService,

  ...adminExpertService,

  ...adminFarmService,

  ...marketplaceService,

  ...consultationService,

  
  getDashboard,

  getAdminAnalytics,
};