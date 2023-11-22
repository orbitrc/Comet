import React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import ListView from '@/components/ListView'

import './SettingsLayout.scss'

interface Props {
  children: React.ReactNode;
}

const SettingsLayout = (props: Props) => {
  const pathname = usePathname();

  //======================
  // Component NavItem
  //======================
  interface NavItemProps {
    href: string;
    title: string;
  }

  const NavItem = (props: NavItemProps) => {
    return (
      <Link href={props.href}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="list-item">
          {props.title}
        </div>
      </Link>
    );
  }

  return (
    <main className="comet-settings-layout">
      <nav className="navigation">
        <h2>Settings</h2>
        <ListView
          width={0}
          rowHeight={32}
        >
          <NavItem
            href="/settings/general"
            title="General"
          />
          <NavItem
            href="/settings/ssh"
            title="SSH"
          />
        </ListView>
      </nav>
      <div className="content">
        {props.children}
      </div>
    </main>
  );
}

export default SettingsLayout
