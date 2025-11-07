export const fetchBotResponse = async (data) => {
  if (!data?.idea) {
    console.error("No idea provided for bot response.");
    return null;
  }
  try {
    //process.env.REACT_APP_API_URL
    const response = await fetch(process.env.REACT_APP_API_URL+"/createdesign/getNextResponse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const apiResponse = await response.json();
    return apiResponse?.data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

export const generateEnhancedPrompt = async (idea, updatedAnswers, topics,user_inputs, productType, backgroundColor) => {

if (!idea) {
    console.error("No idea provided ");
    return null;
  }
  try {
    //process.env.REACT_APP_API_URL
    // const response = await fetch("http://13.43.136.172/api/createdesign/getNextResponse", {
    const response = await fetch(process.env.REACT_APP_API_URL+"/createdesign/generateEnhancedPrompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, answers: updatedAnswers, topics, user_inputs, productType, backgroundColor }),
    });

    const apiResponse = await response.json();
    return apiResponse?.data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};
