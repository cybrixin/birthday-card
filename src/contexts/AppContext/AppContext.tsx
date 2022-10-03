import React, { useContext, useEffect, useState} from "react";
import Spinner from "@/components/Spinner";

const firebaseConfig = {
    apiKey: "AIzaSyCpkPHVtTSVw1fhRgnioZcnrqdmnidKVe8",
    projectId: "fire-apps-7827c",
    storageBucket: "fire-apps-7827c.appspot.com",
    appId: "1:693757509513:web:af240134d6cf420ca82b58",
};

const AppContext: React.Context<any> = React.createContext(null);

export function useApp() : AppConfig {
    return useContext(AppContext);
}

const { PROD } = import.meta.env;

export default function AppProvider( { children } : any ) : JSX.Element {
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ config, setConfig ] = useState<AppConfig>({
        app: null,
        storage: null,
        captcha: false
    });
    
    useEffect(() => {
        window.addEventListener("onCaptchaLoadedEvent", () => {
            setConfig({...config, captcha: !false})
            console.info("> Re-Captcha has been loaded successfully!")
        });

        window.addEventListener("onCaptchaFailedEvent", () => {
            setConfig({...config, captcha: false})
            console.error("> Re-Captcha has failed to load!");
        });
    }, []);

    useEffect(() => {
        (async function(setConfig: React.Dispatch<any>, config: AppConfig, firebaseConfig: object){
            let { app = null, storage = null } = config;
            if(app == null) {
                const { initializeApp } = await import("firebase/app");
                app = initializeApp(firebaseConfig);
            }
            
            if(storage == null) {
                const { getStorage, connectStorageEmulator } = await import("firebase/storage");
                storage = getStorage(app);

                if(!PROD) {
                    connectStorageEmulator(storage, "127.0.0.1", 8004);
                }
            }

            setConfig( { ...config, app, storage} );

        })(setConfig, config, firebaseConfig);

        setLoading(false);
    }, [])

    return (
        <AppContext.Provider value={config}>
            {loading && <Spinner />}
            {!loading && children}
        </AppContext.Provider>
    );
}