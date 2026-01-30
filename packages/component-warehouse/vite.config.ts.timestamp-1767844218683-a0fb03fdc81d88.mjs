// vite.config.ts
import { defineConfig } from "file:///home/pratikgurudatt/code/apac-ui-warehouse/node_modules/vite/dist/node/index.js";
import react from "file:///home/pratikgurudatt/code/apac-ui-warehouse/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
import dts from "file:///home/pratikgurudatt/code/apac-ui-warehouse/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/home/pratikgurudatt/code/apac-ui-warehouse/packages/component-warehouse";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: ["src/**/*.test.tsx", "src/**/*.test.ts", "src/**/*.stories.tsx"]
    })
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "ComponentWarehouse",
      formats: ["es"],
      fileName: "index"
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "antd",
        "@ant-design/icons",
        "react-router-dom",
        "framer-motion"
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
          antd: "antd",
          "@ant-design/icons": "AntDesignIcons",
          "react-router-dom": "ReactRouterDOM",
          "framer-motion": "FramerMotion"
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "styles.css";
          }
          if (assetInfo.name && /\.(png|jpg|jpeg|svg|gif|webp)$/i.test(assetInfo.name)) {
            return `assets/[name][extname]`;
          }
          return assetInfo.name || "asset";
        }
      }
    },
    cssCodeSplit: false,
    sourcemap: true,
    // Ensure CSS is extracted
    cssMinify: true
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      // For library builds, use a consistent naming scheme so class names match between build and runtime
      generateScopedName: process.env.NODE_ENV === "production" ? "[local]" : "[name]__[local]___[hash:base64:5]"
      // In dev, use hashed names
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      },
      scss: {
        additionalData: ""
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcmF0aWtndXJ1ZGF0dC9jb2RlL2FwYWMtdWktd2FyZWhvdXNlL3BhY2thZ2VzL2NvbXBvbmVudC13YXJlaG91c2VcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3ByYXRpa2d1cnVkYXR0L2NvZGUvYXBhYy11aS13YXJlaG91c2UvcGFja2FnZXMvY29tcG9uZW50LXdhcmVob3VzZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9wcmF0aWtndXJ1ZGF0dC9jb2RlL2FwYWMtdWktd2FyZWhvdXNlL3BhY2thZ2VzL2NvbXBvbmVudC13YXJlaG91c2Uvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGR0cyh7XG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuICAgICAgaW5jbHVkZTogWydzcmMvKiovKiddLFxuICAgICAgZXhjbHVkZTogWydzcmMvKiovKi50ZXN0LnRzeCcsICdzcmMvKiovKi50ZXN0LnRzJywgJ3NyYy8qKi8qLnN0b3JpZXMudHN4J10sXG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdDb21wb25lbnRXYXJlaG91c2UnLFxuICAgICAgZm9ybWF0czogWydlcyddLFxuICAgICAgZmlsZU5hbWU6ICdpbmRleCcsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW1xuICAgICAgICAncmVhY3QnLFxuICAgICAgICAncmVhY3QtZG9tJyxcbiAgICAgICAgJ3JlYWN0L2pzeC1ydW50aW1lJyxcbiAgICAgICAgJ2FudGQnLFxuICAgICAgICAnQGFudC1kZXNpZ24vaWNvbnMnLFxuICAgICAgICAncmVhY3Qtcm91dGVyLWRvbScsXG4gICAgICAgICdmcmFtZXItbW90aW9uJyxcbiAgICAgIF0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZ2xvYmFsczoge1xuICAgICAgICAgIHJlYWN0OiAnUmVhY3QnLFxuICAgICAgICAgICdyZWFjdC1kb20nOiAnUmVhY3RET00nLFxuICAgICAgICAgICdyZWFjdC9qc3gtcnVudGltZSc6ICdyZWFjdC9qc3gtcnVudGltZScsXG4gICAgICAgICAgYW50ZDogJ2FudGQnLFxuICAgICAgICAgICdAYW50LWRlc2lnbi9pY29ucyc6ICdBbnREZXNpZ25JY29ucycsXG4gICAgICAgICAgJ3JlYWN0LXJvdXRlci1kb20nOiAnUmVhY3RSb3V0ZXJET00nLFxuICAgICAgICAgICdmcmFtZXItbW90aW9uJzogJ0ZyYW1lck1vdGlvbicsXG4gICAgICAgIH0sXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lICYmIGFzc2V0SW5mby5uYW1lLmVuZHNXaXRoKCcuY3NzJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnc3R5bGVzLmNzcyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEtlZXAgb3JpZ2luYWwgbmFtZXMgZm9yIGltYWdlcyBzbyB0aGV5J3JlIHByZWRpY3RhYmxlXG4gICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lICYmIC9cXC4ocG5nfGpwZ3xqcGVnfHN2Z3xnaWZ8d2VicCkkL2kudGVzdChhc3NldEluZm8ubmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBgYXNzZXRzL1tuYW1lXVtleHRuYW1lXWA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhc3NldEluZm8ubmFtZSB8fCAnYXNzZXQnO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNzc0NvZGVTcGxpdDogZmFsc2UsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIC8vIEVuc3VyZSBDU1MgaXMgZXh0cmFjdGVkXG4gICAgY3NzTWluaWZ5OiB0cnVlLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIGNzczoge1xuICAgIG1vZHVsZXM6IHtcbiAgICAgIGxvY2Fsc0NvbnZlbnRpb246ICdjYW1lbENhc2UnLFxuICAgICAgLy8gRm9yIGxpYnJhcnkgYnVpbGRzLCB1c2UgYSBjb25zaXN0ZW50IG5hbWluZyBzY2hlbWUgc28gY2xhc3MgbmFtZXMgbWF0Y2ggYmV0d2VlbiBidWlsZCBhbmQgcnVudGltZVxuICAgICAgZ2VuZXJhdGVTY29wZWROYW1lOlxuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nXG4gICAgICAgICAgPyAnW2xvY2FsXScgLy8gSW4gcHJvZHVjdGlvbiBsaWJyYXJ5IGJ1aWxkcywgdXNlIGxvY2FsIG5hbWVzIGZvciBjb25zaXN0ZW5jeVxuICAgICAgICAgIDogJ1tuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XScsIC8vIEluIGRldiwgdXNlIGhhc2hlZCBuYW1lc1xuICAgIH0sXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgbGVzczoge1xuICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBzY3NzOiB7XG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiAnJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwWSxTQUFTLG9CQUFvQjtBQUN2YSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sU0FBUztBQUhoQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixrQkFBa0I7QUFBQSxNQUNsQixTQUFTLENBQUMsVUFBVTtBQUFBLE1BQ3BCLFNBQVMsQ0FBQyxxQkFBcUIsb0JBQW9CLHNCQUFzQjtBQUFBLElBQzNFLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxJQUFJO0FBQUEsTUFDZCxVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsVUFDUCxhQUFhO0FBQUEsVUFDYixxQkFBcUI7QUFBQSxVQUNyQixNQUFNO0FBQUEsVUFDTixxQkFBcUI7QUFBQSxVQUNyQixvQkFBb0I7QUFBQSxVQUNwQixpQkFBaUI7QUFBQSxRQUNuQjtBQUFBLFFBQ0EsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixjQUFJLFVBQVUsUUFBUSxVQUFVLEtBQUssU0FBUyxNQUFNLEdBQUc7QUFDckQsbUJBQU87QUFBQSxVQUNUO0FBRUEsY0FBSSxVQUFVLFFBQVEsa0NBQWtDLEtBQUssVUFBVSxJQUFJLEdBQUc7QUFDNUUsbUJBQU87QUFBQSxVQUNUO0FBQ0EsaUJBQU8sVUFBVSxRQUFRO0FBQUEsUUFDM0I7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLElBQ2QsV0FBVztBQUFBO0FBQUEsSUFFWCxXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUNqQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLGtCQUFrQjtBQUFBO0FBQUEsTUFFbEIsb0JBQ0UsUUFBUSxJQUFJLGFBQWEsZUFDckIsWUFDQTtBQUFBO0FBQUEsSUFDUjtBQUFBLElBQ0EscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osbUJBQW1CO0FBQUEsTUFDckI7QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNKLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
