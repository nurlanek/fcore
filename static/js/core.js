
window.API_BASE = "http://127.0.0.1:8001";

(function(){
    const publicPaths = ["/", "/register/"];

    const currentPath = window.location.pathname;

    if(!publicPaths.includes(currentPath)){
        if(!localStorage.getItem("access")){
            window.location.href = "/";
        }
    }
})();


function logout(){
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("company_id");

    location.href = "/";
}
// 1. Бардык суроо-талаптар үчүн бирдиктүү функция
async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("access");
  const companyId = localStorage.getItem("company_id");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (token) headers["Authorization"] = "Bearer " + token;
  if (companyId) headers["X-Company-ID"] = companyId;

  const res = await fetch(window.API_BASE + url, { ...options, headers });

  // 401 болсо логинге
  if (res.status === 401) {
    window.location.href = "/";
    return null;
  }

  // 204 no content
  if (res.status === 204) return null;

  // JSON окуйбуз (кээде text болушу мүмкүн)
  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) data = await res.json();
  else data = await res.text();

  // ✅ 200-299 эмес болсо: error object кайтарабыз
  if (!res.ok) {
    console.error("API error", res.status, data);
    return { __error: true, status: res.status, data };
  }

  return data;
}


// 2. Валюталарды жүктөө (Глобалдык версия) [4-6]
async function loadCurrenciesGlobal(elementId) {
    const data = await apiFetch("/api/v1/currencies/");
    const sel = document.getElementById(elementId);
    if (!sel) return;

    sel.innerHTML = "";
    data.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id || c.code; // Модельге жараша ID же Code [7, 8]
        opt.textContent = `${c.code} - ${c.name}`;
        sel.appendChild(opt);
    });
}


async function loadCompaniesGlobal(){
      console.log("Loading companies...");

      const companies = await apiFetch("/api/v1/companies/");
      console.log("Companies:", companies);

      // ✅ Эгер ката болсо
      if (!companies || companies.__error) {
        alert("Companies API error: " + (companies?.status || "unknown"));
        return;
      }

      // ✅ Эгер массив эмес болсо
      if (!Array.isArray(companies)) {
        console.error("Expected array, got:", companies);
        alert("Server returned unexpected data формат.");
        return;
      }

      if(!localStorage.getItem("company_id") && companies.length){
        localStorage.setItem("company_id", companies[0].company_id);
      }

      const select = document.getElementById("companySelect");
      if(!select) return;

      select.innerHTML = "";
      companies.forEach(c=>{
        const opt = document.createElement("option");
        opt.value = c.company_id;
        opt.textContent = c.company_name;
        select.appendChild(opt);
      });

      select.value = localStorage.getItem("company_id");

      select.onchange = function(){
        localStorage.setItem("company_id", this.value);
        location.reload();
      }
    }


document.addEventListener("DOMContentLoaded", ()=>{
    console.log("Base JS loaded");
    loadCompaniesGlobal();
});