# business_app

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

[{"error":"Error","message":"SQLITE_CONSTRAINT: UNIQUE constraint failed: categories.description","user_message":"description must be unique"}]

errorMessage() {
const errors = this.$store.state.categories.errors;
if (errors && errors.length > 0) {
return errors[0].user_message;
}
return "";
},
