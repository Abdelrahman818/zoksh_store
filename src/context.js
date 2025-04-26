import { createContext, useState } from "react";

export const OrderContext = createContext({});

const OrderProvider = ({ children }) => {
  const [orderData, setOrderData] = useState(null);
  return <OrderContext.Provider value={{ orderData, setOrderData }}>{ children }</OrderContext.Provider>
}

export default OrderProvider;
