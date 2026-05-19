import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // هذا السطر يحل مشكلة الـ Missing Export في المكتبات التي تسبب تعارضاً
    include: ["lucide-react"],
  },
});
