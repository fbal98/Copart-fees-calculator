document.addEventListener("DOMContentLoaded", async () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const form = document.getElementById("auction-form");
  const bidInput = document.getElementById("auction-bid");
  const bidError = document.getElementById("bid-error");
  const totalImportFees = document.getElementById("total-import-fees");
  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark")) {
      body.classList.remove("dark");
      themeToggle.textContent = "🌚";
    } else {
      body.classList.add("dark");
      themeToggle.textContent = "☀️";
    }
  });

  form.addEventListener("input", () => {
    calculateFees();
  });

  let copartFeesMapping = [];
  try {
    copartFeesMapping = await loadJsonFile("copart_fees.json");
  } catch (error) {
    console.error("Error loading copart fees json file", error);
  }

  function calculateFees() {
    const copartFee = document.getElementById("copart-fee");
    const finalPrice = document.getElementById("final-price");
    const auctionBid = parseFloat(bidInput.value);
    const shippingPrice = parseFloat(
      document.getElementById("shipping-price").value
    );
    const tax = document.getElementById("tax");
    const customs = document.getElementById("customs");

    const currencyRate = parseFloat(
      document.getElementById("currency-rate").value
    );
    const isAmericanCar = document.getElementById("american-car").checked;

    switch (true) {
      case isNaN(auctionBid):
        bidError.textContent = "Please enter a valid number";
        bidError.style.display = "block";
        return;
      case auctionBid < 0:
        bidError.textContent = "Please enter a positive number";
        bidError.style.display = "block";
        return;
      case auctionBid === 0:
        bidError.textContent = "Please enter a number greater than 0";
        bidError.style.display = "block";
        return;
      default:
        bidError.textContent = "";
        bidError.style.display = "none";
    }
    //calculate fees

    let customsValue = isAmericanCar ? 0 : 0.05 * auctionBid;
    let taxValue = 0.05 * auctionBid;
    let finalPriceValue = 0;

    let copartFeeValue = calculateCopartFee(copartFeesMapping, auctionBid);

    //set values
    tax.textContent = taxValue.toFixed(3);
    customs.textContent = customsValue.toFixed(3);
    copartFee.textContent = copartFeeValue;
    totalImportFees.textContent = (customsValue + taxValue).toFixed(3);

    finalPriceValue =
      auctionBid * currencyRate +
      shippingPrice +
      customsValue +
      taxValue +
      copartFeeValue;
    finalPrice.textContent = finalPriceValue;
  }
});

const loadJsonFile = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

const calculateCopartFee = (copartFeesMapping, auctionBid) => {
  const fee = copartFeesMapping.find((fee) => {
    return auctionBid >= fee.minBid && auctionBid <= fee.maxBid;
  });
  console.log(fee.fees.totalFee);
  return fee.fees.totalFee;
};
