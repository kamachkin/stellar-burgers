import { FC, memo } from 'react';
import styles from './modal.module.css';
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

// Расширенный тип, добавляем опциональное поле nested
interface ModalUIPropsExtended extends TModalUIProps {
  nested?: boolean;
}

export const ModalUI: FC<ModalUIPropsExtended> = memo(
  ({ title, onClose, children, nested = false }) => (
    <>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={`${styles.title} text text_type_main-large`}>
            {title}
          </h3>
          <button className={styles.button} type='button' onClick={onClose}>
            <CloseIcon type='primary' />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      {/* Рендерим оверлей только если окно не является вложенным */}
      {!nested && <ModalOverlayUI onClick={onClose} />}
    </>
  )
);
