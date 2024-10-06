import { createLazyFileRoute } from '@tanstack/react-router';
import * as React from "react";
import { Hamburger } from "@fluentui/react-nav-preview";
import {
    Body1,
    Caption1,
    Card,
    CardFooter,
    CardHeader,
    makeStyles,
    Tooltip,
    Spinner
} from "@fluentui/react-components";
import { useWebViewModel } from '../components/ui/useWebViewModel';
import useCreateFeedFormAlertDialog from '../components/ui/useCreateFeedFormAlertDialog';
import { parseFeed } from 'htmlparser2';

const HomeDrawer = React.lazy(() => import("../components/HomeDrawer"));

const useStyles = makeStyles({
    root: {
        overflow: "hidden",
        display: "flex",
        height: "100vh",
        margin: 0,
        padding: 0,
    },
    content: {
        flex: "1",
        padding: "16px",
        display: "grid",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
});

export const Route = createLazyFileRoute('/')({
    component: () => {
        const [isOpen, setIsOpen] = React.useState(true);
        const styles = useStyles();
        const { Provider, openModel } = useWebViewModel();
        const [currentUrl, setCurrentUrl] = React.useState<string | null>("https://wintkhantlin.vercel.app/rss.xml");
        const [feed, setFeed] = React.useState<any>(null);
        const [loading, setLoading] = React.useState<boolean>(false);
        const createFeedFormHook = useCreateFeedFormAlertDialog();

        const fetchFeed = async (url: string) => {
            setLoading(true);
            try {
              console.log("PARSE")
                // Fetch the RSS feed content as text
                const response = await fetch(url);
                const text = await response.text();

                const parsedFeed = parseFeed(text);
                setFeed(parsedFeed); // Set the parsed feed
            } catch (error) {
                console.error("Error fetching or parsing the RSS feed:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        // Fetch initial feed
        React.useEffect(() => {
            if (currentUrl) {
                fetchFeed(currentUrl);
            }
        }, [currentUrl]); // Fetch feed whenever currentUrl changes

        return (
            <div className={styles.root}>
                <HomeDrawer isOpen={isOpen} setIsOpen={setIsOpen} createFeedFormHook={createFeedFormHook} />
                <div className="p-6 w-full space-y-4 overflow-scroll select-none">
                    {!isOpen && (
                        <Tooltip content="Navigation" relationship="label">
                            <Hamburger onClick={() => setIsOpen(!isOpen)} />
                        </Tooltip>
                    )}
                    <Body1>
                        <h1 className="text-3xl font-bold pb-8 pt-4">Wint Khant Lin RSS</h1>
                    </Body1>

                    {/* Show loading spinner while fetching feed */}
                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <Spinner />
                        </div>
                    )}

                    {/* Render feed items */}
                    {feed && feed.items && feed.items.map((item: any, index: number) => (
                        <Card key={index} className="w-full" onClick={() => openModel(item.link)}>
                            <CardHeader
                                className="pt-4"
                                header={
                                    <Body1>
                                        <h1 className="text-3xl font-semibold">{item.title}</h1>
                                    </Body1>
                                }
                                description={<Caption1>{new Date(item.pubDate).toLocaleString()} · {item.link}</Caption1>}
                            />
                            <CardFooter className="pb-4">
                                <p className="text-base">{item.contentSnippet}</p>
                            </CardFooter>
                        </Card>
                    ))}

                    {/* Handle empty feed case */}
                    {!loading && feed && feed.items && feed.items.length === 0 && (
                        <Body1>No feed items available.</Body1>
                    )}
                </div>

                <createFeedFormHook.Provider handleSubmit={(event) => {
                    console.log(event);
                    // Update URL based on user input
                    setCurrentUrl(event.url);
                }} />

                <Provider />
            </div>
        );
    },
});
