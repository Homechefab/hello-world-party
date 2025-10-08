export default {
  name: "Home Chef AB Components",
  description: "Component library for Home Chef AB",
  components: {
    sourcePath: "./src/components",
    include: ["**/*.tsx"],
    exclude: ["**/*.test.tsx", "**/*.spec.tsx", "**/*.stories.tsx"],
  },
  outDir: "dist-lovable",
  serve: {
    port: 3000,
    host: "localhost"
  }
}