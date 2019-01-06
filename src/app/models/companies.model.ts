export class RevenuePerWeekModel {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export class CompanyModel {
  id: number;
  name: string;
  type: string;
  revenuePerWeek: RevenuePerWeekModel;
  revenue: number;
  monthRevenue: number;
}

export class ItemModel {
  id: number;
  name: string;
  category: string;
  weekStats: RevenuePerWeekModel;
  balance: number;
  monthBalance: number;
}
