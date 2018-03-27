# Thesis
Author: *Giacomo De Liberali, 857174@stud.unive.it*

## Client
This is the client side section of the application

### Development
To properly generate *typedoc* reference APIs ensure 'node_modules/@types/node/index.ts' ha the following modifications:
```typescript
...

// Comment this declaration
/* interface NodeModule {
    exports: any;
    require: NodeRequireFunction;
    id: string;
    filename: string;
    loaded: boolean;
    parent: NodeModule | null;
    children: NodeModule[];
    paths: string[];
} */

// And replace with this
interface NodeModule {
    id: string;
}

// Otherwise the following line will throw a transpile error
declare var module: NodeModule;

...
```