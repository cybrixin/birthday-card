/// <reference types="vite/client" />

// Declared here as these types will be referenced elsewhere...

type AppConfig = {
    storage: any;
    app: any;
    appCheck: any;
    analytics?: any;
};

type CardProps = {
    greet: string;
};