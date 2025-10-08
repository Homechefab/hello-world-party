// @ts-check
/** @type {import('lovable-tagger').Config} */
export default {
  title: "Home Chef AB",
  description: "Component library for Home Chef AB",
  repositoryUrl: "https://github.com/Homechefab/hello-world-party",
  components: {
    paths: ["src/components/**/*.tsx"],
    ignore: ["src/components/**/*.test.tsx", "src/components/**/*.spec.tsx"],
  },
  groups: [
    {
      name: "UI Components",
      match: "src/components/ui/**/*.tsx",
      description: "Reusable UI components based on shadcn/ui"
    },
    {
      name: "Features",
      match: "src/components/*.tsx",
      description: "Feature-specific components"
    },
    {
      name: "Pages",
      match: "src/pages/**/*.tsx",
      description: "Page components"
    }
  ]
}