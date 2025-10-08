const config = {
  input: "src/components",
  output: "dist-lovable",
  title: "Home Chef AB Components",
  description: "Component library for Home Chef AB",
  include: ["**/*.tsx"],
  exclude: ["**/*.test.tsx", "**/*.spec.tsx", "**/*.stories.tsx"],
  groups: [
    {
      id: "ui",
      title: "UI Components",
      pattern: "**/ui/**/*.tsx",
      description: "Reusable UI components based on shadcn/ui"
    },
    {
      id: "features",
      title: "Feature Components",
      pattern: "**/!(ui)/*.tsx",
      description: "Feature-specific components"
    },
    {
      id: "pages",
      title: "Pages",
      pattern: "**/pages/**/*.tsx",
      description: "Page components"
    }
  ],
  typescript: {
    compilerOptions: {
      jsx: "react-jsx"
    }
  }
};

export default config;