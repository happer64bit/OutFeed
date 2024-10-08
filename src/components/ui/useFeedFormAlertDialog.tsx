import React, { useState, useCallback } from "react";
import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogContent,
    DialogBody,
    DialogActions,
    Button,
    Input,
    Label,
    makeStyles,
    Spinner,
} from "@fluentui/react-components";

const useStyles = makeStyles({
    content: {
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
    },
});

export default function useFeedFormAlertDialog() {
    const styles = useStyles();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const displayDialog = () => {
        setIsOpen(true);
    };

    function Provider(
        { handleSubmit, defaultValues = { label: "", url: "" }, title = "Create Feed" }: 
        { 
            handleSubmit: (data: { label: string; url: string }) => void,
            defaultValues?: { label: string; url: string },
            title?: string
        }
    ) {
        const [label, setLabel] = useState(defaultValues.label);
        const [url, setUrl] = useState(defaultValues.url);
        const [isLoading, setIsLoading] = useState<boolean>(false);

        const closeDialog = useCallback(() => setIsOpen(false), []);
        const onOpenChange = useCallback(() => setIsOpen(!isOpen), [isOpen]);

        const onSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoading(true);
            handleSubmit({ label, url });
            setIsLoading(false);
            closeDialog();
        };

        return (
            <Dialog modalType="alert" open={isOpen} onOpenChange={onOpenChange}>
                <DialogSurface aria-describedby={undefined}>
                    <form onSubmit={onSubmit}>
                        <DialogBody>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogContent className={styles.content}>
                                {JSON.stringify(defaultValues)}
                                <Label required htmlFor={"label-input"}>
                                    Feed Label
                                </Label>
                                <Input
                                    required
                                    id={"label-input"}
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                />
                                <Label required htmlFor={"url-input"}>
                                    RSS Feed URL
                                </Label>
                                <Input
                                    required
                                    type="text"
                                    id={"url-input"}
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button appearance="secondary" onClick={closeDialog}>
                                    Close
                                </Button>
                                <Button type="submit" appearance="primary" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Spinner size="tiny" />
                                            Loading...
                                        </>
                                    ) : <>Submit</>}
                                </Button>
                            </DialogActions>
                        </DialogBody>
                    </form>
                </DialogSurface>
            </Dialog>
        );
    };

    return {
        displayDialog,
        Provider,
    };
}
