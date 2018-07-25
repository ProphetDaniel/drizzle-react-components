import { drizzleConnect } from "drizzle-react";
import React from "react";
import PropTypes from "prop-types";
import CanGetABIComponent from "./CanGetABIComponent";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import ContractData from "./ContractData";

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

class ContractParametrizableData extends CanGetABIComponent {
  constructor(props, context) {
    super(props, context.drizzle.contracts);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.inputs = this.getABI(this.props.method).inputs.clone();

    let initialState = {};
    this.inputs.forEach(input => {
      initialState[input.name] = "";
    });
    this.state = initialState;
  }

  generateCallArguments() {
    let originalCallArgs = this.inputs.map(input => this.state[input.name]);
    return originalCallArgs;
  }

  handleSubmit() {
    this.setState({ callArgs: [...this.generateCallArguments()] });
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      callArgs: false
    });
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
        {this.state.callArgs ? (
          <ContractData
            contract={this.getContract().contractName}
            method={this.props.method}
            methodArgs={this.state.callArgs}
          />
        ) : null}
      </form>
    );
  }
}

ContractParametrizableData.contextTypes = {
  drizzle: PropTypes.object
};

ContractParametrizableData.propTypes = {
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
  withStyles(styles)(ContractParametrizableData),
  mapStateToProps
);
