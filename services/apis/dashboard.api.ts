import http from '@/services/http';

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard`;

export interface AdminDashboardData {
  totalUsers: number;
  totalCustomers: number;
  activeCustomers: number;
  subscriptionExpiredCustomers: number;
  totalConsultants: number;
  activeConsultants: number;
}

export interface ConsultantDashboardData {
  totalCustomers: number;
  activeCustomers: number;
  subscriptionExpiredCustomers: number;
}

export interface DashboardResponse {
  status: number;
  message: string;
  data: AdminDashboardData;
}

export interface ConsultantDashboardResponse {
  status: number;
  message: string;
  data: ConsultantDashboardData;
}

export const getAdminDashboardData = async (): Promise<DashboardResponse> => {
  const response = await http.get(`${baseUrl}/admin`);
  return response.data;
};

export const getConsultantDashboardData =
  async (): Promise<ConsultantDashboardResponse> => {
    const response = await http.get(`${baseUrl}/consutant`);
    return response.data;
  };
