import { drizzleConnect } from "drizzle-react";
import React from "react";
import PropTypes from "prop-types";
import CanGetABIComponent from "./CanGetABIComponent";

/*
 * Create component.
 */

class ContractData extends CanGetABIComponent {
  constructor(props, context) {
    super(props, context.drizzle.contracts);

    // Fetch initial value from chain and return cache key for reactive updates.
    var methodArgs = this.props.methodArgs ? this.props.methodArgs : [];
    this.dataKey = this.getMethod(this.props.method).cacheCall(...methodArgs);
  }

  render() {
    const propsContract = this.getContractFromProps();
    const propsMethod = this.getMethodFromProps(this.props.method);
    // Contract is not yet intialized.
    if (!propsContract.initialized) {
      return <span>Initializing...</span>;
    }

    // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
    if (!(this.dataKey in propsMethod)) {
      return <span>Fetching...</span>;
    }

    // Show a loading spinner for future updates.
    var pendingSpinner = propsContract.synced ? "" : " 🔄";

    // Optionally hide loading spinner (EX: ERC20 token symbol).
    if (this.props.hideIndicator) {
      pendingSpinner = "";
    }

    var displayData = propsMethod[this.dataKey].value;

    // Optionally convert to UTF8
    if (this.props.toUtf8) {
      displayData = this.context.drizzle.web3.utils.hexToUtf8(displayData);
    }

    // Optionally convert to Ascii
    if (this.props.toAscii) {
      displayData = this.context.drizzle.web3.utils.hexToAscii(displayData);
    }

    // If return value is an array
    if (typeof displayData === "array") {
      const displayListItems = displayData.map((datum, index) => {
        <li key={index}>
          {datum}
          {pendingSpinner}
        </li>;
      });

      return <ul>{displayListItems}</ul>;
    }

    // If retun value is an object
    if (typeof displayData === "object") {
      var i = 0;
      const displayObjectProps = [];

      Object.keys(displayData).forEach(key => {
        if (i !== key) {
          displayObjectProps.push(
            <li key={i}>
              <strong>{key}</strong>
              {pendingSpinner}
              <br />
              {displayData[key]}
            </li>
          );
        }

        i++;
      });

      return <ul>{displayObjectProps}</ul>;
    }

    return (
      <span>
        {displayData}
        {pendingSpinner}
      </span>
    );
  }
}

ContractData.contextTypes = {
  drizzle: PropTypes.object
};

/*
 * Export connected component.
 */

const mapStateToProps = state => {
  return {
    contracts: state.contracts
  };
};

export default drizzleConnect(ContractData, mapStateToProps);
