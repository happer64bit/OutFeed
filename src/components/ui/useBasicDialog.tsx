import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, makeStyles } from '@fluentui/react-components'
import { useCallback, useState } from 'react';

const useStyles = makeStyles({
    content: {
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
    },
});

export default function useBasicDialog() {
    const styles = useStyles();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [data, setData] = useState({
        title: "",
        message: <></>
    })

    const closeDialog = useCallback(() => setIsOpen(false), []);

    const onOpenChange = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    function showDialog(props: { title: string, message: JSX.Element }) {
        setData(props);
        setIsOpen(true)
    }

    function BasicDialogProvider() {
        return (
            <Dialog modalType="alert" open={isOpen} onOpenChange={onOpenChange}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{data.title}</DialogTitle>
                        <DialogContent className={styles.content}>
                            {data.message}
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="primary" onClick={closeDialog}>
                                Okay
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        )
    }

    return {
        BasicDialogProvider,
        showDialog
    }
}