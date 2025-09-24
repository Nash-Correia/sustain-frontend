// lib/excel-data.ts
import Excel from 'exceljs';

export interface CompanyDataRow {
  companyName: string;
  sector: string;
  e_score: number;
  s_score: number;
  g_score: number;
  positive: string;
  negative: string;
  controversy: string;
  grade: string;
  isin: string;
  esgScore: number;
  composite:number;
}

export interface FundDataRow {
  fundName: string;
  score: number;
  percentage: string;
  grade: string;
}

export interface PortfolioCompany {
  isin: string;
  aum: number;
  esgScore: number;
  companyName: string;
}

function headerIndexMap(worksheet: Excel.Worksheet) {
  const map: Record<string, number> = {};
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell, colNumber) => {
    const text = (cell.value ?? '').toString().trim();
    if (text) map[text] = colNumber;
  });
  return map;
}

export async function getCompanyData(): Promise<CompanyDataRow[]> {
  try {
    const response = await fetch('/data.xlsx');
    if (!response.ok) throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet('Sheet-1');
    if (!worksheet) throw new Error("Worksheet 'Sheet-1' not found.");

    const idx = headerIndexMap(worksheet);

    const get = (row: Excel.Row, headerName: string) => {
      const col = idx[headerName];
      if (!col) return '';
      const v = row.getCell(col).value;
      // handle Excel types (rich text / numbers / null)
      return v === null || v === undefined ? '' : v;
    };

    const data: CompanyDataRow[] = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const companyName = String(get(row, 'Company Name') || '').trim();
      const sector = String(get(row, 'Sector') || '').trim();
      const e_score = Number(get(row, 'E Pillar') || 0) || 0;
      const s_score = Number(get(row, 'S Pillar') || 0) || 0;
      const g_score = Number(get(row, 'G Pillar') || 0) || 0;
      const positive = String(get(row, 'Positive Screen') || '').trim();
      const negative = String(get(row, 'Negative Screen') || '').trim();
      const controversy = String(get(row, 'Controversy Rating') || '').trim();
      const grade = String(get(row, 'ESG Rating') || '').trim();
      const isin = String(get(row, 'ISIN') || '').trim();
      const esgScore = Number(get(row, 'ESG Pillar') || 0) || 0;
      const composite = Number(get(row, 'Composite Rating') || 0) || 0;

      // Use same inclusion logic as before
      if (companyName) {
        data.push({
          companyName,
          sector,
          e_score,
          s_score,
          g_score,
          positive,
          negative,
          controversy,
          grade,
          isin,
          esgScore,
          composite,
        });
      }
    });

    return data;
  } catch (error) {
    console.error('Failed to load or parse company data from Excel:', error);
    return [];
  }
}

export async function getFundData(): Promise<FundDataRow[]> {
  try {
    const response = await fetch('/data.xlsx');
    if (!response.ok) throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet('Sheet-2');
    if (!worksheet) throw new Error("Worksheet 'Sheet-2' not found.");

    const idx = headerIndexMap(worksheet);
    const data: FundDataRow[] = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;
      const fundName = String(row.getCell(idx['Fund Name'] || 1).value || '').trim();
      const score = Number(row.getCell(idx['Score'] || 2).value || 0) || 0;
      const percentage = String(row.getCell(idx['Percentage'] || 3).value || '').trim();
      const grade = String(row.getCell(idx['Grade'] || 4).value || '').trim();

      if (fundName) data.push({ fundName, score, percentage, grade });
    });

    return data;
  } catch (error) {
    console.error('Failed to load or parse fund data from Excel:', error);
    return [];
  }
}
