import { PATHS } from "./paths.js";
import { gerarJSON, baixarJSON } from "./generator.js";

const cloudSelect = document.getElementById("cloud");
const preview = document.getElementById("preview");
const alertBox = document.getElementById("alert");
const form = document.getElementById("form");

function showToast(message = "Arquivo gerado com sucesso!") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  toastMessage.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

const clouds = ["VTEX","Shopify","Magento","WakeCommerce","Salesforce"];

cloudSelect.innerHTML = `<option value="">Selecione</option>` +
  clouds.map(c => `<option value="${c}">${c}</option>`).join("");

cloudSelect.addEventListener("change", () => {
  const cloud = cloudSelect.value;

  if (cloud === "WakeCommerce") {
    alertBox.innerText = "WakeCommerce ainda não possui implementação.";
    alertBox.classList.remove("hidden");
    form.classList.add("hidden");
    return;
  }

  alertBox.classList.add("hidden");
  form.classList.remove("hidden");

  preview.innerHTML = (PATHS[cloud] || [])
    .map(p => ` ${p}`).join("<br>");
});

document.getElementById("useDefault").addEventListener("change", (e)=>{
  document.getElementById("customPaths").classList.toggle("hidden", e.target.checked);
});

document.getElementById("generateBtn").addEventListener("click", ()=>{
  const cloud = cloudSelect.value;
  const teamIdInput = document.getElementById("teamId");
  const packageInput = document.getElementById("package");
  const errorBox = document.getElementById("errorMsg");

  const teamId = teamIdInput.value.trim();
  const packageName = packageInput.value.trim();

  errorBox.classList.add("hidden");
  teamIdInput.classList.remove("border-red-500");
  packageInput.classList.remove("border-red-500");

  let errors = [];

  if (!cloud) errors.push("Selecione o Cloud Commerce.");

  if (!teamId) {
    errors.push("TEAM ID é obrigatório.");
    teamIdInput.classList.add("border-red-500");
  }

  if (!packageName) {
    errors.push("Nome do pacote é obrigatório.");
    packageInput.classList.add("border-red-500");
  }

  if (errors.length > 0) {
    errorBox.textContent = errors.join("\n");
    errorBox.classList.remove("hidden");
    return;
  }

  let paths = document.getElementById("useDefault").checked
    ? PATHS[cloud]
    : document.getElementById("customPaths").value.split(",").map(p=>p.trim()).filter(Boolean);

  const excluir = document.getElementById("excludePaths").value
    .split(",").map(p=>p.trim()).filter(Boolean);

  const data = gerarJSON({
    paths,
    excluir,
    teamId,
    packageName,
    appclips: document.getElementById("appclips").checked
  });

  baixarJSON(data);
  showToast("Arquivo gerado com sucesso!");

  setTimeout(() => {

    // 🔄 RESET DA TELA
    document.getElementById("teamId").value = "";
    document.getElementById("package").value = "";
    document.getElementById("customPaths").value = "";
    document.getElementById("excludePaths").value = "";
    document.getElementById("appclips").checked = false;
    document.getElementById("useDefault").checked = true;

    document.getElementById("customPaths").classList.add("hidden");
    document.getElementById("preview").innerHTML = "";
    document.getElementById("errorMsg").classList.add("hidden");

    cloudSelect.value = "";
    form.classList.add("hidden");

  }, 800); 
});