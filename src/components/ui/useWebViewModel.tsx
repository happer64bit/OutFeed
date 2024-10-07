import { useState, useMemo, useCallback } from "react";
import { Drawer } from "vaul";
import React from "react";
import { Button, Tooltip } from "@fluentui/react-components";
import { ArrowLeft24Regular, LockClosed24Regular, LockOpen24Regular, Open24Filled } from "@fluentui/react-icons";

// Move DrawerComponent definition outside of the useWebViewModel function
const DrawerComponent = React.memo(({ isOpen, handleOpenChange, iframe, url }: { isOpen: boolean, handleOpenChange: (open: boolean) => void, iframe: JSX.Element, url: URL | null }) => (
    <Drawer.Root open={isOpen} onOpenChange={handleOpenChange} shouldScaleBackground={true}>
        <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[49]" />
            <Drawer.Content className="fixed bottom-0 left-0 z-50 bg-white dark:bg-[#1e1e1e] h-screen dark:text-white text-black">
                <div className="flex items-center px-5 gap-2">
                    <Tooltip content={"Back"} relationship="label">
                        <Button icon={<ArrowLeft24Regular />} appearance="subtle" onClick={() => handleOpenChange(false)}/>
                    </Tooltip>
                    <div className="border dark:border-[#aaa] px-6 py-1.5 mx-auto my-2 rounded-full shadow-sm dark:text-[#efefef] flex items-center line-clamp-1 gap-2">
                        {url?.protocol == "https:" ? <LockClosed24Regular /> : <LockOpen24Regular />}
                        {url ? <p>{url.hostname}{url.pathname}</p> : <p>Invalid URL</p>}
                    </div>
                    {url && (    
                        <Tooltip content={"Open In Browser"} relationship="label">
                            <Button icon={<Open24Filled />} appearance="subtle" className="ml-auto" target="_blank" href={url.toString()} as="a"/>
                        </Tooltip>
                    )}
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
