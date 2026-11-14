import { jsxs as f, jsx as d } from "react/jsx-runtime";
import { forwardRef as N, useId as k, useRef as M, useMemo as w, useEffect as P, useContext as R, createContext as j, useState as T, useCallback as W } from "react";
function v(...n) {
  return n.filter(Boolean).join(" ");
}
const A = N(function({
  variant: e = "primary",
  size: i = "md",
  loading: s = !1,
  fullWidth: r = !1,
  startIcon: t,
  endIcon: u,
  disabled: h,
  type: l = "button",
  className: c,
  children: b,
  ...o
}, _) {
  return /* @__PURE__ */ f(
    "button",
    {
      ref: _,
      type: l,
      className: v(
        "ds-button",
        `ds-button--${e}`,
        `ds-button--${i}`,
        r && "ds-button--full-width",
        s && "ds-button--loading",
        c
      ),
      disabled: h || s,
      "aria-busy": s || void 0,
      ...o,
      children: [
        s ? /* @__PURE__ */ d("span", { className: "ds-button__spinner", "aria-hidden": "true" }) : t && /* @__PURE__ */ d("span", { className: "ds-button__icon", "aria-hidden": "true", children: t }),
        b != null && /* @__PURE__ */ d("span", { className: "ds-button__label", children: b }),
        u && !s && /* @__PURE__ */ d("span", { className: "ds-button__icon", "aria-hidden": "true", children: u })
      ]
    }
  );
});
function F({ htmlFor: n, label: e, description: i, descriptionId: s }) {
  return !e && !i ? null : /* @__PURE__ */ f("span", { className: "ds-choice__text", children: [
    e && /* @__PURE__ */ d("label", { htmlFor: n, className: "ds-choice__label", children: e }),
    i && /* @__PURE__ */ d("span", { id: s, className: "ds-choice__description", children: i })
  ] });
}
function g(...n) {
  return n.filter(Boolean).join(" ") || void 0;
}
function G(...n) {
  return (e) => {
    for (const i of n)
      typeof i == "function" ? i(e) : i && (i.current = e);
  };
}
const H = N(function({ label: e, description: i, indeterminate: s = !1, invalid: r = !1, id: t, className: u, disabled: h, "aria-describedby": l, ...c }, b) {
  const o = k(), _ = t ?? `checkbox${o}`, a = i ? `${_}-description` : void 0, m = M(null), p = w(() => G(m, b), [b]);
  return P(() => {
    m.current && (m.current.indeterminate = s);
  }, [s]), /* @__PURE__ */ f("div", { className: v("ds-choice", "ds-checkbox", h && "ds-choice--disabled", u), children: [
    /* @__PURE__ */ f("span", { className: "ds-choice__control", children: [
      /* @__PURE__ */ d(
        "input",
        {
          ...c,
          ref: p,
          id: _,
          type: "checkbox",
          className: "ds-checkbox__input",
          disabled: h,
          "aria-invalid": r || void 0,
          "aria-describedby": g(l, a)
        }
      ),
      /* @__PURE__ */ d("svg", { className: "ds-checkbox__icon ds-checkbox__icon--check", viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ d("path", { d: "M3.5 8.5l3 3 6-7", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
      /* @__PURE__ */ d("svg", { className: "ds-checkbox__icon ds-checkbox__icon--dash", viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ d("path", { d: "M4 8h8", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
    ] }),
    /* @__PURE__ */ d(F, { htmlFor: _, label: e, description: i, descriptionId: a })
  ] });
});
function B({ id: n, tone: e, children: i }) {
  return /* @__PURE__ */ d("p", { id: n, className: `ds-field__${e}`, children: i });
}
const C = j(null);
function q(n) {
  const e = R(C), i = [n.describedBy, e == null ? void 0 : e.hintId, e == null ? void 0 : e.errorId].filter(Boolean).join(" ") || void 0, s = n.invalid ?? (e == null ? void 0 : e.invalid) ?? !1;
  return {
    id: n.id ?? (e == null ? void 0 : e.controlId),
    describedBy: i,
    invalid: s,
    required: n.required ?? (e == null ? void 0 : e.required),
    disabled: n.disabled ?? (e == null ? void 0 : e.disabled)
  };
}
const V = N(function({ required: e = !1, className: i, children: s, ...r }, t) {
  return /* @__PURE__ */ f("label", { ref: t, className: v("ds-label", i), ...r, children: [
    s,
    e && /* @__PURE__ */ d("span", { className: "ds-label__required", "aria-hidden": "true", children: "*" })
  ] });
});
function J({
  label: n,
  hint: e,
  error: i,
  required: s = !1,
  disabled: r = !1,
  id: t,
  className: u,
  children: h
}) {
  const l = k(), c = t ?? `field${l}`, b = e ? `${c}-hint` : void 0, o = i ? `${c}-error` : void 0, _ = !!i, a = w(
    () => ({ controlId: c, hintId: b, errorId: o, invalid: _, required: s, disabled: r }),
    [c, b, o, _, s, r]
  );
  return /* @__PURE__ */ f("div", { className: v("ds-field", r && "ds-field--disabled", u), children: [
    /* @__PURE__ */ d(V, { htmlFor: c, required: s, children: n }),
    /* @__PURE__ */ d(C.Provider, { value: a, children: h }),
    e && b && /* @__PURE__ */ d(B, { id: b, tone: "hint", children: e }),
    i && o && /* @__PURE__ */ d(B, { id: o, tone: "error", children: i })
  ] });
}
const K = N(function({
  size: e = "md",
  invalid: i,
  startAdornment: s,
  endAdornment: r,
  className: t,
  id: u,
  disabled: h,
  required: l,
  type: c = "text",
  "aria-describedby": b,
  ...o
}, _) {
  const a = q({ id: u, disabled: h, required: l, invalid: i, describedBy: b });
  return /* @__PURE__ */ f(
    "div",
    {
      className: v(
        "ds-input",
        `ds-input--${e}`,
        a.invalid && "ds-input--invalid",
        a.disabled && "ds-input--disabled",
        t
      ),
      children: [
        s && /* @__PURE__ */ d("span", { className: "ds-input__adornment", children: s }),
        /* @__PURE__ */ d(
          "input",
          {
            ...o,
            ref: _,
            type: c,
            id: a.id,
            className: "ds-input__control",
            disabled: a.disabled,
            required: a.required,
            "aria-invalid": a.invalid || void 0,
            "aria-describedby": a.describedBy
          }
        ),
        r && /* @__PURE__ */ d("span", { className: "ds-input__adornment", children: r })
      ]
    }
  );
});
function O({
  header: n,
  children: e,
  footer: i,
  maxWidth: s = "lg",
  stickyHeader: r = !1,
  mainId: t = "main-content",
  skipLinkLabel: u = "Skip to content",
  className: h,
  ...l
}) {
  return /* @__PURE__ */ f("div", { ...l, className: v("ds-page-layout", `ds-page-layout--${s}`, h), children: [
    /* @__PURE__ */ d("a", { className: "ds-page-layout__skip-link", href: `#${t}`, children: u }),
    n && /* @__PURE__ */ d("header", { className: v("ds-page-layout__header", r && "ds-page-layout__header--sticky"), children: /* @__PURE__ */ d("div", { className: "ds-page-layout__container ds-page-layout__header-inner", children: n }) }),
    /* @__PURE__ */ d("main", { id: t, className: "ds-page-layout__body", tabIndex: -1, children: /* @__PURE__ */ d("div", { className: "ds-page-layout__container", children: e }) }),
    i && /* @__PURE__ */ d("footer", { className: "ds-page-layout__footer", children: /* @__PURE__ */ d("div", { className: "ds-page-layout__container", children: i }) })
  ] });
}
const L = j(null), Q = N(function({ value: e, label: i, description: s, id: r, className: t, disabled: u, name: h, checked: l, onChange: c, "aria-describedby": b, ...o }, _) {
  const a = R(L), m = k(), p = r ?? `radio${m}`, y = s ? `${p}-description` : void 0, x = u ?? (a == null ? void 0 : a.disabled), I = ($) => {
    c == null || c($), a && $.target.checked && a.select(e);
  };
  return /* @__PURE__ */ f("div", { className: v("ds-choice", "ds-radio", x && "ds-choice--disabled", t), children: [
    /* @__PURE__ */ d("span", { className: "ds-choice__control", children: /* @__PURE__ */ d(
      "input",
      {
        ...o,
        ref: _,
        id: p,
        type: "radio",
        className: "ds-radio__input",
        value: e,
        name: (a == null ? void 0 : a.name) ?? h,
        checked: a ? a.value === e : l,
        onChange: I,
        disabled: x,
        required: o.required ?? (a == null ? void 0 : a.required),
        "aria-invalid": (a == null ? void 0 : a.invalid) || void 0,
        "aria-describedby": g(b, y)
      }
    ) }),
    /* @__PURE__ */ d(F, { htmlFor: p, label: i, description: s, descriptionId: y })
  ] });
});
function z({ value: n, defaultValue: e, onChange: i }) {
  const [s, r] = T(e), t = n !== void 0, u = t ? n : s, h = W(
    (l) => {
      t || r(l), i == null || i(l);
    },
    [t, i]
  );
  return [u, h];
}
function U({
  label: n,
  name: e,
  value: i,
  defaultValue: s,
  onValueChange: r,
  orientation: t = "vertical",
  required: u = !1,
  disabled: h = !1,
  hint: l,
  error: c,
  className: b,
  children: o,
  ..._
}) {
  const a = k(), m = e ?? `radio-group${a}`, p = l ? `${m}-hint` : void 0, y = c ? `${m}-error` : void 0, [x, I] = z({
    value: i,
    defaultValue: s,
    onChange: r
  }), $ = w(
    () => ({
      name: m,
      value: x,
      disabled: h,
      required: u,
      invalid: !!c,
      select: (S) => I(S)
    }),
    [m, x, h, u, c, I]
  );
  return /* @__PURE__ */ f(
    "fieldset",
    {
      ..._,
      className: v("ds-radio-group", `ds-radio-group--${t}`, b),
      disabled: h,
      "aria-describedby": g(_["aria-describedby"], p, y),
      children: [
        /* @__PURE__ */ f("legend", { className: "ds-radio-group__legend", children: [
          n,
          u && /* @__PURE__ */ d("span", { className: "ds-radio-group__required", "aria-hidden": "true", children: "*" })
        ] }),
        l && p && /* @__PURE__ */ d(B, { id: p, tone: "hint", children: l }),
        /* @__PURE__ */ d("div", { className: "ds-radio-group__options", children: /* @__PURE__ */ d(L.Provider, { value: $, children: o }) }),
        c && y && /* @__PURE__ */ d(B, { id: y, tone: "error", children: c })
      ]
    }
  );
}
const X = N(function({
  size: e = "md",
  invalid: i,
  placeholder: s,
  className: r,
  id: t,
  disabled: u,
  required: h,
  value: l,
  defaultValue: c,
  children: b,
  "aria-describedby": o,
  ..._
}, a) {
  const m = q({ id: t, disabled: u, required: h, invalid: i, describedBy: o }), p = l === void 0 && c === void 0 && s ? "" : c;
  return /* @__PURE__ */ f(
    "div",
    {
      className: v(
        "ds-select",
        `ds-select--${e}`,
        m.invalid && "ds-select--invalid",
        r
      ),
      children: [
        /* @__PURE__ */ f(
          "select",
          {
            ..._,
            ref: a,
            id: m.id,
            className: "ds-select__control",
            value: l,
            defaultValue: p,
            disabled: m.disabled,
            required: m.required,
            "aria-invalid": m.invalid || void 0,
            "aria-describedby": m.describedBy,
            children: [
              s && /* @__PURE__ */ d("option", { value: "", disabled: !0, hidden: !0, children: s }),
              b
            ]
          }
        ),
        /* @__PURE__ */ d("svg", { className: "ds-select__chevron", viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ d("path", { d: "M4 6l4 4 4-4", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })
      ]
    }
  );
}), Y = N(function({ label: e, description: i, id: s, className: r, disabled: t, "aria-describedby": u, ...h }, l) {
  const c = k(), b = s ?? `switch${c}`, o = i ? `${b}-description` : void 0;
  return /* @__PURE__ */ f("div", { className: v("ds-choice", "ds-switch", t && "ds-choice--disabled", r), children: [
    /* @__PURE__ */ f("span", { className: "ds-choice__control", children: [
      /* @__PURE__ */ d(
        "input",
        {
          ...h,
          ref: l,
          id: b,
          type: "checkbox",
          role: "switch",
          className: "ds-switch__input",
          disabled: t,
          "aria-describedby": g(u, o)
        }
      ),
      /* @__PURE__ */ d("span", { className: "ds-switch__thumb", "aria-hidden": "true" })
    ] }),
    /* @__PURE__ */ d(F, { htmlFor: b, label: e, description: i, descriptionId: o })
  ] });
}), Z = N(function({
  invalid: e,
  resize: i = "vertical",
  rows: s = 4,
  className: r,
  id: t,
  disabled: u,
  required: h,
  "aria-describedby": l,
  ...c
}, b) {
  const o = q({ id: t, disabled: u, required: h, invalid: e, describedBy: l });
  return /* @__PURE__ */ d(
    "textarea",
    {
      ...c,
      ref: b,
      rows: s,
      id: o.id,
      className: v(
        "ds-textarea",
        `ds-textarea--resize-${i}`,
        o.invalid && "ds-textarea--invalid",
        r
      ),
      disabled: o.disabled,
      required: o.required,
      "aria-invalid": o.invalid || void 0,
      "aria-describedby": o.describedBy
    }
  );
});
export {
  A as Button,
  H as Checkbox,
  J as FormField,
  K as Input,
  V as Label,
  O as PageLayout,
  Q as Radio,
  U as RadioGroup,
  X as Select,
  Y as Switch,
  Z as TextArea,
  q as useFormFieldControl
};
//# sourceMappingURL=index.js.map
