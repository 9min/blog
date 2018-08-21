import React from 'react';
import styles from './Button.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

// 전달받은 className, onClick 등 값들이 rest 안에 들어있습니다.
// JSX에서 ...을 사용하면 내부에 있는 값들을 props로 넣어줍니다.
const Div = ({children, ...rest}) => <div {...rest}>{children}</div>

const Button = ({
  children, to, onClick, disabled, theme = 'default'
}) => {
  // to 값이 존재하면 Link를 사용하고, 그렇지 않으면 div를 사용합니다.
  // 비활성화되어있는 버튼일 때도 div를 사용합니다.
  const Element = (to && !disabled) ? Link : Div;

  return (
    <Element
      to={to}
      className={cx('button', theme, {disabled})}
      onClick={disabled ? () => null : onClick}>
      {children}
    </Element>
  );
}

export default Button;