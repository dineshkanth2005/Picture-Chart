import Papa from 'papaparse';

export interface PictureChartItem {
  name: string;
  slNo: string;
}

interface CSVRow {
  'Picture Chart Name': string;
  'Sl. No': string;
  [key: string]: string;
}

export async function fetchAndParseCsv(url: string): Promise<PictureChartItem[]> {
  const response = await fetch(url);
  const csvText = await response.text();
  
  return new Promise<PictureChartItem[]>((resolve, reject) => {
    Papa.parse<CSVRow>(csvText, {
      header: true,
      complete: (results) => {
        const items = results.data
          .filter(item => item['Picture Chart Name'] && item['Sl. No'])
          .map(item => ({
            name: item['Picture Chart Name'],
            slNo: item['Sl. No']
          }));
        resolve(items);
      },
      error: (error: Papa.ParseError) => {
        reject(error);
      }
    });
  });
}
