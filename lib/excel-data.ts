import Excel from 'exceljs';

// Define the structure of a row from the Excel file
export interface CompanyDataRow {
  companyName: string;
  isin: string;
  sector: string;
  marketCap: number;
  esgRating: string;
  esgScore: number;
}

// DEFINE THE PORTFOLIOCOMPANY TYPE HERE
export interface PortfolioCompany {
  isin: string;
  aum: number;
  esgScore: number;
  companyName: string;
}


// The function to get the data remains the same
export async function getCompanyData(): Promise<CompanyDataRow[]> {
  try {
    const response = await fetch('/data.xlsm');
    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet('Sheet1');
    if (!worksheet) {
      throw new Error("Worksheet 'Sheet1' not found.");
    }

    const data: CompanyDataRow[] = [];
    let headerSkipped = false;

    worksheet.eachRow((row) => {
      if (!headerSkipped) {
        headerSkipped = true;
        return;
      }

      const companyName = row.getCell('A').value as string;
      const isin = row.getCell('B').value as string;
      const sector = row.getCell('C').value as string;
      const marketCap = parseFloat(row.getCell('D').value as string);
      const esgRating = row.getCell('E').value as string;
      const esgScore = parseInt(row.getCell('F').value as string, 10);

      if (companyName && isin && !isNaN(esgScore)) {
        data.push({ companyName, isin, sector, marketCap, esgRating, esgScore });
      }
    });

    return data;
  } catch (error) {
    console.error("Failed to load or parse the Excel file:", error);
    return [];
  }
}