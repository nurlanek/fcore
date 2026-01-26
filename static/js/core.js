
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
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        ...options.headers
    };

    // Multi-tenancy үчүн маанилүү хедер [1, 2]
    if (companyId) {
        headers["X-Company-ID"] = companyId;
    }

    const response = await fetch(window.API_BASE + url, {
        ...options,
        headers: headers
    });

    if (response.status === 401) {
        window.location.href = "/";
        return;
    }

    // Эгер DELETE болсо, json() жок болушу мүмкүн
    if (response.status === 204) return null;

    return response.json();
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

    // ✅ company_id ар дайым коюлат
    if(!localStorage.getItem("company_id") && companies.length){
        localStorage.setItem("company_id", companies[0].company_id);
        console.log("Company ID set to:", companies[0].company_id);
    }

    const select = document.getElementById("companySelect");

    if(!select){
        console.log("companySelect not found on this page");
        return;
    }

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