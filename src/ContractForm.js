import { drizzleConnect } from "drizzle-react";
import React from "react";
import PropTypes from "prop-types";
import CanGetABIComponent from "./CanGetABIComponent";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

/*
 * Create component.
 */

class ContractMyForm extends CanGetABIComponent {
  constructor(props, context) {
    super(props, context.drizzle.contracts);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.inputs = this.getABI(this.props.method).inputs.clone();
    this.inputs.push({ name: "gas", type: "uint256", txParam: true });
    this.inputs.push({ name: "gasLimit", type: "uint256", txParam: true });
    this.inputs.push({ name: "gasPrice", type: "uint256", txParam: true });
    this.inputs.push({ name: "value", type: "uint256", txParam: true });

    let initialState = {};
    this.inputs.forEach(input => {
      initialState[input.name] = "";
    });
    this.state = initialState;
  }

  generateSendArguments() {
    let originalCallArgs = this.inputs
      .filter(input => !input.txParam)
      .map(input => this.state[input.name]);
    let relevantTxParameters = this.inputs.filter(
      input => input.txParam && this.state[input.name] !== ""
    );
    if (!relevantTxParameters.length) return originalCallArgs;
    let txParams = {};
    relevantTxParameters.map(
      input => (txParams[input.name] = this.state[input.name])
    );
    let augmentedCallArgs = originalCallArgs.clone();
    augmentedCallArgs.push(txParams);
    return augmentedCallArgs;
  }

  handleSubmit() {
    this.getMethod(this.props.method).cacheSend(
      ...this.generateSendArguments()
    );
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  translateType(type) {
    switch (true) {
      case /^uint/.test(type):
        return "number";
        break;
      case /^string/.test(type) || /^bytes/.test(type):
        return "text";
        break;
      case /^bool/.test(type):
        return "checkbox";
        break;
      default:
        return "text";
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <form className={classes.container} noValidate autoComplete="off">
        {this.inputs.map((input, index) => {
          let inputType = this.translateType(input.type);
          let inputLabel =
            this.props.labels && index < this.props.labels.length
              ? this.props.labels[index]
              : input.name;
          // check if input type is struct and if so loop out struct fields as well
          return (
            <TextField
              required={!input.txParam}
              key={input.name}
              type={inputType}
              id={input.name}
              name={input.name}
              label={inputLabel}
              placeholder={input.txParam ? "default" : ""}
              onChange={this.handleInputChange}
              className={classes.textField}
              margin="normal"
            />
          );
        }, this)}
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleSubmit}
        >
          Submit
          <SendIcon className={classes.rightIcon} />
        </Button>
      </form>
    );
  }
}

ContractMyForm.contextTypes = {
  drizzle: PropTypes.object
};

ContractMyForm.propTypes = {
  classes: PropTypes.object.isRequired,
  contract: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  labels: PropTypes.array,
  txParams: PropTypes.object
};

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    contracts: state.contracts
  };
};

export default drizzleConnect(
  withStyles(styles)(ContractMyForm),
  mapStateToProps
);
