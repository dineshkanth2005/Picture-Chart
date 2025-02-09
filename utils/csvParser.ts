export interface PictureChartItem {
  name: string;
  slNo: string;
}

export async function fetchAndParseCsv(url: string): Promise<PictureChartItem[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Split the CSV text into lines
    const lines = text.split('\n');
    
    // Remove header row and empty lines
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    // Parse each line into an object
    const items: PictureChartItem[] = dataLines.map(line => {
      const [name, slNo] = line.split(',').map(item => item.trim());
      return {
        name: name?.replace(/^"|"$/g, '') || '',  // Remove quotes if present
        slNo: slNo?.replace(/^"|"$/g, '') || ''
      };
    }).filter(item => item.name && item.slNo); // Filter out invalid entries
    
    return items;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
}
