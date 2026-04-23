# Sifan Pan — Portfolio

基于 React、TypeScript 与 Vite 的作品集站点（长卷轴 + 局部交互）。

## 发布到 GitHub（GitHub Pages）

1. 在 GitHub 上**新建空仓库**（可命名为 `coo-portfolio` 或任意名；`BASE_PATH` 会与仓库名自动对齐）。
2. 在本机项目目录执行（将 `你的用户名` 和 `仓库名` 换成实际值）：

```bash
cd /path/to/coo-portfolio
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

3. 在 GitHub 打开该仓库 → **Settings** → **Pages** → **Build and deployment** → **Source** 选 **GitHub Actions**（不要选 “Deploy from a branch” 里的 `gh-pages` 分支，除非你改用那种方式）。

4. 等待 **Actions** 里 *Deploy to GitHub Pages* 变绿。站点地址一般为：

`https://你的用户名.github.io/仓库名/`

5. 若你后来**改了仓库名**，重跑一次 workflow 即可（`BASE_PATH` 来仓库名，无需改代码）。

---

以下内容为 Vite 模板的原说明，可忽略。

## React + TypeScript + Vite（模板原文）

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
