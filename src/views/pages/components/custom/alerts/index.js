import React from "react";
// reactstrap components
import { Snackbar, makeStyles } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert"

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
  
const useStyles = makeStyles((theme) => ({
root: {
    width: '100%',
    '& > * + *': {
    marginTop: theme.spacing(2),
    },
},
}));

const bodyAlertStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: "0",
    left: "0",
    position: "fixed",
    width: '100%',
    zIndex: "999",
}

const alertStyle = {
    width: "50vh",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

export const DangerAlert = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
      <Snackbar open={props.open} autoHideDuration={6000} onClose={props.onClose}>
        <Alert onClose={props.onClose} severity="warning">
          {props.message}
        </Alert>
      </Snackbar>
    </div>
    );
}

export const InfoAlert = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
      <Snackbar open={props.open} autoHideDuration={6000} onClose={props.onClose}>
        <Alert onClose={props.onClose} severity="primary">
          {props.message}
        </Alert>
      </Snackbar>
    </div>
    );
};

export const SuccessAlert = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
      <Snackbar open={props.open} autoHideDuration={6000} onClose={props.onClose}>
        <Alert onClose={props.onClose} severity="success">
          {props.message}
        </Alert>
      </Snackbar>
    </div>
    );
};
