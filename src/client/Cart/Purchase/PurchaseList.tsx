import {
    ListSubheader,
    ListItemText,
    ListItem,
    List,
    Divider,
    IconButton,
    ListItemIcon,
    LinearProgress,
    Typography,
  } from "@material-ui/core";
  import CloseIcon from "@material-ui/icons/Close";
  import { useQuery } from "react-query";
  import { CartItemType } from "../../App";
  
  const getPurchaseHistory = async (): Promise<CartItemType[][]> => {
    const response = await fetch(`api/cart`);
    const json: { cart: CartItemType[][] } = await response.json();
    return json.cart;
  };
  
  type Props = {
    handleClose: () => void;
    setSelectedItem: (item: CartItemType) => void;
  };
  
  const PurchaseList = ({ handleClose, setSelectedItem }: Props) => {
    const { data, isLoading, error } = useQuery<CartItemType[][]>(
      "purchaseHistory",
      getPurchaseHistory
    );

    const ListItemHeader = ({ children }: { children: React.ReactNode }) => (
      <ListItem>
        <ListItemIcon>
          <IconButton onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemText>
          <Typography variant="h4"> {children} </Typography>
        </ListItemText>
      </ListItem>
    );
  
    if (isLoading)
      return (
        <ListItemHeader>
          <LinearProgress />
        </ListItemHeader>
      );
    if (error) return <ListItemHeader>Something went wrong ...</ListItemHeader>;
    if (!data)
      return (
        <ListItemHeader>
          You have not made any purchase at this session
        </ListItemHeader>
      );
  
    return (
      <List>
        <ListItemHeader> Purchase History </ListItemHeader>
        {data?.map((items, c) => (
          <>
            <Divider />
  
            <ListSubheader>Purchase Number: {c + 1}</ListSubheader>
            {items.map((item) => (
              <ListItem
                button
                onClick={() => setSelectedItem(item)}
                key={item.id}
              >
                <ListItemText
                  data-cy={`purchase-list-item-${item.id}`}
                  primary={item.title}
                  secondary={`Price: $${item.price}  Amount:${item.amount}`}
                />
              </ListItem>
            ))}
          </>
        ))}
      </List>
    );
  };
  
  export default PurchaseList;
  