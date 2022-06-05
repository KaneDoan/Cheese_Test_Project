import {Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Button, Box, IconButton} from '@material-ui/core';
import { Close, Message } from '@material-ui/icons';
import React from 'react'
import  create from 'zustand';

//type 
type AlertDialogStore = {
  title: string;
  price: string;
  message: string;
  onSubmit?: () => void;
  close: () => void;
}
//create AlertDialogStore and store the variables 
const useAlertDialogStore = create<AlertDialogStore>((set)=> ({
  title: "",
  price: "",
 message: "",
 onSubmit: undefined,
 close: () => 
  set({
    onSubmit: undefined,
  }),
}));

//exporting dialog values 
export const alertDialogValues =(title: string, price: string, message: string, onSubmit: () => void) => {
  useAlertDialogStore.setState({
    title,
    price,
    message,
    onSubmit,
  });
};
//declare alert dialog and return dialog 
const AlertDialog: React.FC = () => {
  const { title, price, message, onSubmit, close } = useAlertDialogStore();
  return (
  <Dialog open ={Boolean(onSubmit)} onClose={close}>
    <DialogTitle>Details</DialogTitle>
    <Box position="absolute" top={0} right={0}>
      <IconButton onClick={close}>
        <Close/>
        </IconButton>
    </Box>
    <DialogContent>
      {/* mapping the values to its key */}
      <DialogContentText>
        <h1>Title: {title}</h1>
        <h2>Price: {price}</h2>
        {message}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button 
        color="primary" 
        variant="contained" 
        onClick={() => {
          if(onSubmit) {
          onSubmit();
          }
          close();
        }}>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
  )
}
export default AlertDialog