document.addEventListener("DOMContentLoaded", () => {
  const inputFiles = document.getElementById("jpeg-files");
  const fileListDiv = document.getElementById("file-list");
  const convertForm = document.getElementById("convert-form");
  const nomeInput = document.getElementById("nome-pdf");

  let selectedFiles = [];

  inputFiles.addEventListener("change", (e) => {
    const novosArquivos = Array.from(e.target.files);

    // Evita duplicados
    novosArquivos.forEach((novo) => {
      const existe = selectedFiles.some(
        (file) =>
          file.name === novo.name &&
          file.size === novo.size &&
          file.lastModified === novo.lastModified
      );
      if (!existe) selectedFiles.push(novo);
    });

    mostrarLista();
    inputFiles.value = "";
  });

  function mostrarLista() {
    fileListDiv.innerHTML = "";

    if (selectedFiles.length === 0) {
      fileListDiv.innerHTML = "<p>Nenhuma imagem selecionada.</p>";
      return;
    }

    const ul = document.createElement("ul");
    ul.id = "sortable-list";

    selectedFiles.forEach((file, index) => {
      const li = document.createElement("li");
      li.classList.add("sortable-item");
      li.textContent = file.name;
      li.dataset.index = index;
      ul.appendChild(li);
    });

    fileListDiv.appendChild(ul);

    Sortable.create(ul, {
      animation: 150,
      ghostClass: "sortable-ghost",
      onEnd: (evt) => {
        const [movedFile] = selectedFiles.splice(evt.oldIndex, 1);
        selectedFiles.splice(evt.newIndex, 0, movedFile);
        mostrarLista();
      },
    });
  }

  convertForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Selecione pelo menos uma imagem JPEG.");
      return;
    }

    let nomeArquivo = nomeInput.value.trim();
    if (!nomeArquivo) nomeArquivo = "imagens.pdf";
    else if (!nomeArquivo.toLowerCase().endsWith(".pdf")) nomeArquivo += ".pdf";

    try {
      const pdfDoc = await PDFLib.PDFDocument.create();

      for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const img = await pdfDoc.embedJpg(arrayBuffer);
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        });
      }

      const pdfBytes = await pdfDoc.save();

      baixarPDF(pdfBytes, nomeArquivo);
    } catch (err) {
      alert("Erro ao converter imagens: " + err.message);
      console.error(err);
    }
  });

  function baixarPDF(bytes, nomeArquivo) {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }
});
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os elementos com atributo data-pagina
  const botoesNavegacao = document.querySelectorAll("[data-pagina]");

  botoesNavegacao.forEach((botao) => {
    botao.style.cursor = "pointer"; // muda o cursor para indicar que é clicável

    botao.addEventListener("click", () => {
      const destino = botao.getAttribute("data-pagina");
      if (destino) {
        window.location.href = destino;
      }
    });
  });
});
