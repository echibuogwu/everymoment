import { h as useParams, j as jsxRuntimeExports, f as useQuery, P as Principal, G as createActorWithConfig, H as createActor } from "./index-DXT1CttK.js";
import { T as Ticket, Q as QRCodeSVG } from "./index-CzV7IUDd.js";
import { c as createLucideIcon, m as motion } from "./proxy-BmYmrhIs.js";
import { C as CircleCheck } from "./circle-check-QE7bzDIx.js";
import { U as User } from "./user--0LaG4fi.js";
import { C as CalendarDays } from "./calendar-days-CUphCJWm.js";
import { C as Clock } from "./clock-D2KMNAFB.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "5", height: "5", x: "3", y: "3", rx: "1", key: "1tu5fj" }],
  ["rect", { width: "5", height: "5", x: "16", y: "3", rx: "1", key: "1v8r4q" }],
  ["rect", { width: "5", height: "5", x: "3", y: "16", rx: "1", key: "1x03jg" }],
  ["path", { d: "M21 16h-3a2 2 0 0 0-2 2v3", key: "177gqh" }],
  ["path", { d: "M21 21v.01", key: "ents32" }],
  ["path", { d: "M12 7v3a2 2 0 0 1-2 2H7", key: "8crl2c" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M12 3h.01", key: "n36tog" }],
  ["path", { d: "M12 16v.01", key: "133mhm" }],
  ["path", { d: "M16 12h1", key: "1slzba" }],
  ["path", { d: "M21 12v.01", key: "1lwtk9" }],
  ["path", { d: "M12 21v-1", key: "1880an" }]
];
const QrCode = createLucideIcon("qr-code", __iconNode);
function formatTs(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function PassDetail({
  icon,
  label,
  value,
  highlight = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "flex items-start gap-3 py-3 border-b border-white/10 last:border-0",
      initial: { opacity: 0, x: -12 },
      animate: { opacity: 1, x: 0 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
            style: { background: "rgba(255,255,255,0.08)" },
            children: icon
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-body text-white/40 uppercase tracking-widest mb-0.5", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-sm font-body font-semibold break-words ${highlight ? "" : "text-white/90"}`,
              style: highlight ? { color: "oklch(0.72 0.28 280)" } : void 0,
              children: value
            }
          )
        ] })
      ]
    }
  );
}
async function getAnonActor() {
  return createActorWithConfig(createActor);
}
function EventPassContent({
  momentId,
  userId
}) {
  var _a, _b;
  const {
    data: info,
    isLoading: isLoadingInfo,
    isError
  } = useQuery({
    queryKey: ["event-pass", momentId, userId],
    queryFn: async () => {
      let principal;
      try {
        principal = Principal.fromText(decodeURIComponent(userId));
      } catch {
        return null;
      }
      const actor = await getAnonActor();
      const result = await actor.getEventPassInfo(momentId, principal);
      if ("ok" in result) return result.ok;
      return null;
    },
    retry: false
  });
  const { data: momentDetail, isLoading: isLoadingMoment } = useQuery({
    queryKey: ["event-pass-moment", momentId],
    queryFn: async () => {
      const actor = await getAnonActor();
      return actor.getMomentDetail(momentId);
    },
    retry: false
  });
  const isLoading = isLoadingInfo || isLoadingMoment;
  const coverImageUrl = ((_b = (_a = momentDetail == null ? void 0 : momentDetail.coverImage) == null ? void 0 : _a.getDirectURL) == null ? void 0 : _b.call(_a)) ?? null;
  const momentShareUrl = `${window.location.origin}/moment/${momentId}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex items-center justify-center p-4",
      style: {
        background: "linear-gradient(160deg, oklch(0.08 0.04 280) 0%, oklch(0.05 0.02 300) 50%, oklch(0.06 0.03 260) 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 pointer-events-none",
            style: {
              background: "radial-gradient(ellipse at 20% 20%, oklch(0.45 0.22 280 / 0.12) 0%, transparent 50%),radial-gradient(ellipse at 80% 80%, oklch(0.45 0.22 300 / 0.08) 0%, transparent 50%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: -12 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4 },
              className: "flex items-center justify-center gap-2 mb-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-8 h-8 rounded-xl flex items-center justify-center",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))",
                      boxShadow: "0 0 20px oklch(0.55 0.28 280 / 0.4)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-4 h-4 text-white" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-white/90 text-lg tracking-tight", children: "EveryMoment" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { scale: 0.92, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 24,
                delay: 0.1
              },
              className: "relative rounded-3xl overflow-hidden",
              style: {
                background: "linear-gradient(160deg, oklch(0.14 0.04 280), oklch(0.08 0.03 300))",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06) inset"
              },
              "data-ocid": "event-pass-page-card",
              children: [
                !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-44 overflow-hidden", children: [
                  coverImageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.img,
                    {
                      src: coverImageUrl,
                      alt: (info == null ? void 0 : info.momentTitle) ?? "Moment cover",
                      className: "w-full h-full object-cover",
                      initial: { scale: 1.08, opacity: 0 },
                      animate: { scale: 1, opacity: 1 },
                      transition: { duration: 0.6, ease: "easeOut" }
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-full h-full",
                      style: {
                        background: "linear-gradient(135deg, oklch(0.35 0.18 280), oklch(0.25 0.14 300), oklch(0.20 0.10 260))"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute inset-0",
                      style: {
                        background: "linear-gradient(to bottom, transparent 40%, oklch(0.14 0.04 280) 100%)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute inset-0 pointer-events-none",
                      style: {
                        background: "radial-gradient(ellipse at 30% 0%, oklch(0.55 0.28 280 / 0.15) 0%, transparent 55%)"
                      }
                    }
                  )
                ] }),
                isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute inset-0 pointer-events-none",
                    style: {
                      background: "radial-gradient(ellipse at 30% 0%, oklch(0.55 0.28 280 / 0.12) 0%, transparent 55%)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative px-6 pt-4 pb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0",
                        style: {
                          background: "linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.45 0.22 300))",
                          boxShadow: "0 0 20px oklch(0.55 0.28 280 / 0.35)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-5 h-5 text-white" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-white text-xl leading-tight", children: "Event Pass" }),
                      info && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-xs font-body mt-0.5 truncate max-w-[200px]", children: info.momentTitle })
                    ] })
                  ] }),
                  info && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, scale: 0.8 },
                      animate: { opacity: 1, scale: 1 },
                      transition: { delay: 0.4, type: "spring" },
                      className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-1",
                      style: {
                        background: "rgba(100, 220, 140, 0.12)",
                        border: "1px solid rgba(100, 220, 140, 0.25)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheck,
                          {
                            className: "w-3.5 h-3.5",
                            style: { color: "oklch(0.72 0.20 142)" }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-[11px] font-body font-semibold",
                            style: { color: "oklch(0.72 0.20 142)" },
                            children: "Verified Attendance"
                          }
                        )
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-6 border-t border-dashed border-white/10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4", children: [
                  isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "py-8 flex flex-col items-center gap-3",
                      "data-ocid": "event-pass-loading_state",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "w-10 h-10 rounded-full animate-pulse",
                            style: { background: "rgba(255,255,255,0.08)" }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-white/40", children: "Loading pass details…" })
                      ]
                    }
                  ),
                  isError && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "py-8 text-center",
                      "data-ocid": "event-pass-error_state",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-white/50", children: "Could not load pass details. This link may be invalid." })
                    }
                  ),
                  !isLoading && !isError && !info && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "py-8 text-center",
                      "data-ocid": "event-pass-not-found_state",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-white/50", children: "No attendance record found for this user." })
                    }
                  ),
                  info && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      transition: { delay: 0.25 },
                      "data-ocid": "event-pass-details",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          PassDetail,
                          {
                            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-white/60" }),
                            label: "Attendee",
                            value: `@${info.username}`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          PassDetail,
                          {
                            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-white/60" }),
                            label: "Status",
                            value: info.status,
                            highlight: true
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          PassDetail,
                          {
                            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4 text-white/60" }),
                            label: "Event date",
                            value: formatTs(info.momentDate)
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          PassDetail,
                          {
                            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-white/60" }),
                            label: "RSVP'd on",
                            value: formatTs(info.rsvpTime)
                          }
                        )
                      ]
                    }
                  )
                ] }),
                info && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-6 border-t border-dashed border-white/10" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 8 },
                      animate: { opacity: 1, y: 0 },
                      transition: { delay: 0.5, type: "spring", stiffness: 200 },
                      className: "px-6 py-5 flex flex-col items-center gap-3",
                      "data-ocid": "event-pass-reshare-qr",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            QrCode,
                            {
                              className: "w-4 h-4",
                              style: { color: "oklch(0.72 0.28 280)" }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] font-body font-semibold text-white/60 uppercase tracking-wider", children: "Share this moment" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "p-3 rounded-2xl",
                            style: {
                              background: "rgba(255,255,255,0.96)",
                              boxShadow: "0 0 24px oklch(0.55 0.28 280 / 0.25)"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              QRCodeSVG,
                              {
                                value: momentShareUrl,
                                size: 140,
                                bgColor: "rgba(255,255,255,0)",
                                fgColor: "#1a0a2e",
                                level: "M"
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-body text-center text-white/30 leading-relaxed max-w-[200px]", children: "Scan to open this moment and invite others" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-white/10 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-body text-white/25", children: "Powered by EveryMoment" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-body text-white/25", children: "caffeine.ai" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.5 },
              className: "text-center text-xs font-body mt-4",
              style: { color: "rgba(255,255,255,0.25)" },
              children: "This pass was generated from a verified QR code scan."
            }
          )
        ] })
      ]
    }
  );
}
function EventPassPage() {
  const { momentId, userId } = useParams({
    from: "/event-pass/$momentId/$userId"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(EventPassContent, { momentId, userId });
}
export {
  EventPassPage
};
