import React, { useEffect, useState, Suspense, useMemo, useCallback } from 'react';
import { Add12Regular, Settings16Regular } from '@fluentui/react-icons';
import { Link } from '@tanstack/react-router';
import { Hamburger, NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem, NavSectionHeader } from "@fluentui/react-nav-preview";
import { Button, Tooltip } from '@fluentui/react-components';

const MemoizedTooltip = React.memo(Tooltip);

const MemoizedHamburger = React.memo(({ onClick }: { onClick: () => void }) => (
    <Hamburger onClick={onClick} />
));

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

    const memoizedAddIcon = useMemo(() => <Add12Regular />, []);
    const memoizedSettingsIcon = useMemo(() => <Settings16Regular />, []);
    const memoizedHamburgerClick = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);

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
                    <MemoizedTooltip content="Navigation" relationship="label">
                        <MemoizedHamburger onClick={memoizedHamburgerClick} />
                    </MemoizedTooltip>
                    <h1 className="text-lg font-semibold">Home</h1>
                    <MemoizedTooltip content="Add Feed" relationship="label">
                        <Button
                            icon={memoizedAddIcon}
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
                            <NavSectionHeader>Feed</NavSectionHeader>
                            {data.map((value) => (
                                <MemoizedNavItem value={value} key={value.id} />
                            ))}
                        </Suspense>
                    )}
                </div>
                <div className="mb-4">
                    <Link to="/settings">
                        <Button className="w-full" appearance="subtle" icon={memoizedSettingsIcon}>
                            Settings
                        </Button>
                    </Link>
                </div>
            </NavDrawerBody>
        </NavDrawer>
    );
}
