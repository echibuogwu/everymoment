import { r as reactExports, j as jsxRuntimeExports, C as React, u as useAuth, a as useBackend, b as useProfile, c as useNavigate, L as LoadingSpinner } from "./index-CqHW4ujE.js";
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use = React[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a, _b;
  let getter = (_a = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot2 = /* @__PURE__ */ createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot2 : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function AuthGuard({
  children,
  requireAuth = true,
  requireProfile = true,
  currentPath = ""
}) {
  const { isAuthenticated, isInitializing } = useAuth();
  const { actor } = useBackend();
  const { isLoading: isProfileLoading, hasProfile } = useProfile();
  const navigate = useNavigate();
  const [actorTimedOut, setActorTimedOut] = reactExports.useState(false);
  const actorTimeoutRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (requireAuth && isAuthenticated && !actor && !actorTimedOut) {
      console.log(
        "[AuthGuard] Authenticated, waiting for actor initialization..."
      );
      actorTimeoutRef.current = setTimeout(() => {
        console.error("[AuthGuard] Actor initialization timed out after 15s");
        setActorTimedOut(true);
      }, 15e3);
    }
    if (actor && actorTimeoutRef.current) {
      console.log(
        "[AuthGuard] Actor initialized successfully, clearing timeout."
      );
      clearTimeout(actorTimeoutRef.current);
      actorTimeoutRef.current = null;
      setActorTimedOut(false);
    }
    return () => {
      if (actorTimeoutRef.current) {
        clearTimeout(actorTimeoutRef.current);
      }
    };
  }, [requireAuth, isAuthenticated, actor, actorTimedOut]);
  reactExports.useEffect(() => {
    if (!isAuthenticated) {
      setActorTimedOut(false);
      if (actorTimeoutRef.current) {
        clearTimeout(actorTimeoutRef.current);
        actorTimeoutRef.current = null;
      }
    }
  }, [isAuthenticated]);
  reactExports.useEffect(() => {
    if (!requireAuth) return;
    if (isInitializing) return;
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    if (!actor) return;
    if (isProfileLoading) return;
    if (requireProfile && !hasProfile && currentPath !== "/onboarding") {
      navigate({ to: "/onboarding" });
      return;
    }
    if (hasProfile && currentPath === "/onboarding") {
      navigate({ to: "/dashboard" });
    }
  }, [
    requireAuth,
    isInitializing,
    isAuthenticated,
    actor,
    isProfileLoading,
    hasProfile,
    requireProfile,
    currentPath,
    navigate
  ]);
  if (!requireAuth) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
  }
  if (isInitializing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  }
  if (!isAuthenticated) {
    return null;
  }
  if (isAuthenticated && !actor) {
    if (actorTimedOut) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-body font-medium text-base", children: "Connection took too long" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm max-w-[280px]", children: "Unable to connect to the backend. Please refresh the page to try again." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => window.location.reload(),
            className: "mt-2 px-5 py-2.5 bg-foreground text-background rounded-xl font-body font-semibold text-sm hover:opacity-90 transition-opacity",
            "data-ocid": "actor-timeout-retry",
            children: "Refresh page"
          }
        )
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  }
  if (isAuthenticated && isProfileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { fullScreen: true });
  }
  if (requireProfile && !hasProfile && currentPath !== "/onboarding") {
    return null;
  }
  if (hasProfile && currentPath === "/onboarding") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
export {
  AuthGuard as A,
  Primitive as P,
  Slot as S,
  composeRefs as c,
  useComposedRefs as u
};
