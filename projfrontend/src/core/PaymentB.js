import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cartEmpty, loadCart } from "./helper/carthelper";
import { getmeToken, processPayment } from "./helper/paymentBHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import DropIn from "braintree-web-drop-in-react";

const PaymentB = ({ products, setReload = (f) => f, reload = undefined }) => {
  const [info, setinfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getmeToken(userId, token).then((info) => {
      console.log("INFORMATION", info);
      if (info.error) {
        setinfo({ ...info, error: info.error });
      } else {
        const clientToken = info.clientToken;
        setinfo({ clientToken });
      }
    });
  };

  const showbtdropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button className="btn btn-block btn-success " onClick={onPurchase}>
              Buy
            </button>
          </div>
        ) : (
          <h3>Please Login or add something to cart</h3>
        )}
      </div>
    );
  };

  useEffect(() => {
    console.log(isAuthenticated());
    getToken(userId, token);
  }, []);

  const onPurchase = () => {
    setinfo({ loading: true });
    let nonce;
    let getNonce = info.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getAmount(),
        };

        processPayment(userId, token, paymentData)
          .then((response) => {
            setinfo({ ...info, success: response.success, loading: false });
            console.log("PAYMENT SUCCESS");
            const orderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
            };
            createOrder(userId, token, orderData);
            cartEmpty(() => {
              console.log("Did we got a crash?");
            });
            setReload(!reload);
          })
          .catch((error) => {
            setinfo({ loading: false, success: false });
            console.log("PAYMENT FAILED");
          });
      })
      .catch();
  };

  const getAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };
  return (
    <div>
      <h3>Your bill is {getAmount()} $</h3>
      {showbtdropIn()}
    </div>
  );
};
export default PaymentB;
