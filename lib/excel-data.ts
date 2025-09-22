import Excel from 'exceljs';

// Interface for company data from Sheet1
export interface CompanyDataRow {
  companyName: string;
  sector: string;
  e_score: number;
  s_score: number;
  g_score: number;
  screen: number;
  controversy_screen: number;
  grade: string;
  isin: string;
  esgScore: number;
}

// Interface for fund data from Sheet2
export interface FundDataRow {
  fundName: string;
  score: number;
  percentage: string;
  grade: string;
}

// Kept from old implementation, seems useful for custom portfolio
export interface PortfolioCompany {
  isin: string;
  aum: number;
  esgScore: number;
  companyName: string;
}

/**
 * Fetches and parses company data from Sheet1 of the Excel file.
 * @returns {Promise<CompanyDataRow[]>} A promise that resolves to an array of company data.
 */
export async function getCompanyData(): Promise<CompanyDataRow[]> {
  try {
    const response = await fetch('/data.xlsm');
    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet('Sheet1'); // Explicitly using Sheet1
    if (!worksheet) {
      throw new Error("Worksheet 'Sheet1' not found.");
    }
    
    const data: CompanyDataRow[] = [];
    // Assuming headers are in the first row and data starts from the second
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      // COLUMN MAPPING based on new schema
      const companyName = String(row.getCell('A').value || '');
      const e_score = +(row.getCell('E').value || 0);
      const s_score = +(row.getCell('F').value || 0);
      const g_score = +(row.getCell('G').value || 0);
      const screen = +(row.getCell('H').value || '');
      const controversy_screen = +(row.getCell('I').value || '');
      const sector = String(row.getCell('D').value || '');
      const grade = String(row.getCell('K').value || '');
      const isin = String(row.getCell('C').value || ''); // Assuming ISIN is here
      const esgScore = +(row.getCell('J').value || 0); // Assuming composite score is here

      if (companyName && sector && grade) {
        data.push({ 
            companyName, 
            sector, 
            e_score, 
            s_score, 
            g_score, 
            screen,  
            controversy_screen, 
            grade,
            isin,
            esgScore
        });
      }
    });

    return data;
  } catch (error) {
    console.error("Failed to load or parse company data from Excel:", error);
    return [];
  }
}

/**
 * Fetches and parses fund data from Sheet2 of the Excel file.
 * @returns {Promise<FundDataRow[]>} A promise that resolves to an array of fund data.
 */
export async function getFundData(): Promise<FundDataRow[]> {
  try {
    const response = await fetch('/data.xlsm');
    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet('Sheet2'); // Explicitly using Sheet2
    if (!worksheet) {
      throw new Error("Worksheet 'Sheet2' not found.");
    }
    
    const data: FundDataRow[] = [];
    // Assuming headers are in the first row and data starts from the second
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      //COLUMN MAPPING
      const fundName = String(row.getCell('A').value || '');
      const score = +(row.getCell('B').value || 0);
      const percentage = String(row.getCell('C').value || '');      
      const grade = String(row.getCell('D').value || '');

      if (fundName && !isNaN(score)) {
        data.push({ fundName, score, percentage, grade});
      }
    });

    return data;
  } catch (error) {
    console.error("Failed to load or parse fund data from Excel:", error);
    return [];
  }
}

