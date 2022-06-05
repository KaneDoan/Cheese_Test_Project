import * as React from 'react';
import { TextField } from '@material-ui/core';
import {Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Button, Box, IconButton} from '@material-ui/core';
import { Close, Message } from '@material-ui/icons';
import List from '@material-ui/core';
import CartItem from '../CartItem/CartItem';
import Cart from '../Cart';
import FileSaver from 'file-saver';
import { json } from 'express';
//purchase component 
const Purchase = (Cart:any) =>{
    // alert("hellp");
    //convert the data into json format
    var purchase = JSON.stringify(Cart);
    //create new blob with json type
    var blob = new Blob([purchase], {type: "json"});
    //used filesaver to save the file
    FileSaver.saveAs(blob, "purchase.json");
    console.log(purchase);
}
 export default Purchase;