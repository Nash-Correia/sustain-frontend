import Excel from 'exceljs';

// Updated interface to include the NSE Symbol and correct the data types
export interface CompanyDataRow {
  companyName: string;
  nseSymbol: string;
  isin: string;
  sector: string;
  marketCap: number;
  esgRating: string;
  esgScore: number;
}
export interface FundDataRow {
  fundName: string;
  score: number;
  percentage: string;
  grade: string;
}
// PortfolioCompany interface remains the same
export interface PortfolioCompany {
  isin: string;
  aum: number;
  esgScore: number;
  companyName: string;
}

export async function getCompanyData(): Promise<CompanyDataRow[]> {
  try {
    const response = await fetch('/data.xlsm'); // Assuming the file is renamed
    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet1 = workbook.getWorksheet('Sheet1');
    if (!worksheet1) {
      throw new Error("Worksheet 'Sheet1' not found.");
    }
    

    const data: CompanyDataRow[] = [];
    let headerSkipped = false;

    worksheet1.eachRow((row) => {
      if (!headerSkipped) {
        headerSkipped = true;
        return;
      }

      //COLUMN MAPPING
      const companyName = row.getCell('A').value as string;
      const nseSymbol = row.getCell('B').value as string; // Reading NSE Symbol from Column B
      const isin = row.getCell('C').value as string;      // Reading ISIN from Column C
      const sector = row.getCell('D').value as string;
      const marketCap = parseFloat(row.getCell('E').value as string);
      const esgRating = row.getCell('K').value as string;
      const esgScore = parseInt(row.getCell('J').value as string);

      if (companyName && isin && !isNaN(esgScore)) {
        data.push({ companyName, nseSymbol, isin, sector, marketCap, esgRating, esgScore });
      }
    });

    return data;
  } catch (error) {
    console.error("Failed to load or parse the Excel file:", error);
    return [];
  }
}
export async function getFundData(): Promise<FundDataRow[]> {
  try {
    const response = await fetch('/data.xlsm'); // Assuming the file is renamed
    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet2 = workbook.getWorksheet('Sheet1');
    if (!worksheet2) {
      throw new Error("Worksheet 'Sheet1' not found.");
    }
    

    const data: FundDataRow[] = [];
    let headerSkipped = false;

    worksheet2.eachRow((row) => {
      if (!headerSkipped) {
        headerSkipped = true;
        return;
      }

      //COLUMN MAPPING
      const fundName = row.getCell('A').value as string;
      const score = row.getCell('B').value as number 
      const percentage = row.getCell('C').value as string;      
      const grade = row.getCell('D').value as string;

      if (fundName && !isNaN(score)) {
        data.push({ fundName, score, percentage, grade});
      }
    });

    return data;
  } catch (error) {
    console.error("Failed to load or parse the Excel file:", error);
    return [];
  }
}