import { CenteredDiv } from "./PurchaseItem.styles";
import { CartItemType } from "../../App";
import { useQuery } from "react-query";
import { useState } from "react";
import { Dialog, DialogTitle, Button } from "@material-ui/core";

type CheckoutResponse = {
  message: string;
};

type Props = {
  cartItems: CartItemType[];
  children: React.ReactNode;
  handleEmptyCart: () => void;
  closeCartDrawer: () => void;
};
const PurchaseButton = ({
  cartItems,
  children,
  handleEmptyCart,
  closeCartDrawer,
}: Props) => {
  const [dialogText, setDialogText] = useState<string>("");
  const handleClose = () => {
    closeCartDrawer();
    setDialogText("");
  };

  const checkoutCheeses = async (): Promise<CheckoutResponse> =>
    await (
      await fetch(`api/cheeses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }),
      })
    ).json();

  const emptyCart = (data: CheckoutResponse) => {
    const { message } = data;
    handleEmptyCart();
    message === "success" &&
      setDialogText("You have successfully purchased!");
  };

  const { isLoading, refetch } = useQuery<CheckoutResponse>(
    "cart",
    checkoutCheeses,
    {
      enabled: false,
      onSuccess: emptyCart,
      onError: () => setDialogText("Something went wrong..."),
    }
  );

  const postCart = () => {
    refetch();
  };
  return (
    <>
      <CenteredDiv>
        <Button
          data-cy={`purchase-cart`}
          disabled={!cartItems.length}
          onClick={postCart}
          variant="contained"
          color="primary"
        >
          {isLoading ? "Loading..." : children}
        </Button>
      </CenteredDiv>
      <Dialog open={!!dialogText} onClose={handleClose}>
        <DialogTitle data-cy={`purchase-dialog`}>{dialogText}</DialogTitle>
        <Button
          data-cy={`continue-shopping`}
          onClick={handleClose}
          color="primary"
        >
          Continue Shopping
        </Button>
      </Dialog>
    </>
  );
};
export default PurchaseButton;
