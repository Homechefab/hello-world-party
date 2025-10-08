// lovable.config.ts
export default {
  enabled: true,
  preview: true,
  title: "Home Chef AB",
  links: {
    repositoryUrl: "https://github.com/Homechefab/hello-world-party",
    documentationUrl: "https://homechefab.com/docs"
  },
  groups: {
    "UI Components": {
      glob: "src/components/ui/**/*.tsx",
      description: "Reusable UI components based on shadcn/ui"
    },
    "Features": {
      glob: "src/components/*.tsx",
      description: "Feature-specific components"
    },
    "Pages": {
      glob: "src/pages/**/*.tsx",
      description: "Page components"
    }
  }
}