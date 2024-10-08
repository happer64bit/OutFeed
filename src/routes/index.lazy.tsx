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
    Spinner
} from "@fluentui/react-components";
import { useWebViewModel } from '../components/ui/useWebViewModel';
import useFeedFormAlertDialog from '../components/ui/useFeedFormAlertDialog';
import { parseFeed } from 'htmlparser2';
import Database from '@tauri-apps/plugin-sql';
import useBasicDialog from '../components/ui/useBasicDialog';
import z from 'zod';
import { fetch } from "@tauri-apps/plugin-http"

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
        const [currentUrl, setCurrentUrl] = React.useState<string | null>(null);
        const [feed, setFeed] = React.useState<any>(null);
        const [loading, setLoading] = React.useState<boolean>(false);
        const createFeedFormHook = useFeedFormAlertDialog();
        const [database, setDatabase] = React.useState<Database | null>();
        const [savedFeedList, setSavedFeedList] = React.useState<any[]>([]);
        const [isFeedSearchLoading, setIsFeedSearchLoading] = React.useState<boolean>(true);
        const { BasicDialogProvider, showDialog } = useBasicDialog();
        const [selectedFeedLabel, setSelectedFeedLabel] = React.useState<string | null>(null);

        // Fetch the feed data from the specified URL
        const fetchFeed = async (url: string) => {
            setLoading(true);
            try {
                const response = await fetch(url);
                const text = await response.text();
                const parsedFeed = parseFeed(text);
                setFeed(parsedFeed);
            } catch (error) {
                console.error("Error fetching or parsing the RSS feed:", error);
            } finally {
                setLoading(false);
            }
        };

        React.useEffect(() => {
            if (currentUrl) {
                fetchFeed(currentUrl);
            }
        }, [currentUrl]);

        // Initialize the database and load initial data
        React.useEffect(() => {
            initDatabase();
        }, []);

        React.useEffect(() => {
            initData();
        }, [database]);

        async function initDatabase() {
            setDatabase(await Database.load("sqlite:app.db"));
        }

        async function initData() {
            if (database) {
                await fetchFeeds();
            }
        }

        // Fetch feeds from the database and update state
        const fetchFeeds = async () => {
            if(database) {
                const result: any[] = await database.select("SELECT * from feed");
                setSavedFeedList(result);
                setIsFeedSearchLoading(false);
                if (result.length !== 0) {
                    setSelectedFeedLabel(result[0].label);
                    setCurrentUrl(result[0].url);
                }
            }
        };

        return (
            <div className={styles.root}>
                <HomeDrawer
                    data={savedFeedList}
                    isLoading={isFeedSearchLoading}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    createFeedFormHook={createFeedFormHook}
                    onDelete={async (id) => {
                        if (database) {
                            await database.execute("DELETE FROM feed WHERE id = $1", [id]);
                            await fetchFeeds(); // Use fetchFeeds to update savedFeedList
                        }
                    }}
                    onItemSelected={async (id) => {
                        if (database) {
                            const result: any[] = await database.select("SELECT * FROM feed WHERE id = $1", [id]);

                            if (result.length > 0) {
                                const feedDetails = result[0];

                                setCurrentUrl(feedDetails.url);
                                setSelectedFeedLabel(feedDetails.label);
                            } else {
                                console.log("Feed item not found!");
                            }
                        }
                    }}
                />
                <div className="p-6 space-y-4 overflow-y-scroll select-none animate-in fade-in-70 slide-in-from-bottom-8 w-full">
                    {!isOpen && (
                        <Hamburger onClick={() => setIsOpen(!isOpen)} />
                    )}
                    <Body1>
                        <h1 className="text-3xl font-bold pb-2 pt-4">
                            {selectedFeedLabel != null ? selectedFeedLabel : "No Feed Selected"}
                        </h1>
                    </Body1>

                    {loading ? (
                        <div className="flex justify-center items-center h-60 w-full">
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            {feed && feed.items && feed.items.map((item: any, index: number) => (
                                <Card key={index} className="w-full" onClick={() => openModel(item.link)} appearance='subtle'>
                                    <CardHeader
                                        className="pt-4"
                                        header={
                                            <Body1>
                                                <h1 className="text-3xl font-semibold">{item.title}</h1>
                                            </Body1>
                                        }
                                        description={<Caption1 className='mt-1'>{new Date(item.pubDate).toLocaleString()} · {item.link}</Caption1>}
                                    />
                                    <CardFooter className="pb-3">
                                        <p className="text-base">{item.contentSnippet}</p>
                                    </CardFooter>
                                </Card>
                            ))}
                        </>
                    )}

                    {/* Handle empty feed case */}
                    {!loading && feed && feed.items && feed.items.length === 0 && (
                        <Body1>No feed items available.</Body1>
                    )}
                </div>

                <createFeedFormHook.Provider handleSubmit={async ({ label, url }) => {
                    if (database) {
                        try {
                            z.object({
                                url: z.string().url(),
                                label: z.string().min(4).max(100)
                            }).parse({ url, label });

                            await database.execute("INSERT into feed (label, url) VALUES ($1, $2)", [label, url]);
                            await fetchFeeds(); // Use fetchFeeds to update savedFeedList

                        } catch (error) {
                            // Handle validation errors
                            if (error instanceof z.ZodError) {
                                const errorMessages = error.errors.map(e => e.message).join(", ");
                                showDialog({
                                    title: "Validation Error",
                                    message: <Body1>{errorMessages.toString()}</Body1>
                                });
                            }
                        }
                    }
                }} />

                <Provider />
                <BasicDialogProvider />
            </div>
        );
    },
});
