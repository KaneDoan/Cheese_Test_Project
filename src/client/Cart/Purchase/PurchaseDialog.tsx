import React from "react";

import { Dialog, Slide, Container } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import PurchaseList from "./PurchaseList";
import { CartItemType } from "../../App";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

type Props = {
  handleClose: () => void;
  open: boolean;
  setSelectedItem: (item: CartItemType) => void;
};

const PurchaseDialog = ({ open, handleClose, setSelectedItem }: Props) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <Container>
        {open && (
          <PurchaseList
            handleClose={handleClose}
            setSelectedItem={setSelectedItem}
          />
        )}
      </Container>
    </Dialog>
  );
};

export default PurchaseDialog;
