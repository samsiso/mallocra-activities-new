// Enhanced polyfills for server-side environment to fix Supabase and other library issues

// Check if we're in a server environment (includes build time)
const isServer = typeof window === "undefined" && typeof global !== "undefined"

if (isServer) {
  // Define 'self' for server-side to prevent errors with browser-specific libraries
  if (typeof self === "undefined") {
    ;(global as any).self = global
  }

  // Mock window object for server-side with proper location and history objects
  if (typeof window === "undefined") {
    ;(global as any).window = {
      ...global,
      location: {
        href: "http://localhost:3000",
        protocol: "http:",
        host: "localhost:3000",
        hostname: "localhost",
        port: "3000",
        pathname: "/",
        search: "",
        hash: "",
        origin: "http://localhost:3000",
        assign: () => {},
        replace: () => {},
        reload: () => {}
      },
      history: {
        length: 1,
        scrollRestoration: "auto",
        state: null,
        back: () => {},
        forward: () => {},
        go: () => {},
        pushState: () => {},
        replaceState: () => {}
      },
      scrollY: 0,
      innerWidth: 1024,
      innerHeight: 768,
      matchMedia: () => ({
        matches: false,
        media: "",
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true
      }),
      addEventListener: function (type: string, listener: any, options?: any) {
        // Mock implementation that does nothing but doesn't throw
        return undefined
      },
      removeEventListener: function (
        type: string,
        listener: any,
        options?: any
      ) {
        // Mock implementation that does nothing but doesn't throw
        return undefined
      },
      dispatchEvent: function (event: any) {
        // Mock implementation that always returns true
        return true
      },
      open: () => null,
      scrollTo: () => {},
      requestAnimationFrame: (cb: Function) => setTimeout(cb, 16),
      cancelAnimationFrame: (id: number) => clearTimeout(id)
    }
  }

  // Mock WebSocket for server-side (used by Supabase realtime)
  if (typeof WebSocket === "undefined") {
    ;(global as any).WebSocket = class MockWebSocket {
      static CONNECTING = 0
      static OPEN = 1
      static CLOSING = 2
      static CLOSED = 3

      readyState = 0
      url = ""
      protocol = ""

      constructor(url?: string, protocols?: string | string[]) {
        this.url = url || ""
        // Mock WebSocket that does nothing
      }

      close() {
        this.readyState = 3
      }

      send() {}

      addEventListener() {}
      removeEventListener() {}
    }
  }

  // Mock other browser APIs that might be used
  if (typeof document === "undefined") {
    ;(global as any).document = {
      createElement: (tag: string) => ({
        tagName: tag.toUpperCase(),
        style: {},
        className: "",
        id: "",
        innerHTML: "",
        innerText: "",
        textContent: "",
        setAttribute: () => {},
        getAttribute: () => null,
        removeAttribute: () => {},
        appendChild: () => {},
        removeChild: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        click: () => {},
        focus: () => {},
        blur: () => {}
      }),
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      getElementsByClassName: () => [],
      getElementsByTagName: () => [],
      documentElement: {
        outerHTML: "",
        style: {}
      },
      head: {
        appendChild: () => {},
        removeChild: () => {}
      },
      body: {
        appendChild: () => {},
        removeChild: () => {},
        style: {}
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      createTextNode: (text: string) => ({ textContent: text }),
      cookie: ""
    }
  }

  if (typeof navigator === "undefined") {
    ;(global as any).navigator = {
      userAgent: "Node.js Server-Side Rendering",
      language: "en-US",
      languages: ["en-US"],
      platform: "server",
      onLine: true,
      cookieEnabled: false,
      clipboard: {
        writeText: () => Promise.resolve(),
        readText: () => Promise.resolve("")
      }
    }
  }

  // Mock localStorage and sessionStorage for server-side
  const mockStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0
  }

  if (typeof localStorage === "undefined") {
    ;(global as any).localStorage = mockStorage
  }

  if (typeof sessionStorage === "undefined") {
    ;(global as any).sessionStorage = mockStorage
  }

  // Mock other common browser globals
  if (typeof location === "undefined") {
    ;(global as any).location = {
      href: "http://localhost:3000",
      protocol: "http:",
      host: "localhost:3000",
      hostname: "localhost",
      port: "3000",
      pathname: "/",
      search: "",
      hash: "",
      origin: "http://localhost:3000",
      assign: () => {},
      replace: () => {},
      reload: () => {}
    }
  }

  // Mock history object for server-side (Clerk needs this)
  if (typeof history === "undefined") {
    ;(global as any).history = {
      length: 1,
      scrollRestoration: "auto",
      state: null,
      back: () => {},
      forward: () => {},
      go: () => {},
      pushState: () => {},
      replaceState: () => {}
    }
  }

  // Mock Intersection Observer
  if (typeof IntersectionObserver === "undefined") {
    ;(global as any).IntersectionObserver = class MockIntersectionObserver {
      constructor(callback: Function, options?: any) {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }

  // Mock ResizeObserver
  if (typeof ResizeObserver === "undefined") {
    ;(global as any).ResizeObserver = class MockResizeObserver {
      constructor(callback: Function) {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }

  // Mock fetch if not available (though Node.js 18+ has it)
  if (typeof fetch === "undefined") {
    ;(global as any).fetch = () =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Server-side fetch not available",
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(""),
        blob: () => Promise.resolve(new Blob()),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0))
      })
  }
}

export {}
