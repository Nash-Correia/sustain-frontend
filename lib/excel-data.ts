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

      // CORRECTED COLUMN MAPPING
      const companyName = row.getCell('A').value as string;
      const nseSymbol = row.getCell('B').value as string; // Reading NSE Symbol from Column B
      const isin = row.getCell('C').value as string;      // Reading ISIN from Column C
      const sector = row.getCell('D').value as string;
      const marketCap = parseFloat(row.getCell('E').value as string);
      const esgRating = row.getCell('F').value as string;
      const esgScore = parseInt(row.getCell('G').value as string, 10);

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