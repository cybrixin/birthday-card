import React, { useContext, useEffect, useState} from "react";
import Spinner from "@/components/Spinner";
import type { resource } from "@/util/util";

const firebaseConfig = {
    apiKey: "AIzaSyCpkPHVtTSVw1fhRgnioZcnrqdmnidKVe8",
    projectId: "fire-apps-7827c",
    storageBucket: "fire-apps-7827c.appspot.com",
    appId: "1:693757509513:web:af240134d6cf420ca82b58",
    measurementId: "G-FD8V1MZYJ0"
};

const { PUBLIC_RECAPTCHA_v3_SITE_KEY } = import.meta.env;

const AppContext: React.Context<any> = React.createContext(null);

export function useApp() : AppConfig {
    return useContext(AppContext);
}

const { PROD } = import.meta.env;


type linkLoad = {
    [key: string]: boolean
};

type props = {
    children: any;
    resource: resource[];
}

export default function AppProvider( { children, resource }: props) : JSX.Element {
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ logE, setLogEvent ] = useState<any>(null);
    const [ linkLoaded, setLinkLoaded ] = useState<linkLoad>({});
    const [ config, setConfig ] = useState<AppConfig>({
        app: null,
        storage: null,
        appCheck: null,
        analytics: null,
    });

    useEffect( () => {
        if(!loading) {
            if(typeof resource !== 'undefined' && resource?.length > 0) {
                
                if(linkLoaded === null) {
                    setLinkLoaded({});
                };

                // @ts-ignore
                resource?.forEach( (  { attr:{src = null, href = null} } , key ) => {
                
                    if( src == null && href == null ) {
                        // Delete the resource;
                        delete resource[key];
                    }

                    resource[key]['url'] = src ?? href;

                    setLinkLoaded( (ln) => (
                        {
                            ...ln,
                            [src ?? href]: false,
                        }
                    ));
                });

                (async (resource) => {
                    const { loadx } = await import("@/util/util");
                    resource.forEach( res => {
                        const { parent, tag, attr } = res;
                        const url : string = (res.url ?? "") as string;
                        if( !(url in linkLoaded ) ) {
                            loadx({ parent, tag, attr }).then( _ => {
                                setLinkLoaded( (ln) => (
                                    {
                                        ...ln,
                                        [url]: true,
                                    }
                                ));
                            });
                        }                        
                    });
                    
                })(resource);
            }
        }
    }, [loading])

    useEffect(() => {
        if(loading) {

            const { app = null, storage , appCheck = null } = config;
            if(app != null && storage != null && appCheck != null ) {
                return;
            }
            (async function(setConfig: React.Dispatch<any>, config: AppConfig, firebaseConfig: object){
                let { app = null, storage, appCheck = null, analytics = null } = config;
                if(app == null) {
                    const { initializeApp } = await import("firebase/app");
                    app = initializeApp(firebaseConfig);
                }
                
                if(storage == null) {
                    const { getStorage, connectStorageEmulator } = await import("firebase/storage");
                    
                    storage = getStorage(app);

                    if(!PROD) {
                        const { PUBLIC_FIREBASE_EMULATOR_STORAGE_HOST, PUBLIC_FIREBASE_EMULATOR_STORAGE_PORT } = import.meta.env;
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
                
                if('measurementId' in firebaseConfig && appCheck == null) {
                    const { getAnalytics, logEvent } = await import("firebase/analytics");
                    setLogEvent(logEvent);
                    analytics = getAnalytics(app);
                }

                setConfig( { app, storage, appCheck, analytics } );

            })(setConfig, config, firebaseConfig);

            setLoading(false);
        }

        document.addEventListener("logEvent", (evt) => {
            // There must be some options
            if(logE != null && config != null && config.analytics != null) {
                const { analytics } = config;
                
            }
        });
    }, [])

    return (
        <AppContext.Provider value={config}>
            {loading ? <Spinner /> : children}
        </AppContext.Provider>
    );
}