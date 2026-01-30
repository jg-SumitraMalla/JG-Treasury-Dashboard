// services/pnlService.ts
const API_BASE_URL = "http://10.116.15.225:8080";
const API_HEADERS = {
  "client-id": "jainglobal",
  "secret-id": "940575d645433959676cf6a871bfd446438ab627ddf86f5499bf94bab417cac1",
  "Content-Type": "application/json", // optional, for JSON APIs
};

export interface PnlData {
    date: string;
    SOFR: number | null;
    CTC: number | null;
    NAV: number | null;
    DCF: number | null;
    Trailing_NAV_Ave: number | null;
    RFR_Run_Rate_on_NAV: number | null;
    Cum_RFR_Run_Rate_NAV: number | null;
    DoD: number | null;
    Weighted_Ave_Return: number | null;
    Weighted_Ave_Return_adj: number | null;
    Cash_at_Custodian_Ntl: number | null;
    MMF_Ntl: number | null;
    Cash_and_MMF_Ntl: number | null;
    RFR_on_Cash_and_MMF: number | null;
    Cum_RFR_Cash_and_MMF: number | null;
    CTC_CASH_REINVEST_MMF_ALL_YTD: number | null;
    CTC_CASH_REINVEST_MMF_ALL_DoD: number | null;
    Cash_and_MMF_Daily_Spread_to_SOFR: number | null;
    Ave_Spread_vs_SOFR_Cash_and_MMF: number | null;
    Repo_Ntl: number | null;
    RFR_on_Repo: number | null;
    CTC_CASH_REINVEST_REPO_ALL_YTD: number | null;
    CTC_CASH_REINVEST_REPO_ALL_DoD: number | null;
    Repo_Daily_Spread_to_SOFR: number | null;
    Ave_Spread_vs_SOFR_Repo: number | null;
    Eq_Box_Ntl: number | null;
    RFR_on_Eq_box: number | null;
    CTC_CASH_REINVEST_EQUITY_BOX_ALL_YTD: number | null;
    CTC_CASH_REINVEST_EQUITY_BOX_ALL_DoD: number | null;
    Eq_box_Daily_Spread_to_SOFR: number | null;
    Ave_Spread_vs_SOFR_Equity_Box: number | null;
  }
  export interface AssetPnlSummary1 {
    Asset: string;
    YTD_PnL: number;
    MTD_PnL: number;
    Current_Ntl: number;
    MTD_SOFR_Equiv: number;
    YTD_SOFR_Equiv: number;
    MTD_PnL_SOFR: number;
    YTD_PnL_SOFR: number;
    MTD_PnL_NAV: number;
    YTD_PnL_NAV: number;
    MTD_NAV_SOFR: number;
    YTD_NAV_SOFR: number;
    MTD_SOFR_Ann: number;
    YTD_SOFR_Ann: number;
  }
  export interface AssetPnlSummary2 {
    Asset: string;
    MTD: number;
    YTD: number;
  }
  export interface PnlGridResponse {
    table_1: AssetPnlSummary1[];
    table_2: AssetPnlSummary2[];
  }

export async function fetchPnlData(
  startDate: string,
  endDate: string,
  year: string
): Promise<PnlData[]> {
  const url = `${API_BASE_URL}/pnl_dashboard?start_date=${startDate}&end_date=${endDate}&year=${year}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: API_HEADERS, // <-- include client-id and secret-id here
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PnlData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching PnL data:", error);
    throw error;
  }
}

export async function fetchPnlDataByDate(
    selected_date: string
 
  ): Promise<PnlGridResponse> {
    // const url = `${API_BASE_URL_PROD}/pnl_dashboard/grid?selected_date=${selected_date}`;
    const url = `http://10.115.12.208:8080/pnl_dashboard/grid?selected_date=${selected_date}`;
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: API_HEADERS, // <-- include client-id and secret-id here
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: PnlGridResponse= await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching PnL data:", error);
      throw error;
    }
  }
