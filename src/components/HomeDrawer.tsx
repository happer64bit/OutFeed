import React, { useEffect, useState, Suspense, useMemo, useCallback } from 'react';
import { Add12Regular, MoreVertical24Filled, Settings16Regular } from '@fluentui/react-icons';
import { Link } from '@tanstack/react-router';
import { Hamburger, NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem, NavSectionHeader } from "@fluentui/react-nav-preview";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';

// Memoized Components
const MemoizedHamburger = React.memo(({ onClick }: { onClick: () => void }) => (
    <Hamburger onClick={onClick} />
));

const MemoizedNavItem = React.memo(({ value, shouldShowMenu, onDelete, onEditButtonClick }: { value: any, shouldShowMenu: boolean | undefined, onDelete: () => void, onEditButtonClick: () => void }) => (
    <NavItem value={value.id} className='flex w-full items-center !justify-between'>
        <p className='line-clamp-1'>{value.label}</p>
        {shouldShowMenu && (
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <MoreVertical24Filled className='!h-5' />
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>
                        <MenuItem as='div' onClick={onEditButtonClick}>Edit</MenuItem>
                        <MenuItem as='div' onClick={onDelete}>Delete</MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
        )}
    </NavItem>
));

const MemoizedButton = React.memo(Button);

export default function HomeDrawer({ isOpen, setIsOpen, createFeedFormHook, data, isLoading, onItemSelected, onDelete }: { isOpen: boolean, setIsOpen: (value: boolean) => void, createFeedFormHook: any, data: any[], isLoading: boolean, onItemSelected: (id: any) => void, onDelete: (id: any) => void }) {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && data && data.length > 0) {
            setSelectedValue(data[0].id);
        }
    }, [isLoading, data]);

    const handleNavSelection = (value: any) => {
        setSelectedValue(value);
        onItemSelected(value);
    };

    const memoizedAddIcon = useMemo(() => <Add12Regular />, []);
    const memoizedSettingsIcon = useMemo(() => <Settings16Regular />, []);
    const memoizedHamburgerClick = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);

    const memoizedDisplayDialog = useCallback(() => {
        createFeedFormHook.displayDialog();
    }, [createFeedFormHook]);

    // Function to handle deletion
    const handleDelete = useCallback((id: any) => {
        onDelete(id);
    }, [onDelete]);

    // Function to handle the "Edit" button click
    const handleEditButtonClick = useCallback((id: any) => {
        console.log("Edit button clicked for ID:", id);
        createFeedFormHook.displayDialog();
    }, [createFeedFormHook]);

    return (
        <NavDrawer
            open={isOpen}
            type="inline"
            // @ts-ignore
            selectedValue={selectedValue}
            onNavItemSelect={(_, data) => handleNavSelection(data.value)}
            className="h-screen min-w-[260px]"
        >
            <NavDrawerHeader>
                <div className="flex justify-between items-center">
                    <MemoizedHamburger onClick={memoizedHamburgerClick} />
                    <h1 className="text-lg font-semibold">Home</h1>
                    <MemoizedButton
                        icon={memoizedAddIcon}
                        appearance="transparent"
                        size='small'
                        onClick={memoizedDisplayDialog}
                    />
                </div>
            </NavDrawerHeader>
            <NavDrawerBody className="flex flex-col justify-between space-y-2">
                <div className='max-h-52 overflow-auto'>
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <Suspense fallback={<div>Loading...</div>}>
                            <NavSectionHeader>Feed</NavSectionHeader>
                            {data.map((value) => (
                                <MemoizedNavItem
                                    value={value}
                                    key={value.id}
                                    shouldShowMenu={selectedValue == String(value.id)}
                                    onDelete={() => handleDelete(value.id)}
                                    onEditButtonClick={() => handleEditButtonClick(value.id)}
                                />
                            ))}
                        </Suspense>
                    )}
                </div>
                <div className="pb-4">
                    <Link to="/settings">
                        <MemoizedButton className="w-full" appearance="subtle" icon={memoizedSettingsIcon}>
                            Settings
                        </MemoizedButton>
                    </Link>
                </div>
            </NavDrawerBody>
        </NavDrawer>
    );
}
