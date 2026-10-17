import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // three.js objects (materials, uniforms) and the GL bridge state are
    // mutated every frame by design; the React Compiler rule doesn't apply.
    files: ["components/webgl/**", "components/gl/**"],
    rules: { "react-hooks/immutability": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".media-review/**"]),
]);

export default eslintConfig;
