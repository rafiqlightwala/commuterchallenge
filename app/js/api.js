// api.js
export async function getCommuterModes() {
  const apiEndpoint = "http://localhost:4000/v1/utility/commutermodes";

  try {
      const response = await fetch(apiEndpoint, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const returnedData = await response.json();
      return returnedData.commuterModes; // Assuming 'commuterModes' is the relevant part of the returned data
  } catch (error) {
      console.error('Fetch error:', error);
      //throw error; // Rethrow the error if you want to handle it outside
  }
}
