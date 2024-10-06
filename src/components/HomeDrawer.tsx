import React, { Suspense } from 'react';
import { Add12Regular, Settings16Regular } from '@fluentui/react-icons';
import { Link } from '@tanstack/react-router';
import { Hamburger, NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem } from "@fluentui/react-nav-preview";
import { Button, Tooltip } from '@fluentui/react-components';

// Memoize the Tooltip component to prevent unnecessary re-renders
const MemoizedTooltip = React.memo(Tooltip);

const MemoizedNavItem = React.memo(({ value }: { value: string }) => (
    <NavItem value={value}>
        RSS Feed
    </NavItem>
));

export default function HomeDrawer({ isOpen, setIsOpen, createFeedFormHook }: { isOpen: boolean, setIsOpen: (value: boolean) => void, createFeedFormHook: any }) {
    return (
        <NavDrawer open={isOpen} type="inline" defaultSelectedValue="1" className="h-screen">
            <NavDrawerHeader>
                <div className="flex justify-between items-center">
                    <Tooltip content="Navigation" relationship="label">
                        <Hamburger onClick={() => setIsOpen(!isOpen)} />
                    </Tooltip>
                    <MemoizedTooltip content="Add Feed" relationship="label">
                        <Button
                            icon={<Add12Regular />}
                            appearance="primary"
                            onClick={() => {
                                createFeedFormHook.displayDialog()
                            }}
                        />
                    </MemoizedTooltip>
                </div>
            </NavDrawerHeader>
            <NavDrawerBody className="flex flex-col justify-between">
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        {Array(10).fill({}).map((_, index) => (
                            <MemoizedNavItem value={index.toString()} key={index.toString()} />
                        ))}
                    </Suspense>
                </div>
                <div className="mb-4">
                    <Link to='/settings'>
                        <Button className="w-full" appearance="secondary" icon={<Settings16Regular />} href="/settingss">
                            Settings
                        </Button>
                    </Link>
                </div>
            </NavDrawerBody>
        </NavDrawer>
    )
}