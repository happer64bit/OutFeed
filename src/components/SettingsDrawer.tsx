import { memo } from "react";
import { Button } from "@fluentui/react-components";
import { ApprovalsApp16Regular, ArrowLeft12Regular, DarkTheme20Regular, Document16Filled } from "@fluentui/react-icons";
import { NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem, NavSectionHeader } from "@fluentui/react-nav-preview";

const SettingsDrawer = memo(({ isOpen }: { isOpen: boolean }) => {
    return (
        <NavDrawer open={isOpen} type="inline" defaultSelectedValue="1" className="h-screen">
            <NavDrawerHeader>
                <div className="flex items-center gap-2">
                    <Button icon={<ArrowLeft12Regular />} appearance="subtle" onClick={() => window.history.back()} />
                    <h1 className="text-lg font-semibold">Settings</h1>
                </div>
            </NavDrawerHeader>
            <NavDrawerBody>
                <NavSectionHeader>Appearance</NavSectionHeader>
                <NavItem icon={<DarkTheme20Regular />} value="10">
                    Theme
                </NavItem>
                <NavSectionHeader>About</NavSectionHeader>
                <NavItem icon={<ApprovalsApp16Regular />} value="10">
                    Update
                </NavItem>
                <NavItem icon={<Document16Filled />} value="10">
                    Term & Policy
                </NavItem>
            </NavDrawerBody>
        </NavDrawer>
    );
});

export default SettingsDrawer;
