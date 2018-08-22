import React from 'react';
import styles from './Base.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Base = () => {
  return (
    <div className={cx('base')}></div>
  );
};

export default Base;