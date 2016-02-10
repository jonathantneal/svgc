# svgc

[![NPM Version][npm-img]][npm]

[svgc] is a command line tool that converts SVG spritemaps into CSS stylesheets.

```sh
npm install -g svgc
```

### Usage

Pass your SVG spritemap into **svgc**.

```sh
svgc assets/svg/symbol-defs.svg
```

**svgc** will read the contents of the SVG and find any symbols with ids.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
	<symbol id="camera" viewBox="0 0 512 512">
		<path d="M152 304c0 57.438 46.562 104 104 104s104-46.562 104-104-46.562-104-104-104-104 46.562-104 104zm328-176h-112c-8-32-16-64-48-64h-128c-32 0-40 32-48 64h-112c-17.6 0-32 14.4-32 32v288c0 17.6 14.4 32 32 32h448c17.6 0 32-14.4 32-32v-288c0-17.6-14.4-32-32-32zm-224 318c-78.425 0-142-63.574-142-142 0-78.425 63.575-142 142-142 78.426 0 142 63.575 142 142 0 78.426-63.573 142-142 142zm224-222h-64v-32h64v32z"/>
	</symbol>
	<symbol id="pencil">
		<path d="M432 0c44.182 0 80 35.817 80 80 0 18.01-5.955 34.629-16 48l-32 32-112-112 32-32c13.371-10.045 29.989-16 48-16zm-400 368l-32 144 144-32 296-296-112-112-296 296zm325.789-186.211l-224 224-27.578-27.578 224-224 27.578 27.578z"/>
	</symbol>
</svg>
```

**svgc** will produce a CSS stylesheet with those symbols inlined as data URIs.

```css
.camera {
	background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E %3Cpath d=%22M152 304c0 57.438 46.562 104 104 104s104-46.562 104-104-46.562-104-104-104-104 46.562-104 104zm328-176h-112c-8-32-16-64-48-64h-128c-32 0-40 32-48 64h-112c-17.6 0-32 14.4-32 32v288c0 17.6 14.4 32 32 32h448c17.6 0 32-14.4 32-32v-288c0-17.6-14.4-32-32-32zm-224 318c-78.425 0-142-63.574-142-142 0-78.425 63.575-142 142-142 78.426 0 142 63.575 142 142 0 78.426-63.573 142-142 142zm224-222h-64v-32h64v32z%22/%3E %3C/svg%3E);
}

.pencil {
	background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E %3Cpath d=%22M432 0c44.182 0 80 35.817 80 80 0 18.01-5.955 34.629-16 48l-32 32-112-112 32-32c13.371-10.045 29.989-16 48-16zm-400 368l-32 144 144-32 296-296-112-112-296 296zm325.789-186.211l-224 224-27.578-27.578 224-224 27.578 27.578z%22/%3E %3C/svg%3E);
}
```

### Options

#### `--prefix <prefix>`

Prepends this prefix and a dash to each CSS selector.

```sh
svg/symbol-defs.svg --prefix icon
```

```css
.icon-camera { ... }

.icon-pencil { ... }
```

#### `--suffix <suffix>`

Appends this suffix to each CSS selector.

```sh
svg/symbol-defs.svg --suffix ::after
```

```css
.camera::after { ... }

.pencil::after { ... }
```

#### `--url <file>`

Use an external url and reference fragments rather than inlining the contents of the SVG.

```sh
svg/symbol-defs.svg --url ../svg/symbol-defs.svg
```

```css
.camera {
	background-image: url(../svg/symbol-defs.svg#camera);
}

.pencil {
	background-image: url(../svg/symbol-defs.svg#pencil);
}
```

#### `--base64`

Use base64-encoded data URIs when generating the stylesheet.

```sh
svg/symbol-defs.svg --base64
```

```css
.camera {
	background-image: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTUyIDMwNGMwIDU3LjQzOCA0Ni41NjIgMTA0IDEwNCAxMDRzMTA0LTQ2LjU2MiAxMDQtMTA0LTQ2LjU2Mi0xMDQtMTA0LTEwNC0xMDQgNDYuNTYyLTEwNCAxMDR6bTMyOC0xNzZoLTExMmMtOC0zMi0xNi02NC00OC02NGgtMTI4Yy0zMiAwLTQwIDMyLTQ4IDY0aC0xMTJjLTE3LjYgMC0zMiAxNC40LTMyIDMydjI4OGMwIDE3LjYgMTQuNCAzMiAzMiAzMmg0NDhjMTcuNiAwIDMyLTE0LjQgMzItMzJ2LTI4OGMwLTE3LjYtMTQuNC0zMi0zMi0zMnptLTIyNCAzMThjLTc4LjQyNSAwLTE0Mi02My41NzQtMTQyLTE0MiAwLTc4LjQyNSA2My41NzUtMTQyIDE0Mi0xNDIgNzguNDI2IDAgMTQyIDYzLjU3NSAxNDIgMTQyIDAgNzguNDI2LTYzLjU3MyAxNDItMTQyIDE0MnptMjI0LTIyMmgtNjR2LTMyaDY0djMyeiIvPgo8L3N2Zz4=);
}

.pencil {
	background-image: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNNDMyIDBjNDQuMTgyIDAgODAgMzUuODE3IDgwIDgwIDAgMTguMDEtNS45NTUgMzQuNjI5LTE2IDQ4bC0zMiAzMi0xMTItMTEyIDMyLTMyYzEzLjM3MS0xMC4wNDUgMjkuOTg5LTE2IDQ4LTE2em0tNDAwIDM2OGwtMzIgMTQ0IDE0NC0zMiAyOTYtMjk2LTExMi0xMTItMjk2IDI5NnptMzI1Ljc4OS0xODYuMjExbC0yMjQgMjI0LTI3LjU3OC0yNy41NzggMjI0LTIyNCAyNy41NzggMjcuNTc4eiIvPgo8L3N2Zz4=);
}
```

[ci]:      https://travis-ci.org/jonathantneal/svgc
[ci-img]:  https://img.shields.io/travis/jonathantneal/svgc.svg
[npm]:     https://www.npmjs.com/package/svgc
[npm-img]: https://img.shields.io/npm/v/svgc.svg

[svgc]: https://github.com/jonathantneal/svgc
