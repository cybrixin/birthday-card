import React, { useContext, useEffect, useState} from "react";
import Spinner from "@/components/Spinner";

const firebaseConfig = {
    apiKey: "AIzaSyCpkPHVtTSVw1fhRgnioZcnrqdmnidKVe8",
    projectId: "fire-apps-7827c",
    storageBucket: "fire-apps-7827c.appspot.com",
    appId: "1:693757509513:web:af240134d6cf420ca82b58",
};

const { PUBLIC_RECAPTCHA_v3_SITE_KEY, PUBLIC_FIREBASE_EMULATOR_STORAGE_HOST, PUBLIC_FIREBASE_EMULATOR_STORAGE_PORT } = import.meta.env;

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
        appCheck: null,
    });

    useEffect(() => {
        if(loading) {
            const { app = null, storage , appCheck = null } = config;
            if(app != null && storage != null && appCheck != null ) {
                return;
            }
            (async function(setConfig: React.Dispatch<any>, config: AppConfig, firebaseConfig: object){
                let { app = null, storage, appCheck = null } = config;
                if(app == null) {
                    const { initializeApp } = await import("firebase/app");
                    app = initializeApp(firebaseConfig);
                }
                
                if(storage == null) {
                    const { getStorage, connectStorageEmulator } = await import("firebase/storage");
                    
                    storage = getStorage(app);

                    if(!PROD) {
                        connectStorageEmulator(storage, PUBLIC_FIREBASE_EMULATOR_STORAGE_HOST, parseInt(PUBLIC_FIREBASE_EMULATOR_STORAGE_PORT));
                    }
                }

                if(appCheck == null) {
                    const { initializeAppCheck, ReCaptchaV3Provider } = await import ("firebase/app-check");
                    
                    // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
                    // key is the counterpart to the secret key you set in the Firebase console.
                    appCheck = initializeAppCheck(app, {
                    provider: new ReCaptchaV3Provider(PUBLIC_RECAPTCHA_v3_SITE_KEY),
                    isTokenAutoRefreshEnabled: true
                    });
                }

                setConfig( { app, storage, appCheck } );

            })(setConfig, config, firebaseConfig);

            setLoading(false);
        }
    }, [])

    return (
        <AppContext.Provider value={config}>
            {loading ? <Spinner /> : children}
        </AppContext.Provider>
    );
}