// static/js/auth_core.js
(function () {
  const AUTH_PATHS = ["/", "/register/"];

  function isAuthPage() {
    const p = window.location.pathname;
    return AUTH_PATHS.includes(p);
  }

  // auth бетинде гана иштесин
  if (!isAuthPage()) return;

  // 1) Кээ бир core.js'тер alert() колдонуп попап чыгарат
  //    Ошону auth бетинде өчүрүп коёбуз
  window.alert = function () {};

  // 2) core.js auth жок кезде корголгон endpointтерге тийбесин:
  //    токен жок болсо /companies, /currencies ж.б. чакырууларды "жасалма 200" кылып беребиз
  const originalFetch = window.fetch.bind(window);

  function hasAccessToken() {
    return !!localStorage.getItem("access");
  }

  function isProtectedApi(url) {
    // core.js кайсыны чакырарын так билбейбиз, бирок сенин логдо /companies бар
    return (
      url.includes("/api/v1/companies/") ||
      url.includes("/api/v1/currencies/") ||
      url.includes("/api/v1/profile/") ||
      url.includes("/api/v1/reports/") ||
      url.includes("/api/v1/transactions/") ||
      url.includes("/api/v1/accounts/")
    );
  }

  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : (input && input.url) || "";

    // preflight өтүп кетсин
    if ((init && init.method === "OPTIONS") || url.includes("OPTIONS")) {
      return originalFetch(input, init);
    }

    // auth бетинде токен жок болсо корголгон API'лерге барбайбыз
    if (!hasAccessToken() && isProtectedApi(url)) {
      // core.js күтүп калышы мүмкүн: массив же объект
      const fakeBody = url.includes("/companies/") ? "[]" : "{}";
      return new Response(fakeBody, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return originalFetch(input, init);
  };

  // 3) Эгер core.js өзүнүн “toast/notify” функциясын колдонсо — аларды да noop кылабыз
  // (аттары ар кандай болушу мүмкүн, ошон үчүн бир нечесин жаап коёбуз)
  const noop = function () {};
  window.showToast = noop;
  window.toast = noop;
  window.notify = noop;
  window.showError = noop;
})();