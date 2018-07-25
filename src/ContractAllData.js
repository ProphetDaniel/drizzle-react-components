import { drizzleConnect } from "drizzle-react";
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import ContractForm from "./ContractForm";
import ContractData from "./ContractData";
import ContractParameterizableData from "./ContractParameterizableData";
import CanGetABIComponent from "./CanGetABIComponent";

Object.from = arr =>
  arr.length === 0 ? {} : Object.assign(...arr.map(([k, v]) => ({ [k]: v })));
Object.filter = (obj, predicate) =>
  Object.from(Object.entries(obj).filter(predicate));
/*
 * Create component.
 */
class ContractAllData extends CanGetABIComponent {
  constructor(props, context) {
    super(props, context.drizzle.contracts);
    // Fetch initial value from chain and return cache key for reactive updates.
    // var methodArgs = this.props.methodArgs ? this.props.methodArgs : []
    let allMethods = this.contracts[this.props.contract].methods;
    let filteredMethods = Object.filter(
      allMethods,
      ([name, method]) => !name.startsWith("0x") && !name.endsWith(")")
    );
    let dataMethods = Object.filter(
      filteredMethods,
      ([name, method]) => method.cacheCall
    );
    let functionMethods = Object.filter(
      filteredMethods,
      ([name, method]) => method.cacheSend
    );
    this.dataMethodEntries = Object.entries(dataMethods);
    this.functionMethodEntries = Object.entries(functionMethods);
  }

  render() {
    return (
      <Fragment>
        <div className="pure-u-1-1">
          <h2>{this.props.contract}</h2>
          {this.dataMethodEntries.map(
            dataMethodEntry => (
              <li key={dataMethodEntry}>
                <strong>{dataMethodEntry[0]}</strong>:{" "}
                {this.getABI(dataMethodEntry[0]).inputs.length ? (
                  <ContractParameterizableData
                    contract={this.props.contract}
                    method={dataMethodEntry[0]}
                  />
                ) : (
                  <ContractData
                    contract={this.props.contract}
                    method={dataMethodEntry[0]}
                  />
                )}
              </li>
            ),
            this
          )}

          {this.functionMethodEntries.map(
            functionMethodEntry => (
              <li key={functionMethodEntry}>
                <strong>{functionMethodEntry[0]}</strong>:{" "}
                <ContractForm
                  contract={this.props.contract}
                  method={functionMethodEntry[0]}
                />
              </li>
            ),
            this
          )}
          <br />
          <br />
        </div>
      </Fragment>
    );
  }
}

ContractAllData.contextTypes = {
  drizzle: PropTypes.object
};

/*
 * Export connected component.
 */
const mapStateToProps = state => {
  return {
    // contracts: state.contracts
  };
};

export default drizzleConnect(ContractAllData, mapStateToProps);
