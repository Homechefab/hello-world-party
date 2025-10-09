module.exports = {
  input: "./src/components",
  output: "./dist-lovable",
  title: "HomeChef Components",
  description: "Component library for HomeChef AB",
  include: ["**/*.tsx"],
  exclude: ["**/*.test.*", "**/*.spec.*", "**/*.stories.*"],
  groups: [
    {
      id: "components",
      title: "Components",
      pattern: "*.tsx",
      description: "All components"
    }
  ]
}