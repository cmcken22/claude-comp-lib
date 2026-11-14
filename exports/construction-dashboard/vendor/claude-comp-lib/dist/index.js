import { jsx as e, jsxs as d, Fragment as $e } from "react/jsx-runtime";
import { useState as B, useCallback as Ce, useContext as Y, createContext as Z, useId as z, useEffect as oe, useMemo as L, forwardRef as w, useRef as we } from "react";
function v(...s) {
  return s.filter(Boolean).join(" ");
}
function he({ value: s, defaultValue: a, onChange: t }) {
  const [n, r] = B(a), l = s !== void 0, c = l ? s : n, b = Ce(
    (o) => {
      l || r(o), t == null || t(o);
    },
    [l, t]
  );
  return [c, b];
}
const ue = Z(null);
function _e() {
  return Y(ue);
}
function Oe({
  sidebar: s,
  navbar: a,
  children: t,
  sidebarOpen: n,
  defaultSidebarOpen: r = !1,
  onSidebarOpenChange: l,
  maxWidth: c = "full",
  mainId: b = "main-content",
  skipLinkLabel: o = "Skip to content",
  className: h,
  ...p
}) {
  const u = `app-sidebar${z()}`, [f, _] = he({
    value: n,
    defaultValue: r,
    onChange: l
  });
  oe(() => {
    var x, $;
    if (!f) return;
    const k = (S) => {
      S.key === "Escape" && _(!1);
    };
    return document.addEventListener("keydown", k), ($ = (x = document.getElementById(u)) == null ? void 0 : x.querySelector("a, button")) == null || $.focus(), () => document.removeEventListener("keydown", k);
  }, [f, _, u]);
  const g = L(() => ({ sidebarId: u, sidebarOpen: f, setSidebarOpen: _ }), [u, f, _]);
  return /* @__PURE__ */ e(ue.Provider, { value: g, children: /* @__PURE__ */ d("div", { ...p, className: v("ds-app-shell", f && "ds-app-shell--sidebar-open", h), children: [
    /* @__PURE__ */ e("a", { className: "ds-app-shell__skip-link", href: `#${b}`, children: o }),
    /* @__PURE__ */ e("aside", { id: u, className: "ds-app-shell__sidebar", children: s }),
    /* @__PURE__ */ e("div", { className: "ds-app-shell__overlay", "aria-hidden": "true", onClick: () => _(!1) }),
    /* @__PURE__ */ d("div", { className: "ds-app-shell__content", children: [
      a && /* @__PURE__ */ e("header", { className: "ds-app-shell__navbar", children: a }),
      /* @__PURE__ */ e("main", { id: b, className: "ds-app-shell__main", tabIndex: -1, children: /* @__PURE__ */ e("div", { className: v("ds-app-shell__container", `ds-app-shell__container--${c}`), children: t }) })
    ] })
  ] }) });
}
function Te({ title: s, children: a, actions: t, menuLabel: n = "Open navigation", className: r, ...l }) {
  const c = _e();
  return /* @__PURE__ */ d("div", { ...l, className: v("ds-navbar", r), children: [
    c && /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        className: "ds-navbar__menu",
        "aria-label": n,
        "aria-controls": c.sidebarId,
        "aria-expanded": c.sidebarOpen,
        onClick: () => c.setSidebarOpen(!c.sidebarOpen),
        children: /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ e("path", { d: "M4 6h16M4 12h16M4 18h16", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
      }
    ),
    s != null && /* @__PURE__ */ e("div", { className: "ds-navbar__title", children: s }),
    a != null && /* @__PURE__ */ e("div", { className: "ds-navbar__center", children: a }),
    t != null && /* @__PURE__ */ e("div", { className: "ds-navbar__actions", children: t })
  ] });
}
function Ve({ brand: s, children: a, footer: t, navLabel: n = "Main", className: r, ...l }) {
  return /* @__PURE__ */ d("div", { ...l, className: v("ds-sidebar", r), children: [
    s != null && /* @__PURE__ */ e("div", { className: "ds-sidebar__brand", children: s }),
    /* @__PURE__ */ e("nav", { className: "ds-sidebar__nav", "aria-label": n, children: a }),
    t != null && /* @__PURE__ */ e("div", { className: "ds-sidebar__footer", children: t })
  ] });
}
function We({ title: s, children: a, className: t }) {
  const n = z();
  return /* @__PURE__ */ d("div", { className: v("ds-sidebar__section", t), children: [
    s != null && /* @__PURE__ */ e("div", { id: n, className: "ds-sidebar__section-title", children: s }),
    /* @__PURE__ */ e("ul", { className: "ds-sidebar__list", "aria-labelledby": s != null ? n : void 0, children: a })
  ] });
}
function Re({ icon: s, active: a = !1, badge: t, href: n, onClick: r, className: l, children: c, ...b }) {
  const o = _e(), h = (f) => {
    r == null || r(f), o == null || o.setSidebarOpen(!1);
  }, p = /* @__PURE__ */ d($e, { children: [
    s && /* @__PURE__ */ e("span", { className: "ds-sidebar__item-icon", "aria-hidden": "true", children: s }),
    /* @__PURE__ */ e("span", { className: "ds-sidebar__item-label", children: c }),
    t != null && /* @__PURE__ */ e("span", { className: "ds-sidebar__item-badge", children: t })
  ] }), u = v("ds-sidebar__item", a && "ds-sidebar__item--active", l);
  return /* @__PURE__ */ e("li", { children: n != null ? /* @__PURE__ */ e("a", { ...b, href: n, className: u, "aria-current": a ? "page" : void 0, onClick: h, children: p }) : /* @__PURE__ */ e("button", { type: "button", className: u, "aria-current": a ? "page" : void 0, onClick: h, children: p }) });
}
function Ee({ tone: s = "neutral", dot: a = !1, size: t = "md", className: n, children: r, ...l }) {
  return /* @__PURE__ */ d("span", { ...l, className: v("ds-badge", `ds-badge--${s}`, `ds-badge--${t}`, n), children: [
    a && /* @__PURE__ */ e("span", { className: "ds-badge__dot", "aria-hidden": "true" }),
    r
  ] });
}
const V = w(function({
  variant: a = "primary",
  size: t = "md",
  loading: n = !1,
  fullWidth: r = !1,
  startIcon: l,
  endIcon: c,
  disabled: b,
  type: o = "button",
  className: h,
  children: p,
  ...u
}, f) {
  return /* @__PURE__ */ d(
    "button",
    {
      ref: f,
      type: o,
      className: v(
        "ds-button",
        `ds-button--${a}`,
        `ds-button--${t}`,
        r && "ds-button--full-width",
        n && "ds-button--loading",
        h
      ),
      disabled: b || n,
      "aria-busy": n || void 0,
      ...u,
      children: [
        n ? /* @__PURE__ */ e("span", { className: "ds-button__spinner", "aria-hidden": "true" }) : l && /* @__PURE__ */ e("span", { className: "ds-button__icon", "aria-hidden": "true", children: l }),
        p != null && /* @__PURE__ */ e("span", { className: "ds-button__label", children: p }),
        c && !n && /* @__PURE__ */ e("span", { className: "ds-button__icon", "aria-hidden": "true", children: c })
      ]
    }
  );
});
function Ge({
  title: s,
  description: a,
  actions: t,
  padding: n = "md",
  as: r = "section",
  className: l,
  children: c,
  ...b
}) {
  const o = s != null || a != null || t != null;
  return /* @__PURE__ */ d(r, { ...b, className: v("ds-card", `ds-card--pad-${n}`, l), children: [
    o && /* @__PURE__ */ d("div", { className: "ds-card__header", children: [
      /* @__PURE__ */ d("div", { className: "ds-card__heading", children: [
        s != null && /* @__PURE__ */ e("h2", { className: "ds-card__title", children: s }),
        a != null && /* @__PURE__ */ e("p", { className: "ds-card__description", children: a })
      ] }),
      t != null && /* @__PURE__ */ e("div", { className: "ds-card__actions", children: t })
    ] }),
    c
  ] });
}
const Ie = { up: "M8 12V4M4 8l4-4 4 4", down: "M8 4v8M4 8l4 4 4-4", flat: "M3 8h10" };
function Qe({
  label: s,
  value: a,
  delta: t,
  trend: n = "flat",
  positive: r,
  deltaLabel: l,
  icon: c,
  footer: b,
  className: o,
  ...h
}) {
  const u = n === "flat" ? "neutral" : r ?? n !== "down" ? "positive" : "negative";
  return /* @__PURE__ */ d("div", { ...h, className: v("ds-stat-card", o), children: [
    /* @__PURE__ */ d("div", { className: "ds-stat-card__top", children: [
      /* @__PURE__ */ e("span", { className: "ds-stat-card__label", children: s }),
      c && /* @__PURE__ */ e("span", { className: "ds-stat-card__icon", "aria-hidden": "true", children: c })
    ] }),
    /* @__PURE__ */ e("div", { className: "ds-stat-card__value", children: a }),
    t != null && /* @__PURE__ */ d("div", { className: "ds-stat-card__meta", children: [
      /* @__PURE__ */ d("span", { className: v("ds-stat-card__delta", `ds-stat-card__delta--${u}`), children: [
        /* @__PURE__ */ e("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ e("path", { d: Ie[n], fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        t
      ] }),
      l != null && /* @__PURE__ */ e("span", { className: "ds-stat-card__delta-label", children: l })
    ] }),
    b && /* @__PURE__ */ e("div", { className: "ds-stat-card__footer", children: b })
  ] });
}
function ee({ htmlFor: s, label: a, description: t, descriptionId: n }) {
  return !a && !t ? null : /* @__PURE__ */ d("span", { className: "ds-choice__text", children: [
    a && /* @__PURE__ */ e("label", { htmlFor: s, className: "ds-choice__label", children: a }),
    t && /* @__PURE__ */ e("span", { id: n, className: "ds-choice__description", children: t })
  ] });
}
function Q(...s) {
  return s.filter(Boolean).join(" ") || void 0;
}
function Me(...s) {
  return (a) => {
    for (const t of s)
      typeof t == "function" ? t(a) : t && (t.current = a);
  };
}
const le = w(function({ label: a, description: t, indeterminate: n = !1, invalid: r = !1, id: l, className: c, disabled: b, "aria-describedby": o, ...h }, p) {
  const u = z(), f = l ?? `checkbox${u}`, _ = t ? `${f}-description` : void 0, g = we(null), k = L(() => Me(g, p), [p]);
  return oe(() => {
    g.current && (g.current.indeterminate = n);
  }, [n]), /* @__PURE__ */ d("div", { className: v("ds-choice", "ds-checkbox", b && "ds-choice--disabled", c), children: [
    /* @__PURE__ */ d("span", { className: "ds-choice__control", children: [
      /* @__PURE__ */ e(
        "input",
        {
          ...h,
          ref: k,
          id: f,
          type: "checkbox",
          className: "ds-checkbox__input",
          disabled: b,
          "aria-invalid": r || void 0,
          "aria-describedby": Q(o, _)
        }
      ),
      /* @__PURE__ */ e("svg", { className: "ds-checkbox__icon ds-checkbox__icon--check", viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ e("path", { d: "M3.5 8.5l3 3 6-7", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
      /* @__PURE__ */ e("svg", { className: "ds-checkbox__icon ds-checkbox__icon--dash", viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ e("path", { d: "M4 8h8", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
    ] }),
    /* @__PURE__ */ e(ee, { htmlFor: f, label: a, description: t, descriptionId: _ })
  ] });
}), be = Z(null);
function ae(s) {
  const a = Y(be), t = [s.describedBy, a == null ? void 0 : a.hintId, a == null ? void 0 : a.errorId].filter(Boolean).join(" ") || void 0, n = s.invalid ?? (a == null ? void 0 : a.invalid) ?? !1;
  return {
    id: s.id ?? (a == null ? void 0 : a.controlId),
    describedBy: t,
    invalid: n,
    required: s.required ?? (a == null ? void 0 : a.required),
    disabled: s.disabled ?? (a == null ? void 0 : a.disabled)
  };
}
const Be = w(function({
  size: a = "md",
  invalid: t,
  startAdornment: n,
  endAdornment: r,
  className: l,
  id: c,
  disabled: b,
  required: o,
  type: h = "text",
  "aria-describedby": p,
  ...u
}, f) {
  const _ = ae({ id: c, disabled: b, required: o, invalid: t, describedBy: p });
  return /* @__PURE__ */ d(
    "div",
    {
      className: v(
        "ds-input",
        `ds-input--${a}`,
        _.invalid && "ds-input--invalid",
        _.disabled && "ds-input--disabled",
        l
      ),
      children: [
        n && /* @__PURE__ */ e("span", { className: "ds-input__adornment", children: n }),
        /* @__PURE__ */ e(
          "input",
          {
            ...u,
            ref: f,
            type: h,
            id: _.id,
            className: "ds-input__control",
            disabled: _.disabled,
            required: _.required,
            "aria-invalid": _.invalid || void 0,
            "aria-describedby": _.describedBy
          }
        ),
        r && /* @__PURE__ */ e("span", { className: "ds-input__adornment", children: r })
      ]
    }
  );
}), re = w(function({
  size: a = "md",
  invalid: t,
  placeholder: n,
  className: r,
  id: l,
  disabled: c,
  required: b,
  value: o,
  defaultValue: h,
  children: p,
  "aria-describedby": u,
  ...f
}, _) {
  const g = ae({ id: l, disabled: c, required: b, invalid: t, describedBy: u }), k = o === void 0 && h === void 0 && n ? "" : h;
  return /* @__PURE__ */ d(
    "div",
    {
      className: v(
        "ds-select",
        `ds-select--${a}`,
        g.invalid && "ds-select--invalid",
        r
      ),
      children: [
        /* @__PURE__ */ d(
          "select",
          {
            ...f,
            ref: _,
            id: g.id,
            className: "ds-select__control",
            value: o,
            defaultValue: k,
            disabled: g.disabled,
            required: g.required,
            "aria-invalid": g.invalid || void 0,
            "aria-describedby": g.describedBy,
            children: [
              n && /* @__PURE__ */ e("option", { value: "", disabled: !0, hidden: !0, children: n }),
              p
            ]
          }
        ),
        /* @__PURE__ */ e("svg", { className: "ds-select__chevron", viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ e("path", { d: "M4 6l4 4 4-4", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })
      ]
    }
  );
});
function Le(s, a) {
  return s == null && a == null ? 0 : s == null ? 1 : a == null ? -1 : s instanceof Date && a instanceof Date ? s.getTime() - a.getTime() : typeof s == "number" && typeof a == "number" ? s - a : String(s).localeCompare(String(a), void 0, { numeric: !0, sensitivity: "base" });
}
function ze({ direction: s }) {
  return /* @__PURE__ */ d("svg", { className: "ds-data-table__sort-icon", viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ e("path", { d: "M5 6.5L8 3.5l3 3", className: v(s === "asc" && "is-active") }),
    /* @__PURE__ */ e("path", { d: "M5 9.5l3 3 3-3", className: v(s === "desc" && "is-active") })
  ] });
}
const Pe = () => /* @__PURE__ */ d("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", "aria-hidden": "true", focusable: "false", children: [
  /* @__PURE__ */ e("circle", { cx: "11", cy: "11", r: "7" }),
  /* @__PURE__ */ e("path", { d: "M20 20l-3.5-3.5" })
] }), ce = ({ dir: s }) => /* @__PURE__ */ e("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ e("path", { d: s === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6" }) });
function He({
  data: s,
  columns: a,
  getRowId: t,
  caption: n,
  showCaption: r = !1,
  searchable: l = !0,
  searchPlaceholder: c = "Search…",
  getSearchText: b,
  filters: o = [],
  toolbarActions: h,
  selectable: p = !1,
  bulkActions: u,
  initialSort: f,
  pageSize: _ = 10,
  pageSizeOptions: g = [10, 25, 50],
  emptyState: k,
  density: x = "comfortable",
  className: $
}) {
  const [S, I] = B(""), [P, se] = B({}), [C, me] = B(f), [ve, F] = B(0), [j, fe] = B(_), [D, H] = B(() => /* @__PURE__ */ new Set()), te = L(() => {
    const i = b ?? ((m) => a.filter((N) => N.accessor && N.searchable !== !1).map((N) => {
      const y = N.accessor(m);
      return y instanceof Date ? y.toLocaleDateString() : String(y ?? "");
    }).join(" "));
    return new Map(s.map((m) => [t(m), i(m).toLowerCase()]));
  }, [s, a, t, b]), K = L(() => {
    const i = S.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return s.filter((m) => {
      for (const y of o) {
        const T = P[y.id];
        if (T && y.getValue(m) !== T) return !1;
      }
      if (i.length === 0) return !0;
      const N = te.get(t(m)) ?? "";
      return i.every((y) => N.includes(y));
    });
  }, [s, o, P, S, te, t]), M = L(() => {
    const i = C && a.find((N) => N.id === C.columnId);
    if (!C || !(i != null && i.accessor)) return K;
    const m = C.direction === "asc" ? 1 : -1;
    return [...K].sort((N, y) => m * Le(i.accessor(N), i.accessor(y)));
  }, [K, C, a]), W = j > 0, A = W ? Math.max(1, Math.ceil(M.length / j)) : 1, q = Math.min(ve, A - 1), R = W ? q * j : 0, J = W ? M.slice(R, R + j) : M, E = Object.values(P).filter(Boolean).length, U = S.trim().length > 0, O = J.map(t), ne = O.filter((i) => D.has(i)).length, X = O.length > 0 && ne === O.length, Ne = s.filter((i) => D.has(t(i))), ie = () => H(/* @__PURE__ */ new Set()), ge = (i) => H((m) => {
    const N = new Set(m);
    return N.has(i) ? N.delete(i) : N.add(i), N;
  }), ye = () => H((i) => {
    const m = new Set(i);
    for (const N of O)
      X ? m.delete(N) : m.add(N);
    return m;
  }), ke = (i) => {
    me((m) => {
      if (!m || m.columnId !== i) return { columnId: i, direction: "asc" };
      if (m.direction === "asc") return { columnId: i, direction: "desc" };
    });
  }, de = () => {
    I(""), se({}), F(0);
  }, xe = a.length + (p ? 1 : 0), Se = l || o.length > 0 || h != null;
  return /* @__PURE__ */ d("div", { className: v("ds-data-table", `ds-data-table--${x}`, $), children: [
    Se && /* @__PURE__ */ d("div", { className: "ds-data-table__toolbar", children: [
      l && /* @__PURE__ */ e(
        Be,
        {
          className: "ds-data-table__search",
          type: "search",
          size: "sm",
          value: S,
          placeholder: c,
          "aria-label": `Search ${n.toLowerCase()}`,
          startAdornment: /* @__PURE__ */ e(Pe, {}),
          onChange: (i) => {
            I(i.target.value), F(0);
          }
        }
      ),
      o.map((i) => /* @__PURE__ */ d(
        re,
        {
          className: "ds-data-table__filter",
          size: "sm",
          "aria-label": i.label,
          value: P[i.id] ?? "",
          onChange: (m) => {
            se((N) => ({ ...N, [i.id]: m.target.value })), F(0);
          },
          children: [
            /* @__PURE__ */ e("option", { value: "", children: i.allLabel ?? `All ${i.label.toLowerCase()}` }),
            i.options.map((m) => /* @__PURE__ */ e("option", { value: m.value, children: m.label }, m.value))
          ]
        },
        i.id
      )),
      (E > 0 || U) && /* @__PURE__ */ d(V, { variant: "ghost", size: "sm", onClick: de, children: [
        "Clear",
        E > 0 ? ` (${E + (U ? 1 : 0)})` : ""
      ] }),
      h != null && /* @__PURE__ */ e("div", { className: "ds-data-table__toolbar-actions", children: h })
    ] }),
    p && D.size > 0 && /* @__PURE__ */ d("div", { className: "ds-data-table__bulk", role: "region", "aria-label": "Bulk actions", children: [
      /* @__PURE__ */ d("span", { className: "ds-data-table__bulk-count", children: [
        D.size,
        " selected"
      ] }),
      /* @__PURE__ */ d("div", { className: "ds-data-table__bulk-actions", children: [
        u == null ? void 0 : u(Ne, ie),
        /* @__PURE__ */ e(V, { variant: "ghost", size: "sm", onClick: ie, children: "Deselect" })
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "ds-data-table__scroll", tabIndex: 0, role: "group", "aria-label": `${n}, scrollable`, children: /* @__PURE__ */ d("table", { className: "ds-data-table__table", children: [
      /* @__PURE__ */ e("caption", { className: v("ds-data-table__caption", !r && "ds-data-table__caption--hidden"), children: n }),
      /* @__PURE__ */ e("thead", { children: /* @__PURE__ */ d("tr", { children: [
        p && /* @__PURE__ */ e("th", { scope: "col", className: "ds-data-table__select-cell", children: /* @__PURE__ */ e(
          le,
          {
            "aria-label": "Select all rows on this page",
            checked: X,
            indeterminate: ne > 0 && !X,
            disabled: O.length === 0,
            onChange: ye
          }
        ) }),
        a.map((i) => {
          const m = (C == null ? void 0 : C.columnId) === i.id ? C.direction : void 0, N = i.sortable && i.accessor;
          return /* @__PURE__ */ e(
            "th",
            {
              scope: "col",
              style: i.width ? { width: i.width } : void 0,
              className: v(`ds-data-table__cell--${i.align ?? "start"}`),
              "aria-sort": N ? m === "asc" ? "ascending" : m === "desc" ? "descending" : "none" : void 0,
              children: N ? /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: v("ds-data-table__sort", m && "ds-data-table__sort--active"),
                  onClick: () => ke(i.id),
                  children: [
                    i.header,
                    /* @__PURE__ */ e(ze, { direction: m })
                  ]
                }
              ) : i.header
            },
            i.id
          );
        })
      ] }) }),
      /* @__PURE__ */ e("tbody", { children: J.length === 0 ? /* @__PURE__ */ e("tr", { children: /* @__PURE__ */ e("td", { colSpan: xe, className: "ds-data-table__empty", children: k ?? /* @__PURE__ */ d("div", { className: "ds-data-table__empty-inner", children: [
        /* @__PURE__ */ e("strong", { children: "No results" }),
        /* @__PURE__ */ e("span", { children: "Try a different search or clear the filters." }),
        (E > 0 || U) && /* @__PURE__ */ e(V, { variant: "secondary", size: "sm", onClick: de, children: "Clear search and filters" })
      ] }) }) }) : J.map((i) => {
        const m = t(i), N = D.has(m);
        return /* @__PURE__ */ d("tr", { className: v(N && "ds-data-table__row--selected"), children: [
          p && /* @__PURE__ */ e("td", { className: "ds-data-table__select-cell", children: /* @__PURE__ */ e(le, { "aria-label": `Select row ${m}`, checked: N, onChange: () => ge(m) }) }),
          a.map((y) => {
            var T;
            return /* @__PURE__ */ e("td", { className: v(`ds-data-table__cell--${y.align ?? "start"}`), children: y.cell ? y.cell(i) : Fe((T = y.accessor) == null ? void 0 : T.call(y, i)) }, y.id);
          })
        ] }, m);
      }) })
    ] }) }),
    W && /* @__PURE__ */ d("div", { className: "ds-data-table__footer", children: [
      /* @__PURE__ */ d("span", { className: "ds-data-table__range", "aria-live": "polite", children: [
        M.length === 0 ? "No results" : `${R + 1}–${Math.min(R + j, M.length)} of ${M.length}`,
        M.length !== s.length && /* @__PURE__ */ d("span", { className: "ds-data-table__range-total", children: [
          " (filtered from ",
          s.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ d("div", { className: "ds-data-table__pager", children: [
        /* @__PURE__ */ d("label", { className: "ds-data-table__page-size", children: [
          /* @__PURE__ */ e("span", { children: "Rows" }),
          /* @__PURE__ */ e(
            re,
            {
              size: "sm",
              value: String(j),
              onChange: (i) => {
                fe(Number(i.target.value)), F(0);
              },
              children: g.map((i) => /* @__PURE__ */ e("option", { value: i, children: i }, i))
            }
          )
        ] }),
        /* @__PURE__ */ d("span", { className: "ds-data-table__page-label", children: [
          "Page ",
          q + 1,
          " of ",
          A
        ] }),
        /* @__PURE__ */ e(
          V,
          {
            variant: "secondary",
            size: "sm",
            "aria-label": "Previous page",
            startIcon: /* @__PURE__ */ e(ce, { dir: "left" }),
            disabled: q === 0,
            onClick: () => F(q - 1)
          }
        ),
        /* @__PURE__ */ e(
          V,
          {
            variant: "secondary",
            size: "sm",
            "aria-label": "Next page",
            startIcon: /* @__PURE__ */ e(ce, { dir: "right" }),
            disabled: q >= A - 1,
            onClick: () => F(q + 1)
          }
        )
      ] })
    ] })
  ] });
}
function Fe(s) {
  return s == null ? "—" : s instanceof Date ? s.toLocaleDateString() : String(s);
}
function G({ id: s, tone: a, children: t }) {
  return /* @__PURE__ */ e("p", { id: s, className: `ds-field__${a}`, children: t });
}
const je = w(function({ required: a = !1, className: t, children: n, ...r }, l) {
  return /* @__PURE__ */ d("label", { ref: l, className: v("ds-label", t), ...r, children: [
    n,
    a && /* @__PURE__ */ e("span", { className: "ds-label__required", "aria-hidden": "true", children: "*" })
  ] });
});
function Ke({
  label: s,
  hint: a,
  error: t,
  required: n = !1,
  disabled: r = !1,
  id: l,
  className: c,
  children: b
}) {
  const o = z(), h = l ?? `field${o}`, p = a ? `${h}-hint` : void 0, u = t ? `${h}-error` : void 0, f = !!t, _ = L(
    () => ({ controlId: h, hintId: p, errorId: u, invalid: f, required: n, disabled: r }),
    [h, p, u, f, n, r]
  );
  return /* @__PURE__ */ d("div", { className: v("ds-field", r && "ds-field--disabled", c), children: [
    /* @__PURE__ */ e(je, { htmlFor: h, required: n, children: s }),
    /* @__PURE__ */ e(be.Provider, { value: _, children: b }),
    a && p && /* @__PURE__ */ e(G, { id: p, tone: "hint", children: a }),
    t && u && /* @__PURE__ */ e(G, { id: u, tone: "error", children: t })
  ] });
}
function Ae({
  header: s,
  children: a,
  footer: t,
  maxWidth: n = "lg",
  stickyHeader: r = !1,
  mainId: l = "main-content",
  skipLinkLabel: c = "Skip to content",
  className: b,
  ...o
}) {
  return /* @__PURE__ */ d("div", { ...o, className: v("ds-page-layout", `ds-page-layout--${n}`, b), children: [
    /* @__PURE__ */ e("a", { className: "ds-page-layout__skip-link", href: `#${l}`, children: c }),
    s && /* @__PURE__ */ e("header", { className: v("ds-page-layout__header", r && "ds-page-layout__header--sticky"), children: /* @__PURE__ */ e("div", { className: "ds-page-layout__container ds-page-layout__header-inner", children: s }) }),
    /* @__PURE__ */ e("main", { id: l, className: "ds-page-layout__body", tabIndex: -1, children: /* @__PURE__ */ e("div", { className: "ds-page-layout__container", children: a }) }),
    t && /* @__PURE__ */ e("footer", { className: "ds-page-layout__footer", children: /* @__PURE__ */ e("div", { className: "ds-page-layout__container", children: t }) })
  ] });
}
function Je({
  value: s,
  max: a = 100,
  tone: t = "accent",
  size: n = "md",
  label: r,
  showValue: l = !1,
  valueText: c,
  className: b,
  ...o
}) {
  const h = Math.min(Math.max(s, 0), a), p = a > 0 ? Math.round(h / a * 100) : 0;
  return /* @__PURE__ */ d("div", { ...o, className: v("ds-progress", `ds-progress--${t}`, `ds-progress--${n}`, b), children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: "ds-progress__track",
        role: "progressbar",
        "aria-label": r,
        "aria-valuemin": 0,
        "aria-valuemax": a,
        "aria-valuenow": h,
        children: /* @__PURE__ */ e("div", { className: "ds-progress__fill", style: { width: `${p}%` } })
      }
    ),
    l && /* @__PURE__ */ e("span", { className: "ds-progress__value", children: c ?? `${p}%` })
  ] });
}
const pe = Z(null), Ue = w(function({ value: a, label: t, description: n, id: r, className: l, disabled: c, name: b, checked: o, onChange: h, "aria-describedby": p, ...u }, f) {
  const _ = Y(pe), g = z(), k = r ?? `radio${g}`, x = n ? `${k}-description` : void 0, $ = c ?? (_ == null ? void 0 : _.disabled), S = (I) => {
    h == null || h(I), _ && I.target.checked && _.select(a);
  };
  return /* @__PURE__ */ d("div", { className: v("ds-choice", "ds-radio", $ && "ds-choice--disabled", l), children: [
    /* @__PURE__ */ e("span", { className: "ds-choice__control", children: /* @__PURE__ */ e(
      "input",
      {
        ...u,
        ref: f,
        id: k,
        type: "radio",
        className: "ds-radio__input",
        value: a,
        name: (_ == null ? void 0 : _.name) ?? b,
        checked: _ ? _.value === a : o,
        onChange: S,
        disabled: $,
        required: u.required ?? (_ == null ? void 0 : _.required),
        "aria-invalid": (_ == null ? void 0 : _.invalid) || void 0,
        "aria-describedby": Q(p, x)
      }
    ) }),
    /* @__PURE__ */ e(ee, { htmlFor: k, label: t, description: n, descriptionId: x })
  ] });
});
function Xe({
  label: s,
  name: a,
  value: t,
  defaultValue: n,
  onValueChange: r,
  orientation: l = "vertical",
  required: c = !1,
  disabled: b = !1,
  hint: o,
  error: h,
  className: p,
  children: u,
  ...f
}) {
  const _ = z(), g = a ?? `radio-group${_}`, k = o ? `${g}-hint` : void 0, x = h ? `${g}-error` : void 0, [$, S] = he({
    value: t,
    defaultValue: n,
    onChange: r
  }), I = L(
    () => ({
      name: g,
      value: $,
      disabled: b,
      required: c,
      invalid: !!h,
      select: (P) => S(P)
    }),
    [g, $, b, c, h, S]
  );
  return /* @__PURE__ */ d(
    "fieldset",
    {
      ...f,
      className: v("ds-radio-group", `ds-radio-group--${l}`, p),
      disabled: b,
      "aria-describedby": Q(f["aria-describedby"], k, x),
      children: [
        /* @__PURE__ */ d("legend", { className: "ds-radio-group__legend", children: [
          s,
          c && /* @__PURE__ */ e("span", { className: "ds-radio-group__required", "aria-hidden": "true", children: "*" })
        ] }),
        o && k && /* @__PURE__ */ e(G, { id: k, tone: "hint", children: o }),
        /* @__PURE__ */ e("div", { className: "ds-radio-group__options", children: /* @__PURE__ */ e(pe.Provider, { value: I, children: u }) }),
        h && x && /* @__PURE__ */ e(G, { id: x, tone: "error", children: h })
      ]
    }
  );
}
const Ye = w(function({ label: a, description: t, id: n, className: r, disabled: l, "aria-describedby": c, ...b }, o) {
  const h = z(), p = n ?? `switch${h}`, u = t ? `${p}-description` : void 0;
  return /* @__PURE__ */ d("div", { className: v("ds-choice", "ds-switch", l && "ds-choice--disabled", r), children: [
    /* @__PURE__ */ d("span", { className: "ds-choice__control", children: [
      /* @__PURE__ */ e(
        "input",
        {
          ...b,
          ref: o,
          id: p,
          type: "checkbox",
          role: "switch",
          className: "ds-switch__input",
          disabled: l,
          "aria-describedby": Q(c, u)
        }
      ),
      /* @__PURE__ */ e("span", { className: "ds-switch__thumb", "aria-hidden": "true" })
    ] }),
    /* @__PURE__ */ e(ee, { htmlFor: p, label: a, description: t, descriptionId: u })
  ] });
}), Ze = w(function({
  invalid: a,
  resize: t = "vertical",
  rows: n = 4,
  className: r,
  id: l,
  disabled: c,
  required: b,
  "aria-describedby": o,
  ...h
}, p) {
  const u = ae({ id: l, disabled: c, required: b, invalid: a, describedBy: o });
  return /* @__PURE__ */ e(
    "textarea",
    {
      ...h,
      ref: p,
      rows: n,
      id: u.id,
      className: v(
        "ds-textarea",
        `ds-textarea--resize-${t}`,
        u.invalid && "ds-textarea--invalid",
        r
      ),
      disabled: u.disabled,
      required: u.required,
      "aria-invalid": u.invalid || void 0,
      "aria-describedby": u.describedBy
    }
  );
});
export {
  Oe as AppShell,
  Ee as Badge,
  V as Button,
  Ge as Card,
  le as Checkbox,
  He as DataTable,
  Ke as FormField,
  Be as Input,
  je as Label,
  Te as Navbar,
  Ae as PageLayout,
  Je as Progress,
  Ue as Radio,
  Xe as RadioGroup,
  re as Select,
  Ve as Sidebar,
  Re as SidebarItem,
  We as SidebarSection,
  Qe as StatCard,
  Ye as Switch,
  Ze as TextArea,
  _e as useAppShell,
  ae as useFormFieldControl
};
//# sourceMappingURL=index.js.map
