import Papa from "papaparse"

export interface PictureChartItem {
  name: string
  slNo: string
}

export async function fetchAndParseCsv(url: string): Promise<PictureChartItem[]> {
  const response = await fetch(url)
  const csvText = await response.text()

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        const items = results.data
          .filter((item: any) => item["Picture Chart Name"] && item["Sl. No"])
          .map((item: any) => ({
            name: item["Picture Chart Name"],
            slNo: item["Sl. No"],
          }))
        resolve(items)
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

