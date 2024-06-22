// script.js

document.addEventListener("DOMContentLoaded", () => {
  const uploadInput = document.getElementById("upload");
  const productContainer = document.getElementById("product-container");
  const productImage = document.getElementById("product-image");
  const badge = document.getElementById("badge");
  const downloadBtn = document.getElementById("download-btn");

  uploadInput.addEventListener("change", handleImageUpload);

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      productImage.src = e.target.result;
      productImage.onload = () => {
        productContainer.style.display = "inline-block";
        downloadBtn.style.display = "inline-block";

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = productImage.width;
        canvas.height = productImage.height;

        context.drawImage(
          productImage,
          0,
          0,
          productImage.width,
          productImage.height
        );
        const imageData = context.getImageData(
          0,
          0,
          productImage.width,
          productImage.height
        ).data;

        // Check top-left corner for white space
        const isTopLeftWhite = isCornerWhite(
          imageData,
          canvas.width,
          canvas.height,
          "top-left"
        );

        if (isTopLeftWhite) {
          badge.style.top = "10px";
          badge.style.left = "10px";
          badge.style.right = "unset";
        } else {
          badge.style.top = "10px";
          badge.style.left = "unset";
          badge.style.right = "10px";
        }
      };
    };
    reader.readAsDataURL(file);
  }

  downloadBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = productImage.width;
    canvas.height = productImage.height;

    // Redraw the image with the badge
    redrawImageWithBadge(canvas, context);

    // Create a data URL from the canvas
    const dataURL = canvas.toDataURL("image/png");

    // Create a link element and trigger a download
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "product_with_badge.png";
    link.click();
  });

  function isCornerWhite(data, width, height, corner) {
    const tolerance = 255; // Tolerance for considering a pixel white
    const threshold = 0.9; // 90% of the pixels in the corner should be white to consider it white
    const sampleSize = 50; // Number of pixels to check

    let whitePixelCount = 0;

    for (let i = 0; i < sampleSize; i++) {
      let x, y;
      if (corner === "top-left") {
        x = i % 10;
        y = Math.floor(i / 10);
      }

      const pixelIndex = (y * width + x) * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];

      if (r > tolerance && g > tolerance && b > tolerance) {
        whitePixelCount++;
      }
    }

    return whitePixelCount / sampleSize > threshold;
  }

  function redrawImageWithBadge(canvas, context) {
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the product image
    context.drawImage(productImage, 0, 0, canvas.width, canvas.height);

    // Get badge position and size
    const badgeRect = badge.getBoundingClientRect();
    const containerRect = productImage.getBoundingClientRect();
    const badgeX = badgeRect.left - containerRect.left;
    const badgeY = badgeRect.top - containerRect.top;

    // Draw the badge onto the canvas
    context.font = "14px Arial";
    context.fillStyle = "red";
    context.fillRect(badgeX, badgeY, badgeRect.width, badgeRect.height);
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      badge.textContent,
      badgeX + badgeRect.width / 2,
      badgeY + badgeRect.height / 2
    );
  }
});
