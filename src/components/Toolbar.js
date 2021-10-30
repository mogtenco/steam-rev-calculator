import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { useState } from 'react';
function Toolbar() {
    const [toggled, setToggled] = useState(false);
    return (
        <ProSidebar onMouseEnter={() => setToggled(true)} onMouseLeave={() => setToggled(false)} breakPoint="xs" className={toggled ? "" : "collapsed"}>
            <Menu iconShape="square">
                <MenuItem className="sidebarHeader">Steam Revenue Calculator</MenuItem>
                <SubMenu className="sidebarItem" open="true" title="Sort by">
                    <MenuItem>Genre</MenuItem>
                    <MenuItem>Quality (AAA/Indie)</MenuItem>
                    <MenuItem>Tags</MenuItem>
                </SubMenu>
                <MenuItem className="sidebarItem">About</MenuItem>
            </Menu>
        </ProSidebar>
    );
}

export default Toolbar;