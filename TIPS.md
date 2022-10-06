# Tips <!-- omit in toc -->

## Table of Contents <!-- omit in toc -->
- [Tip 1](#tip-1)
  - [Sub Tip](#sub-tip)
- [Tip 2 ⭐⭐⭐](#tip-2-)
- [Tip 3](#tip-3)

## Tip 1

> Tip first encountered:
> [https://youtu.be/b0IZo2Aho9Y](https://youtu.be/b0IZo2Aho9Y)

Unlike Angular Scafoldding, ReactJS does not come with a Project Setup. The basics are done by vitejs or otherwise and the rest is all over the place. But an antipattern of ReactJS is not declaring stuff all over the place.

Hence the project is divided into folders named:

1. Components
2. Assets
3. App (Starting Point before main)
4. Contexts
5. Hooks (Not included, but generally declared)

Under _Components_ we have _Spinner_ subfolder. This folder will have everything related to Spinner Component (included styles as modules).

### Sub Tip

👉🏻 `Component.tsx`

```tsx
    // Function 1
    // Function 2
    // Function 3 (exported)
    
    export default function Component( ) : JSX.Element 
    {
        ....
    }
```

👆🏻 If we have to import this, we have use the full path `import { Compoenent } from ../../components/Component/Component`

Now in the same subfolder declare `index.tsx`

```tsx
    export { default, myOtherFunction } from './Component';
```

👉🏻 If we have to import now, we have use the use `import Component from ../../components/Component`.

## Tip 2 ⭐⭐⭐

> This tip was encountered at [🔗 https://youtu.be/WpgZKBtW_t8](https://youtu.be/WpgZKBtW_t8), then modified after extensive research (Google & StackOverflow 🤣).

:bulb: Quick tip: If you project is using different folders (e.g. _components_, _assets_, _contexts_) distributed at different paths, you can use this trick below in the _jsconfig.json_ or _tsconfig.json file_:

```json
{
  "baseUrl": "./src", 
  "paths": {
      "@/components/*": ["components/*"],
      "@/contexts/*": ["contexts/*"],
      "@/hooks/*": ["hooks/*"],
      "@/images/*": ["assests/images/*"],
      "@/audio/*": ["assests/audio/*"], 
      "@/util/*": ["util/*"],
      "@/icons/*": ["icons/*"]
  }
}
```

👆🏻 The `paths` above are relative to the `baseUrl` and now if you like to include a component instead of writting `import { abc } from ../../../components/Component` (👈🏻 awfully 😟 long path), just shorten it as `import { abc } from @/components/Component`

👆🏻 This tip will not work alone in tsconfig.json, i.e. vitejs still does not know `@`.

For that you need `@types/node` and an `alias` in [vite.config.ts](vite.config.ts), which looks like:

```ts
...
resolve: {
    alias: [
      { find: '@', replacement: path.join(path.resolve(__dirname, 'src')) },
    ],
}
...
```

## Tip 3

Please copy and paste [static.d.ts](./types/static.d.ts) file. This will contain all types of "assets" (like CSS, SCSS, SASS, SVG, PNG etc...) we use.

Additionally the following was added the SVG:

```ts
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>; 
  // 👆🏻 This property helps import SVG as ReactComponent.
  ...
}
```

However to use SVG, please include plugin `vite-plugin-svgr`.

---

These tips helped me a ton. You may choose to follow them hoping the project will be a bit more organized.

Thanks,

Anweshan Roy Chowdhury.
