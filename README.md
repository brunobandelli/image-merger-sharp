# 🖼️ Image Merger with Sharp

Este script permite **mesclar duas imagens** lado a lado (`horizontal`) ou empilhadas (`vertical`) com **ajuste proporcional automático**, **recorte de bordas**, **espaçamentos personalizáveis** e uma **linha divisória** entre elas. Tudo é feito com a biblioteca [Sharp](https://sharp.pixelplumbing.com/).

---

## 🚀 Como usar

1. **Clone o repositório** ou copie o script.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Coloque suas imagens na pasta `./input/` e ajuste os nomes no arquivo de configuração (`config`).
4. Execute o script:
   ```bash
   node merge.js
   ```

---

## ⚙️ Configuração

O script possui uma constante `config` no topo que define:

```js
const config = {
  image1Path: "./input/imagem1.png", // Caminho da imagem 1
  image2Path: "./input/imagem2.png", // Caminho da imagem 2
  outputPath: "./output/mergedImages.png", // Caminho da imagem final

  direction: "horizontal", // "horizontal" ou "vertical"

  background: { r: 150, g: 150, b: 150, alpha: 1 }, // Cor de fundo

  line: {
    thickness: 4, // Espessura da linha central
    color: { r: 255, g: 255, b: 255, alpha: 1 }, // Cor da linha central
    edgeMarginRatio: 0, // Margem relativa (0 a 1) para ajustar posição da linha
  },

  margins: {
    betweenImages: 200, // Espaço entre as imagens
    external: 400, // Espaço externo ao redor das imagens
  },
};
```

---

## 🧠 O que o script faz

1. **Lê e recorta as bordas** de ambas as imagens usando `sharp(...).trim()`.
2. **Redimensiona a segunda imagem** para manter a proporção com base na imagem 1 (sem corte).
3. **Calcula os tamanhos finais** da imagem de saída com base nos parâmetros definidos.
4. **Adiciona uma linha divisória** entre as imagens (personalizável).
5. **Gera uma nova imagem final** com tudo ajustado e salva no caminho indicado.

---

## ✅ Exemplo de saída

> Ao rodar o script, você verá no terminal:
```bash
✅ Imagem gerada com sucesso em: ./output/merged_imgs.png
```

---

## 🧩 Requisitos

- **Node.js** (v14+ recomendado)
- **Pacote `sharp`**
  ```bash
  npm install sharp
  ```

---
