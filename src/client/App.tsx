import React, {useEffect, useState } from 'react';
import { useQuery } from 'react-query';
// Components
import Item from './Cart/Item/Item';
import Cart from './Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RestoreIcon from '@material-ui/icons/Restore';
import Badge from '@material-ui/core/Badge';
//importing dialog components
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
// Styles
import { Wrapper, StyledButton, StyledAppBar, HeaderTypography } from './App.styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
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
//export type purchase item type 
export type purchaseItemType = {
  id: number; 
  title: string;
  price: number;
  quantity: number;
  total_price: number;
};


const getCheeses = async (): Promise<CartItemType[]> =>
  await (await fetch(`api/cheeses`)).json();
//getpuchase 
const getPurchase = async (): Promise<purchaseItemType[]> =>
await(await fetch(`api/purchase`)).json();

//state for dialog open and close 
const App = () => {
  const [open, setOpen] = React.useState(false);
  
  const handleClickToOpen = () => {
    setOpen(true);
  };
  
  const handleToClose = () => {
    setOpen(false);
  };
  const handleDailogOpen = () => {
   setDialogOpen(true);
 };

 const handleDialogClose = () => {
   setDialogOpen(false);
 };
 
  //dialogopne and purhaseitem variable using state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [clickOpen, setClickOpen] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState([] as purchaseItemType[]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'cheeses',
    getCheeses
  );
  console.log(data);

  const [purchaseData, setData] = useState<any[]>([])

  //fetching data from the api 
  const getData=()=>{
    fetch('api/purchase'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        return response.json();
      })
      .then(function(myJson) {
        setData(myJson)
      });
  }
  useEffect(()=>{
    getData()
  },[])

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.amount, 0);

    //handling click open 
  const handleClickOpen = (clickedItem: CartItemType) =>{      
  };

  //handling add items to cart
  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      // 1. Is the item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      // First time the item is added
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  //use open state when clicked
  const [openPurchaseItems, setOpenPurchaseItems] = React.useState(false);
  const handleClickOnPurchaseItems = () => {
    setOpenPurchaseItems(true);
  }
  const handleClosePurchaseItems = () => {
    setOpenPurchaseItems(false);
 };

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
            <StyledButton onClick={handleClickOnPurchaseItems}>
              <RestoreIcon />
              <Typography variant="subtitle2">
                Recent Purchases
              </Typography>
            </StyledButton>

            <HeaderTypography variant="h3" noWrap>
              Welcome to Patient Zero's Cheeseria
            </HeaderTypography>

            <StyledButton onClick={() => setCartOpen(true)}>
              <Badge
                badgeContent={getTotalItems(cartItems)}
                color='error'
                data-cy="badge-count">
                <AddShoppingCartIcon />
              </Badge>

              <Typography variant="subtitle2">
                Cart
              </Typography>
            </StyledButton>

          </Grid>
        </Toolbar>
      </StyledAppBar>

      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>

      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart = {handleAddToCart} handleClickOpen = {handleClickOpen} />
          </Grid>
        ))}
      </Grid>
          
      <Dialog
      open={openPurchaseItems}
      onClose={handleClosePurchaseItems}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
      
      <DialogTitle id="alert-dialog-title">
        {"Recent Purchases"}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
        <ul>
          {/* Map the purchasedata into a list of items */}
            {purchaseData.map(item => {
               return (
                <li key={item.id}>
                <span><b>Title:</b> {item.title} </span>
                <span><b>Price:</b>   {item.price} </span>
                <span><b>Quantity:</b>  {item.quantity} </span>
               <span><b>Total Price:</b>  {item.total_price} </span>
              </li>  
              );
            })}
        </ul>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClosePurchaseItems} autoFocus>
          Close
        </Button>
      </DialogActions>
      </Dialog>

    </Wrapper>
  );
};

export default App;
