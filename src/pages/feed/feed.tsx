// src/pages/feed.tsx
import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { FeedUI } from '@ui-pages'; // ваш FeedUI компонент
import { TOrder } from '@utils-types';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, hasError } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeed()); // загружаем ленту
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (hasError) {
    return <p className='text text_type_main-large'>Ошибка загрузки ленты</p>;
  }

  // Пример handleGetFeeds — если нужно обновить вручную
  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
