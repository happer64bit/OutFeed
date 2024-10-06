import { useState, useMemo, useCallback } from "react";
import { Drawer } from "vaul";
import React from "react";
import { Button } from "@fluentui/react-components";
import { ArrowSync24Regular, ArrowLeft24Regular, DocumentBulletList24Regular,  } from "@fluentui/react-icons";

// Move DrawerComponent definition outside of the useWebViewModel function
const DrawerComponent = React.memo(({ isOpen, handleOpenChange, iframe, url }: { isOpen: boolean, handleOpenChange: (open: boolean) => void, iframe: JSX.Element, url: URL | null }) => (
    <Drawer.Root open={isOpen} onOpenChange={handleOpenChange} shouldScaleBackground={true}>
        <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[49]" />
            <Drawer.Content className="fixed bottom-0 left-0 z-50 bg-white h-screen">
                <div className="flex items-center px-5 gap-2">
                    <Button icon={<ArrowLeft24Regular />} appearance="subtle" onClick={() => handleOpenChange(false)}/>
                    <div className="border px-6 py-1.5 mx-auto my-1 rounded-full shadow-sm">
                        {url ? <p>{url.hostname}{url.pathname}</p> : <p>Invalid URL</p>}
                    </div>
                    <Button icon={<DocumentBulletList24Regular />} appearance="subtle" className="ml-auto">
                        Reading Mode
                    </Button>
                </div>
                {iframe}
            </Drawer.Content>
        </Drawer.Portal>
    </Drawer.Root>
));

export function useWebViewModel() {
    const [url, setUrl] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Memoize the onOpenChange handler to prevent unnecessary re-renders
    const handleOpenChange = useCallback((open: boolean) => {
        setIsOpen(open);
    }, []);

    // Memoize the iframe to prevent unnecessary re-renders
    const iframe = useMemo(() => (
        <iframe
            allowFullScreen
            src={url}
            className={`h-full w-screen bg-white`}
            loading="lazy"
        />
    ), [url]);

    // Try to create a valid URL object, if invalid return null
    const validUrl = useMemo(() => {
        try {
            return url ? new URL(url) : null;
        } catch (e) {
            return null;
        }
    }, [url]);

    const Provider = React.memo(() => (
        <DrawerComponent isOpen={isOpen} handleOpenChange={handleOpenChange} iframe={iframe} url={validUrl} />
    ));

    function openModel(url: string) {
        setUrl(url);
        setIsOpen(true);
    }

    return {
        Provider,
        openModel,
    };
}
