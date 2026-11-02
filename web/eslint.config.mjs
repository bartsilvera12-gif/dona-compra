// eslint-config-next 16 exporta configuración plana directamente, así que no
// hace falta el puente FlatCompat que traía el scaffold (y que además entraba
// en referencia circular al validarse).
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "drizzle/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
