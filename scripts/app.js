(() => {
  "use strict";
  const CONFIG = window.ALPHA_CONFIG || { whatsappNumber: "" };
  if (CONFIG.logoPath) {
    document.querySelectorAll(".brand-logo").forEach((logo) => {
      logo.src = CONFIG.logoPath;
    });
  }
  const phoneNumber = String(CONFIG.whatsappNumber || "").replace(/\D/g, "");
  const DEFAULT_MESSAGE =
    "Olá! Gostaria de solicitar uma cotação de transporte com a Alpha Log.";

  /** Configured recipient or WhatsApp share intent (demo fallback). */
  function whatsAppUrl(message) {
    const prefix = phoneNumber
      ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=`
      : "https://api.whatsapp.com/send?text=";
    return `${prefix}${encodeURIComponent(message)}`;
  }

  for (const link of document.querySelectorAll("[data-whatsapp]")) {
    const isQuestion = link.closest(".faq-intro") !== null;
    link.href = whatsAppUrl(
      isQuestion
        ? "Olá! Gostaria de tirar uma dúvida sobre o transporte com a Alpha Log."
        : DEFAULT_MESSAGE,
    );
    if (phoneNumber) link.removeAttribute("title");
    else
      link.title =
        "Modo demonstração: selecione manualmente o contato no WhatsApp. Para envio comercial, configure o número em scripts/config.js.";
  }

  const menuButton = document.querySelector("#menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  if (menuButton && mobileMenu) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
      mobileMenu.hidden = true;
      document.body.classList.remove("menu-open");
    };
    menuButton.addEventListener("click", () => {
      const shouldOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(shouldOpen));
      menuButton.setAttribute(
        "aria-label",
        shouldOpen ? "Fechar menu" : "Abrir menu",
      );
      mobileMenu.hidden = !shouldOpen;
      document.body.classList.toggle("menu-open", shouldOpen);
    });
    mobileMenu
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileMenu.hidden) {
        closeMenu();
        menuButton.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 940 && !mobileMenu.hidden) closeMenu();
    });
  }

  document.querySelector("#year").textContent = String(
    new Date().getFullYear(),
  );
  // Exemplos de origem/destino são atalhos de cotação, não confirmação de rota operacional.
  document
    .querySelectorAll("[data-route-origin][data-route-destination]")
    .forEach((link) => {
      link.addEventListener("click", () => {
        const from = document.getElementById("origem");
        const to = document.getElementById("destino");
        from.value = link.dataset.routeOrigin;
        to.value = link.dataset.routeDestination;
        [from, to].forEach((input) =>
          input.dispatchEvent(new Event("input", { bubbles: true })),
        );
      });
    });

  // Mapa comercial explorável: os volumes são apenas números de demonstração.
  // A classificação de cobertura é derivada do briefing, não de uma base operacional.
  const mapElement = document.querySelector(".brazil-map");
  const stateSelector = document.querySelector("#map-state-select");
  const hoverTooltip = document.querySelector("#map-hover-tooltip");
  if (mapElement && stateSelector) {
    const monthlyDemo = Object.freeze({
      AC: 11,
      AL: 25,
      AM: 37,
      AP: 8,
      BA: 107,
      CE: 96,
      DF: 151,
      ES: 205,
      GO: 437,
      MA: 58,
      MG: 691,
      MS: 298,
      MT: 227,
      PA: 55,
      PB: 22,
      PE: 88,
      PI: 30,
      PR: 489,
      RJ: 398,
      RN: 28,
      RO: 24,
      RR: 7,
      RS: 319,
      SC: 304,
      SE: 18,
      SP: 812,
      TO: 40,
    });
    const originStates = new Set(["SP", "MG", "GO", "PR"]);
    const priorityStates = new Set(["RJ", "ES", "MS", "MT", "DF", "RS", "SC"]);
    const statePaths = [...mapElement.querySelectorAll(".map-state[data-uf]")];
    const stateMap = new Map(statePaths.map((path) => [path.dataset.uf, path]));
    const regionFor = (uf) =>
      ({
        AC: "Norte",
        AL: "Nordeste",
        AM: "Norte",
        AP: "Norte",
        BA: "Nordeste",
        CE: "Nordeste",
        DF: "Centro-Oeste",
        ES: "Sudeste",
        GO: "Centro-Oeste",
        MA: "Nordeste",
        MG: "Sudeste",
        MS: "Centro-Oeste",
        MT: "Centro-Oeste",
        PA: "Norte",
        PB: "Nordeste",
        PE: "Nordeste",
        PI: "Nordeste",
        PR: "Sul",
        RJ: "Sudeste",
        RN: "Nordeste",
        RO: "Norte",
        RR: "Norte",
        RS: "Sul",
        SC: "Sul",
        SE: "Nordeste",
        SP: "Sudeste",
        TO: "Norte",
      })[uf] || "Brasil";
    const stateName = (uf) =>
      stateMap.get(uf)?.querySelector("title")?.textContent || uf;
    const stateLabel = (uf) =>
      originStates.has(uf)
        ? `Origem estratégica · ${regionFor(uf)}`
        : priorityStates.has(uf)
          ? `Região com maior atuação · ${regionFor(uf)}`
          : `Destino nacional sujeito a consulta · ${regionFor(uf)}`;
    const detailName = document.querySelector("#map-active-state");
    const detailProfile = document.querySelector("#map-active-profile");
    const detailCount = document.querySelector("#map-active-trips");
    const quoteLink = document.querySelector("#map-quote-link");
    const tooltipTitle = document.querySelector("#map-tooltip-title");
    const tooltipAmount = document.querySelector("#map-tooltip-amount");
    const graphic = document.querySelector(".coverage-map-graphic");
    const ptBR = new Intl.NumberFormat("pt-BR");
    const stateIds = [...stateMap.keys()].sort((a, b) =>
      stateName(a).localeCompare(stateName(b), "pt-BR"),
    );
    for (const uf of stateIds) {
      const option = document.createElement("option");
      option.value = uf;
      option.textContent = `${stateName(uf)} (${uf})`;
      stateSelector.append(option);
    }
    let pinned = "SP";
    const hoverEnabled = window.matchMedia(
      "(hover:hover) and (pointer:fine)",
    ).matches;
    function render(uf) {
      const name = stateName(uf);
      detailName.textContent = name + " ";
      const abbr = document.createElement("span");
      abbr.textContent = uf;
      detailName.append(abbr);
      detailProfile.textContent = stateLabel(uf);
      detailCount.textContent = ptBR.format(monthlyDemo[uf]);
      const origin = originStates.has(uf);
      quoteLink.textContent = origin
        ? `Cotar com origem em ${uf} ↗`
        : `Consultar destino em ${uf} ↗`;
      statePaths.forEach((path) =>
        path.classList.toggle(
          "is-preview",
          path.dataset.uf === uf && uf !== pinned,
        ),
      );
    }
    function pinState(uf, focusPath = false) {
      if (!stateMap.has(uf)) return;
      pinned = uf;
      stateSelector.value = uf;
      for (const path of statePaths) {
        const isSelected = path.dataset.uf === uf;
        path.setAttribute("aria-pressed", String(isSelected));
        path.tabIndex = isSelected ? 0 : -1;
        path.classList.toggle("is-selected", isSelected);
      }
      render(uf);
      if (focusPath) stateMap.get(uf).focus();
    }
    function moveTooltip(event) {
      if (hoverTooltip.hidden) return;
      const bounds = graphic.getBoundingClientRect();
      const x = event.clientX - bounds.left + 12;
      const y = event.clientY - bounds.top - 54;
      const tipWidth = hoverTooltip.offsetWidth || 195;
      const tipHeight = hoverTooltip.offsetHeight || 56;
      const left = Math.max(8, Math.min(x, bounds.width - tipWidth - 8));
      const top = Math.max(8, Math.min(y, bounds.height - tipHeight - 8));
      hoverTooltip.style.left = `${left}px`;
      hoverTooltip.style.top = `${top}px`;
    }
    for (const path of statePaths) {
      const uf = path.dataset.uf;
      path.addEventListener("pointerenter", (event) => {
        if (!hoverEnabled) return;
        render(uf);
        tooltipTitle.textContent = `${stateName(uf)} (${uf})`;
        tooltipAmount.textContent = `${ptBR.format(monthlyDemo[uf])} transportes/mês · exemplo`;
        hoverTooltip.hidden = false;
        moveTooltip(event);
      });
      path.addEventListener("pointermove", (event) => {
        if (hoverEnabled) moveTooltip(event);
      });
      path.addEventListener("pointerleave", () => {
        hoverTooltip.hidden = true;
        render(pinned);
      });
      path.addEventListener("click", () => pinState(uf));
      path.addEventListener("focus", () => render(uf));
      path.addEventListener("blur", () => render(pinned));
      path.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          pinState(uf);
        } else if (
          [
            "ArrowRight",
            "ArrowDown",
            "ArrowLeft",
            "ArrowUp",
            "Home",
            "End",
          ].includes(event.key)
        ) {
          event.preventDefault();
          const i = stateIds.indexOf(uf);
          let next = uf;
          if (event.key === "Home") next = stateIds[0];
          else if (event.key === "End") next = stateIds[stateIds.length - 1];
          else
            next =
              stateIds[
                (i +
                  (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) +
                  stateIds.length) %
                  stateIds.length
              ];
          pinState(next, true);
        }
      });
    }
    stateSelector.addEventListener("change", () =>
      pinState(stateSelector.value),
    );
    // O CTA apenas leva ao formulário, sem alegar cotação nem confirmar a rota.
    quoteLink.addEventListener("click", () => {
      const target = document.querySelector(
        originStates.has(pinned) ? "#origem" : "#destino",
      );
      if (target)
        window.setTimeout(() => target.focus({ preventScroll: true }), 250);
    });
    pinState("SP");
  }

  // Contadores animam apenas uma vez, quando a área de prova operacional é vista.
  // Os valores finais permanecem no HTML para situações sem JavaScript.
  const statNumbers = [
    ...document.querySelectorAll(".stat-number[data-count]"),
  ];
  const statsGrid = document.querySelector("#stats-grid");
  if (statsGrid && statNumbers.length) {
    const numberFormat = new Intl.NumberFormat("pt-BR");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let started = false;
    const animate = () => {
      if (started) return;
      started = true;
      if (reducedMotion) return;
      const start = performance.now();
      const duration = 1700;
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        statNumbers.forEach((node) => {
          const finalValue = Number(node.dataset.count);
          const value = Math.round(finalValue * easeOut);
          node.innerHTML = `${numberFormat.format(value)}<span>${node.dataset.suffix || ""}</span>`;
        });
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            animate();
          }
        },
        { threshold: 0.25 },
      );
      observer.observe(statsGrid);
    } else animate();
  }

  const form = document.querySelector("#quote-form");
  const summary = document.querySelector("#form-errors");
  const status = document.querySelector("#form-status");
  const phone = document.querySelector("#telefone");
  const required = [
    "nome",
    "empresa",
    "telefone",
    "origem",
    "destino",
    "carga",
  ];
  const labels = {
    nome: "Informe seu nome.",
    empresa: "Informe sua empresa.",
    telefone: "Informe um telefone válido com DDD.",
    origem: "Informe a cidade/UF de origem.",
    destino: "Informe a cidade/UF de destino.",
    carga: "Selecione um tipo de carga.",
  };

  function formatBrazilianPhone(value) {
    let digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  phone.addEventListener("input", () => {
    phone.value = formatBrazilianPhone(phone.value);
    clearError(phone);
  });
  for (const id of required) {
    const control = document.getElementById(id);
    control.addEventListener("input", () => clearError(control));
    control.addEventListener("change", () => clearError(control));
  }
  function clearError(control) {
    control.removeAttribute("aria-invalid");
    const hint = document.querySelector(`#${control.id}-error`);
    if (hint) hint.textContent = "";
    if (!form.querySelector('[aria-invalid="true"]')) summary.hidden = true;
  }
  function markError(control, msg) {
    control.setAttribute("aria-invalid", "true");
    document.querySelector(`#${control.id}-error`).textContent = msg;
  }
  function validate() {
    let firstInvalid = null;
    required.forEach((id) => {
      const control = document.getElementById(id);
      clearError(control);
      const value = control.value.trim();
      let invalid = !value;
      if (id === "telefone" && !invalid) {
        const digits = value.replace(/\D/g, "");
        invalid = !/^[1-9][0-9]{9,10}$/.test(digits);
      }
      if (invalid) {
        markError(control, labels[id]);
        if (!firstInvalid) firstInvalid = control;
      }
    });
    // Prevent identical route, which indicates a likely input mistake.
    const origin = document.querySelector("#origem");
    const destination = document.querySelector("#destino");
    if (
      !firstInvalid &&
      origin.value.trim().toLocaleLowerCase("pt-BR") ===
        destination.value.trim().toLocaleLowerCase("pt-BR")
    ) {
      markError(destination, "Origem e destino não podem ser iguais.");
      firstInvalid = destination;
    }
    summary.hidden = !firstInvalid;
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }
  function quoteMessage(data) {
    return [
      "Olá! Gostaria de solicitar uma cotação com a Alpha Log Transportes.",
      "",
      "*DADOS PARA COTAÇÃO*",
      `*Nome:* ${data.get("nome")}`,
      `*Empresa:* ${data.get("empresa")}`,
      `*Telefone:* ${data.get("telefone")}`,
      `*Origem:* ${data.get("origem")}`,
      `*Destino:* ${data.get("destino")}`,
      `*Tipo de carga:* ${data.get("carga")}`,
      `*Detalhes:* ${String(data.get("mensagem") || "").trim() || "Não informado"}`,
      "",
      "Enviado pela landing page Alpha Log.",
    ].join("\n");
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    if (!validate()) return;
    const data = new FormData(form);
    // No personal information is persisted locally or transmitted to our servers.
    const url = whatsAppUrl(quoteMessage(data));
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.append(link);
    link.click();
    link.remove();
    status.textContent = phoneNumber
      ? "Mensagem preparada. Confirme o envio na janela do WhatsApp."
      : "Demonstração: mensagem preparada. Selecione o contato no WhatsApp; para o envio direto ao comercial, configure o telefone no arquivo scripts/config.js.";
  });
})();
