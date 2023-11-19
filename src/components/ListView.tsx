import React from 'react'

import './ListView.scss'

interface ListViewProps {
  width: number;
  rowHeight: number;
  children: React.ReactNode[];
}

const ListView = (props: ListViewProps) => {
  return (
    <ul className="hydrogen-list-view">
      {props.children.map((child, index) => (
        <li
          key={index}
          style={{
            height: `${props.rowHeight}px`,
          }}
        >
          {child}
        </li>
      ))}
    </ul>
  );
}

export default ListView
