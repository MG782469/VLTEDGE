const response = async (category, productName) => {
  try {
    const query = encodeURIComponent(`${productName} ${category}`);

    const blinkit = `https://blinkit.com/s/?q=${query}`;
    const zepto = `https://www.zeptonow.com/search?query=${query}`;
    const bigbasket = `https://www.bigbasket.com/ps/?q=${query}`;

    return `${blinkit}\n${zepto}\n${bigbasket}`;
  } catch (error) {
    console.error("Error generating links:", error);
    return "Error fetching links.";
  }
};

export default response;
