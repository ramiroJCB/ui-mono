import * as React from 'react';
import { BackgroundColorProperty } from 'csstype';
import { History } from 'history';
import { Link } from 'react-router-dom';
/* eslint-disable jsx-a11y/accessible-emoji */

// TODO: Delete this!?

export const Button: React.FC<React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>> = ({ style, ...props }) => (
  <button
    style={{
      width: '100%',
      ...style
    }}
    {...props}
  />
);

export const Input: React.FC<React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>> = ({ style, ...props }) => (
  <input
    style={{
      width: '100%',
      ...style
    }}
    {...props}
  />
);

type SpanProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

export const Icon: React.FC<SpanProps & {
  color?: BackgroundColorProperty;
}> = ({ color = 'silver', style, ...props }) => (
  <Tag
    style={{
      backgroundColor: color,
      fontFamily: 'monospace, monospace',
      ...style
    }}
    {...props}
  />
);

type RowProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;

export class Row extends React.Component<
  RowProps,
  {
    isHovered: boolean;
  }
> {
  constructor(props: RowProps) {
    super(props);
    this.state = {
      isHovered: false
    };
  }

  toggleHover = () => {
    this.setState({
      isHovered: !this.state.isHovered
    });
  };

  render() {
    const { style, ...props } = this.props;

    return (
      <tr
        onMouseOut={this.toggleHover}
        onMouseOver={this.toggleHover}
        style={{
          background: this.state.isHovered ? 'whitesmoke' : undefined,
          cursor: 'pointer',
          ...style
        }}
        {...props}
      />
    );
  }
}

export const Sort: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  history: History;
  name: string;
}> = ({ style, name, history, children, ...props }) => {
  const regex = new RegExp(`\\?\\$orderby=${name}\\+(asc|desc)`);
  const matches = history.location.search.match(regex);
  const currentValue = matches && matches[1];
  const nextValue = currentValue === 'asc' ? 'desc' : 'asc';

  return (
    <Link
      to={{
        search: `?$orderby=${name}+${nextValue}`
      }}
      style={{
        cursor: 'pointer',
        ...style
      }}
      {...props}
    >
      {children} {currentValue && (currentValue === 'asc' ? '▲' : '▼')}
    </Link>
  );
};

export const Table: React.FC<React.DetailedHTMLProps<
  React.TableHTMLAttributes<HTMLTableElement>,
  HTMLTableElement
>> = ({ style, children, ...props }) => (
  <table
    cellPadding={8}
    cellSpacing={0}
    style={{
      width: '100%',
      ...style
    }}
    {...props}
  >
    <tbody>{children}</tbody>
  </table>
);

export const Tag: React.FC<SpanProps> = ({ style, ...props }) => (
  <span
    style={{
      backgroundColor: 'silver',
      color: 'white',
      display: 'inline-block',
      fontWeight: 'bold',
      padding: '4px 8px',
      ...style
    }}
    {...props}
  />
);

export const TextArea: React.FC<React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>> = ({ style, ...props }) => (
  <div>
    <div>
      <button style={{ fontWeight: 'bold' }}>B</button> <button style={{ fontStyle: 'italic' }}>I</button>{' '}
      <button style={{ textDecoration: 'underline' }}>U</button> <button>≡</button> <button>≡</button>{' '}
      <button>🔗</button>
    </div>
    <textarea style={{ width: '100%', ...style }} {...props} />
  </div>
);
