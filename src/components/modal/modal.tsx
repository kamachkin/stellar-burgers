import { FC, memo, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

/**
 * Компонент Modal — портал в мир всплывающих окон, где каждый элемент оживает.
 * Независимо от того, вызывается ли он как вложенное окно или как самостоятельная страница,
 * он обеспечивает плавное закрытие по нажатию клавиши ESC и аккуратное управление своим DOM-контейнером.
 */
export const Modal: FC<TModalProps> = memo(
  ({ title, onClose, children, nested }) => {
    // Создаем уникальный контейнер для нашего модального окна,
    // чтобы каждый модал имел собственное место в документе.
    const elRef = useRef<HTMLDivElement | null>(null);
    if (!elRef.current) {
      elRef.current = document.createElement('div');
    }

    useEffect(() => {
      if (!modalRoot) return;

      // Встраиваем контейнер в специальный div (#modals),
      // чтобы модалки появлялись именно там, где им отведено место.
      modalRoot.appendChild(elRef.current!);

      // Обработчик для мгновенного закрытия модального окна при нажатии ESC
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEsc);

      return () => {
        document.removeEventListener('keydown', handleEsc);

        // При размонтировании аккуратно удаляем контейнер,
        // если он все еще принадлежит modalRoot — чистота превыше всего.
        if (elRef.current && elRef.current.parentNode === modalRoot) {
          try {
            modalRoot.removeChild(elRef.current);
          } catch (err) {
            console.error('Ошибка удаления контейнера модалки:', err);
          }
        }
      };
    }, [onClose]);

    // Возвращаем портал, в который внедряем наш кастомный UI,
    // позволяющий кнопкой "onClose" и заголовком "title" перенести пользователя в новый мир.
    return ReactDOM.createPortal(
      <ModalUI title={title} onClose={onClose} nested={nested}>
        {children}
      </ModalUI>,
      elRef.current!
    );
  }
);
