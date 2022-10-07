import React from 'react';
import cn from "classnames";
import styles from './styles.module.css';

export default function SelectNav({ label, items }) {
  return (
    <form className={styles.selectNav}>
      {label && (
        <label htmlFor="selectNav" className={styles.selectNav__label}>
          {label}
        </label>
      )}
      <select id="selectNav" name="selectNav" className={styles.selectNav__select}>
        {items.map((item, i) => (
          <option key={i} className={styles.selectNav__option}>{item.label}</option>
        ))}
      </select>
    </form>
  )
}