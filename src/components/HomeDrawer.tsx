import React, { useEffect, useState, Suspense } from 'react';
import { Add12Regular, Settings16Regular } from '@fluentui/react-icons';
import { Link } from '@tanstack/react-router';
import { Hamburger, NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem } from "@fluentui/react-nav-preview";
import { Button, Tooltip } from '@fluentui/react-components';

const MemoizedTooltip = React.memo(Tooltip);

const MemoizedNavItem = React.memo(({ value }: { value: any }) => (
    <NavItem value={value.id}>
        {value.label}
    </NavItem>
));

export default function HomeDrawer({ isOpen, setIsOpen, createFeedFormHook, data, isLoading, onItemSelected }: { isOpen: boolean, setIsOpen: (value: boolean) => void, createFeedFormHook: any, data: any[], isLoading: boolean, onItemSelected: (id: any) => void }) {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && data && data.length > 0) {
            setSelectedValue(data[0].id);
        }
    }, [isLoading, data]);

    const handleNavSelection = (value: any) => {
        setSelectedValue(value);
        onItemSelected(value)
    };

    return (
        <NavDrawer 
            open={isOpen} 
            type="inline" 
            // @ts-ignore
            selectedValue={selectedValue}
            onNavItemSelect={(_, data) => handleNavSelection(data.value)}
            className="h-screen"
        >
            <NavDrawerHeader>
                <div className="flex justify-between items-center">
                    <Tooltip content="Navigation" relationship="label">
                        <Hamburger onClick={() => setIsOpen(!isOpen)} />
                    </Tooltip>
                    <MemoizedTooltip content="Add Feed" relationship="label">
                        <Button
                            icon={<Add12Regular />}
                            appearance="transparent"
                            size='small'
                            onClick={() => {
                                createFeedFormHook.displayDialog();
                            }}
                        />
                    </MemoizedTooltip>
                </div>
            </NavDrawerHeader>
            <NavDrawerBody className="flex flex-col justify-between">
                <div>
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <Suspense fallback={<div>Loading...</div>}>
                            {data.map((value) => (
                                <MemoizedNavItem value={value} key={value.id} />
                            ))}
                        </Suspense>
                    )}
                </div>
                <div className="mb-4">
                    <Link to="/settings">
                        <Button className="w-full" appearance="subtle" icon={<Settings16Regular />}>
                            Settings
                        </Button>
                    </Link>
                </div>
            </NavDrawerBody>
        </NavDrawer>
    );
}
