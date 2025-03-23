import { Middleware } from 'redux';
import {
  wsUserOrdersConnecting,
  wsUserOrdersOpen,
  wsUserOrdersClose,
  wsUserOrdersError,
  wsUserOrdersMessage
} from '../slices/userOrdersSlice';

export const WS_USER_ORDERS_CONNECT = 'WS_USER_ORDERS_CONNECT';
export const WS_USER_ORDERS_DISCONNECT = 'WS_USER_ORDERS_DISCONNECT';

export const wsUserOrdersMiddleware: Middleware = (store) => {
  let socket: WebSocket | null = null;

  return (next) => (action: any) => {
    switch (action.type) {
      case WS_USER_ORDERS_CONNECT: {
        const url = action.payload as string;
        store.dispatch(wsUserOrdersConnecting());

        socket = new WebSocket(url);

        socket.onopen = () => {
          store.dispatch(wsUserOrdersOpen());
        };

        socket.onerror = () => {
          store.dispatch(wsUserOrdersError('WebSocket error'));
        };

        socket.onmessage = (event) => {
          const parsedData = JSON.parse(event.data);
          console.log('WS userOrders onmessage =>', parsedData);

          if (parsedData?.success) {
            store.dispatch(
              wsUserOrdersMessage({
                orders: parsedData.orders,
                total: parsedData.total,
                totalToday: parsedData.totalToday
              })
            );
          } else {
            store.dispatch(wsUserOrdersError('Error in message data'));
          }
        };

        socket.onclose = () => {
          store.dispatch(wsUserOrdersClose());
        };

        break;
      }

      case WS_USER_ORDERS_DISCONNECT: {
        if (socket) {
          socket.close();
        }
        socket = null;
        break;
      }

      default:
        break;
    }

    return next(action);
  };
};
