const sharp = require("sharp");

const config = {
  image1Path: "./input/img1.png",
  image2Path: "./input/img2.png",
  outputPath: "./output/mergedImgs.png",
  direction: "horizontal", // "horizontal" ou "vertical"
  background: { r: 150, g: 150, b: 150, alpha: 1 },
  line: {
    thickness: 4,
    color: { r: 255, g: 255, b: 255, alpha: 1 },
    edgeMarginRatio: 0,
  },
  margins: {
    betweenImages: 200,
    external: 400,
  },
};

// Recorta bordas e retorna buffer + dimensões
async function getTrimmedBufferAndSize(buffer) {
  const trimmedBuffer = await sharp(buffer).trim().toBuffer();
  const metadata = await sharp(trimmedBuffer).metadata();
  return { buffer: trimmedBuffer, width: metadata.width, height: metadata.height };
}

// Redimensiona imagem 2 para se ajustar à proporção da imagem 1
function resizeToFit(originalMeta, targetMeta) {
  const aspectRatio = originalMeta.width / originalMeta.height;
  const targetRatio = targetMeta.width / targetMeta.height;

  if (aspectRatio > targetRatio) {
    const width = targetMeta.width;
    const height = Math.round(width / aspectRatio);
    return { width, height };
  } else {
    const height = targetMeta.height;
    const width = Math.round(height * aspectRatio);
    return { width, height };
  }
}

async function mergeImages() {
  try {
    const [buffer1Raw, buffer2Raw] = await Promise.all([
      sharp(config.image1Path).toBuffer(),
      sharp(config.image2Path).toBuffer(),
    ]);

    const meta1Raw = await sharp(buffer1Raw).metadata();
    const meta2Raw = await sharp(buffer2Raw).metadata();

    const trimmed1 = await getTrimmedBufferAndSize(buffer1Raw);

    const resized2Size = resizeToFit(meta2Raw, meta1Raw);
    const resizedBuffer2Raw = await sharp(buffer2Raw)
      .resize(resized2Size.width, resized2Size.height)
      .toBuffer();
    const trimmed2 = await getTrimmedBufferAndSize(resizedBuffer2Raw);

    // Cálculo de dimensões
    const isHorizontal = config.direction === "horizontal";
    const contentWidth = isHorizontal
      ? trimmed1.width + trimmed2.width + 2 * config.margins.betweenImages + config.line.thickness
      : Math.max(trimmed1.width, trimmed2.width);

    const contentHeight = isHorizontal
      ? Math.max(trimmed1.height, trimmed2.height)
      : trimmed1.height + trimmed2.height + 2 * config.margins.betweenImages + config.line.thickness;

    const outputWidth = contentWidth + 2 * config.margins.external;
    const outputHeight = contentHeight + 2 * config.margins.external;

    // Posicionamento das imagens
    const img1Left = isHorizontal
      ? config.margins.external
      : config.margins.external + Math.floor((contentWidth - trimmed1.width) / 2);

    const img1Top = isHorizontal
      ? config.margins.external + Math.floor((contentHeight - trimmed1.height) / 2)
      : config.margins.external;

    const img2Left = isHorizontal
      ? img1Left + trimmed1.width + 2 * config.margins.betweenImages + config.line.thickness
      : config.margins.external + Math.floor((contentWidth - trimmed2.width) / 2);

    const img2Top = isHorizontal
      ? config.margins.external + Math.floor((contentHeight - trimmed2.height) / 2)
      : img1Top + trimmed1.height + 2 * config.margins.betweenImages + config.line.thickness;

    // Linha separadora
    const lineLeft = isHorizontal
      ? img1Left + trimmed1.width + config.margins.betweenImages
      : config.margins.external + Math.round(contentWidth * config.line.edgeMarginRatio);

    const lineTop = isHorizontal
      ? config.margins.external + Math.round(contentHeight * config.line.edgeMarginRatio)
      : img1Top + trimmed1.height + config.margins.betweenImages;

    const lineWidth = isHorizontal
      ? config.line.thickness
      : Math.round((outputWidth - 2 * config.margins.external) * (1 - 2 * config.line.edgeMarginRatio));

    const lineHeight = isHorizontal
      ? Math.round((outputHeight - 2 * config.margins.external) * (1 - 2 * config.line.edgeMarginRatio))
      : config.line.thickness;

    const lineBuffer = await sharp({
      create: {
        width: lineWidth,
        height: lineHeight,
        channels: 4,
        background: config.line.color,
      },
    }).png().toBuffer();

    // Composição final
    await sharp({
      create: {
        width: outputWidth,
        height: outputHeight,
        channels: 4,
        background: config.background,
      },
    })
      .composite([
        { input: trimmed1.buffer, top: img1Top, left: img1Left },
        { input: trimmed2.buffer, top: img2Top, left: img2Left },
        { input: lineBuffer, top: lineTop, left: lineLeft },
      ])
      .png()
      .toFile(config.outputPath);

    console.log("✅ Imagem gerada com sucesso em:", config.outputPath);
  } catch (err) {
    console.error("❌ Erro ao gerar imagem:", err);
  }
}

mergeImages();
