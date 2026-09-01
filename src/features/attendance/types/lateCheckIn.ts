export type LateCheckInStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LateCheckInUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface LateCheckInItem {
  _id: string;
  employee: LateCheckInUser;
  branch: string;
  requestDate: string;
  reason: string;
  status: LateCheckInStatus;
  reviewedBy?: LateCheckInUser;
  reviewedAt?: string;
  reviewRemarks?: string;
  createdAt: string;
}

export interface ReviewLateCheckInPayload {
  requestId: string;
  status: "APPROVED" | "REJECTED";
  remarks?: string;
}