import React from 'react'

import Link from 'next/link'

import './OrganizationItem.scss'

interface OrganizationItemProps {
  name: string;
}

const OrganizationItem = (props: OrganizationItemProps) => {
  return (
    <div
      className="comet-organization-item"
    >
      <Link
        className="link"
        href={props.name}
      >
        <img
          className="link__icon"
          src="/icons/organization.png"
          width="64"
          height="64"
        />
        <span
          className="link__name"
        >
          {props.name}
        </span>
      </Link>
    </div>
  );
}

export default OrganizationItem
