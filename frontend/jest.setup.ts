import "@testing-library/jest-dom";
import React from "react";

// Mock PointerEvent for Framer Motion in jsdom
class MockPointerEvent extends MouseEvent {
    constructor(type: string, props: PointerEventInit = {}) {
        super(type, props);
        Object.assign(this, {
            pointerId: props.pointerId ?? 0,
            width: props.width ?? 1,
            height: props.height ?? 1,
            pressure: props.pressure ?? 0,
            tangentialPressure: props.tangentialPressure ?? 0,
            tiltX: props.tiltX ?? 0,
            tiltY: props.tiltY ?? 0,
            twist: props.twist ?? 0,
            pointerType: props.pointerType ?? "mouse",
            isPrimary: props.isPrimary ?? false,
        });
    }
}

// @ts-expect-error - Polyfill for jsdom
global.PointerEvent = MockPointerEvent;

// Mock matchMedia for Framer Motion
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock ResizeObserver for animations
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Global mock for framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => {
    // Create mock components that pass through props and children
    const createMockComponent = (element: string) =>
        React.forwardRef<
            HTMLElement,
            React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>
        >(({ children, ...props }, ref) => {
            // Filter out framer-motion specific props
            const {
                initial,
                animate,
                exit,
                variants,
                transition,
                whileHover,
                whileTap,
                whileFocus,
                layoutId,
                ...validProps
            } = props as Record<string, unknown>;

            return React.createElement(
                element,
                { ...validProps, ref },
                children
            );
        });

    return {
        motion: {
            div: createMockComponent("div"),
            span: createMockComponent("span"),
            button: createMockComponent("button"),
            a: createMockComponent("a"),
            ul: createMockComponent("ul"),
            li: createMockComponent("li"),
            p: createMockComponent("p"),
            h1: createMockComponent("h1"),
            h2: createMockComponent("h2"),
            h3: createMockComponent("h3"),
            section: createMockComponent("section"),
            article: createMockComponent("article"),
            nav: createMockComponent("nav"),
            header: createMockComponent("header"),
            footer: createMockComponent("footer"),
            form: createMockComponent("form"),
            input: createMockComponent("input"),
            label: createMockComponent("label"),
        },
        AnimatePresence: ({ children }: { children: React.ReactNode }) =>
            children,
        useAnimation: () => ({
            start: jest.fn(),
            stop: jest.fn(),
            set: jest.fn(),
        }),
        useMotionValue: (initial: number) => ({
            get: () => initial,
            set: jest.fn(),
            onChange: jest.fn(),
        }),
        useTransform: (value: unknown, transform: (v: unknown) => unknown) =>
            value,
        useSpring: (value: unknown) => value,
        useInView: () => true,
        useCycle: <T>(...items: T[]) => [items[0], jest.fn()],
    };
});
