import React, { useState } from 'react';
import { useQuery } from "react-query";
// Components
import Item from './Cart/Item/Item';
import Cart from './Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RestoreIcon from '@material-ui/icons/Restore';
import Badge from '@material-ui/core/Badge';
import { Dialog, Toolbar, Typography } from '@material-ui/core';
import DialogItem from './Cart/Dialog/DialogItem';
import PurchaseDialog from './Cart/Purchase/PurchaseDialog';
// Styles
import { Wrapper, StyledButton, StyledAppBar, HeaderTypography } from './App.styles';
// Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

export type PurchaseType = {
  id: string,
  userId: string,
  totalPrice: number,
  totalItems: number,
  dateTime: string,
  cheeses: CartItemType[]
}

const getCheeses = async (): Promise<CartItemType[]> =>
  await (await fetch(`api/cheeses`)).json();

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<CartItemType| undefined |null>(null);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "cheeses",
    getCheeses
  );

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const [purchasesDialog, setPurchasesDialog] = React.useState(false);
  const handlePurchaseDialogClose = () => setPurchasesDialog(false);

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  const handleItemSelect = (item: CartItemType | undefined) => (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleEmptyCart = () => {
    setCartItems([] as CartItemType[]);
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>;

  return (
    <Wrapper>
      <StyledAppBar position="static">
        <Toolbar>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <StyledButton onClick={() => setPurchasesDialog(true)} data-cy='recent-purchases-button'>
              <RestoreIcon />
              <Typography variant="subtitle2">
                Recent Purchases
              </Typography>
            </StyledButton>

            <HeaderTypography variant="h3" noWrap>
              Welcome to Patient Zero's Cheeseria
            </HeaderTypography>

            <StyledButton onClick={() => setCartOpen(true)} data-cy='shopping-cart-button'>
              <Badge
                badgeContent={getTotalItems(cartItems)}
                color='error'
                data-cy="shopping-cart-badge-count">
                <AddShoppingCartIcon />
              </Badge>

              <Typography variant="subtitle2">
                Cart
              </Typography>
            </StyledButton>

          </Grid>
        </Toolbar>
      </StyledAppBar>

      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)} data-cy='cart-drawer'>
      <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
          handleEmptyCart={handleEmptyCart}
          closeCartDrawer={() => setCartOpen(false)}
        />
      </Drawer>

      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        {selectedItem && <DialogItem item={selectedItem} handleAddToCart={handleAddToCart} />}
      </Dialog>

      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} 
            handleAddToCart={handleAddToCart} 
            handleItemSelect={handleItemSelect} />
          </Grid>
        ))}
      </Grid>
      <PurchaseDialog
        open={purchasesDialog}
        handleClose={handlePurchaseDialogClose}
        setSelectedItem={(item: CartItemType) => setSelectedItem(item)}
      />
    </Wrapper>

  );
};

export default App;
