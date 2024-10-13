const APPSHEET_API_KEY = "V2-YhUgx-F4XHA-1Z3ic-fQOPK-kHKJr-xn4oK-nOkAz-OpXml";
const APPSHEET_APP_ID = "684f8775-18d4-4808-bdf7-b86410a44551";
const APPSHEET_REGION = "www.appsheet.com"; 



export const getAllProducts = async () => {
    const url = `https://${APPSHEET_REGION}/api/v2/apps/${APPSHEET_APP_ID}/tables/Productos/Action?applicationAccessKey=${APPSHEET_API_KEY}`;
    
    const body = {
      "Action": "Find",
      "Properties": {
        "Locale": "en-US",
        "Location": "47.623098, -122.330184", // Example location, can be changed
        "Timezone": "Pacific Standard Time"
      },
      "Rows": [] // This will return all rows
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      return data; // This will return all the product rows
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };