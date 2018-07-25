import { Component } from "react";

/**
 * Naive clone https://davidwalsh.name/javascript-clone-array
 */
Array.prototype.clone = function() {
  return this.slice(0);
};

class CanGetABIComponent extends Component {
  constructor(props, contracts) {
    super(props);
    this.contracts = contracts;
  }

  getABI = methodName => {
    const abi = this.getWholeABI();
    // Iterate over abi for correct function.
    return abi.find(selectedAbi => selectedAbi.name === methodName);
  };

  getWholeABI = () => {
    return this.getContract().abi;
  };

  getMethod = methodName => {
    return this.getContract().methods[methodName];
  };

  getContract = () => {
    return this.contracts[this.props.contract];
  };

  getContractFromProps = () => {
    return this.props.contracts[this.props.contract];
  };

  getMethodFromProps = methodName => {
    return this.getContractFromProps()[methodName];
  };
}

export default CanGetABIComponent;
