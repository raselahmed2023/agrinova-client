import {
  apiRequest,
} from "./api.client";

import type {
  InvestmentApplication,
  InvestmentListResponse,
  InvestmentProject,
} from "@/types/investment";

/* ============================================================
   ADMIN INVESTMENT SERVICE
============================================================ */

export const investmentAdminService = {
  /* ==========================================================
     PROJECTS
  ========================================================== */

  async getProjects(
    queryString?: string
  ): Promise<
    InvestmentListResponse<InvestmentProject>
  > {
    return apiRequest<
      InvestmentListResponse<InvestmentProject>
    >(
      "/investments/admin/projects",
      "GET",
      undefined,
      queryString
    );
  },

  async getProject(
    projectId: string
  ): Promise<InvestmentProject> {
    return apiRequest<InvestmentProject>(
      `/investments/admin/projects/${projectId}`,
      "GET"
    );
  },

  async approveProject(
    projectId: string,
    adminNote?: string
  ): Promise<InvestmentProject> {
    return apiRequest<InvestmentProject>(
      `/investments/admin/projects/${projectId}/review`,
      "PATCH",
      {
        status:
          "APPROVED",

        ...(adminNote?.trim()
          ? {
              adminNote:
                adminNote.trim(),
            }
          : {}),
      }
    );
  },

  async rejectProject(
    projectId: string,
    adminNote: string
  ): Promise<InvestmentProject> {
    return apiRequest<InvestmentProject>(
      `/investments/admin/projects/${projectId}/review`,
      "PATCH",
      {
        status:
          "REJECTED",

        adminNote:
          adminNote.trim(),
      }
    );
  },

  /* ==========================================================
     INVESTMENT APPLICATIONS
  ========================================================== */

  async getApplications(
    queryString?: string
  ): Promise<
    InvestmentListResponse<InvestmentApplication>
  > {
    return apiRequest<
      InvestmentListResponse<InvestmentApplication>
    >(
      "/investments/admin/applications",
      "GET",
      undefined,
      queryString
    );
  },

  async approveApplication(
    applicationId: string,
    adminNote?: string
  ): Promise<InvestmentApplication> {
    return apiRequest<InvestmentApplication>(
      `/investments/admin/applications/${applicationId}/review`,
      "PATCH",
      {
        status:
          "APPROVED",

        ...(adminNote?.trim()
          ? {
              adminNote:
                adminNote.trim(),
            }
          : {}),
      }
    );
  },

  async rejectApplication(
    applicationId: string,
    adminNote: string
  ): Promise<InvestmentApplication> {
    return apiRequest<InvestmentApplication>(
      `/investments/admin/applications/${applicationId}/review`,
      "PATCH",
      {
        status:
          "REJECTED",

        adminNote:
          adminNote.trim(),
      }
    );
  },

  /* ==========================================================
     BANK PAYMENT REVIEW
  ========================================================== */

  async confirmBankPayment(
    applicationId: string,
    note?: string
  ): Promise<InvestmentApplication> {
    return apiRequest<InvestmentApplication>(
      `/investments/admin/applications/${applicationId}/payment-review`,
      "PATCH",
      {
        paymentStatus:
          "PAID",

        ...(note?.trim()
          ? {
              paymentAdminNote:
                note.trim(),
            }
          : {}),
      }
    );
  },

  async rejectBankPayment(
    applicationId: string,
    reason: string
  ): Promise<InvestmentApplication> {
    return apiRequest<InvestmentApplication>(
      `/investments/admin/applications/${applicationId}/payment-review`,
      "PATCH",
      {
        paymentStatus:
          "PAYMENT_REJECTED",

        paymentAdminNote:
          reason.trim(),
      }
    );
  },
};