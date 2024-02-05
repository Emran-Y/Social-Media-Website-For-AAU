import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default {
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@pages": "/src/pages",
      "@conditionalPage": "/src/conditionalPages",
      // Add more aliases as needed
    },
  },
};
