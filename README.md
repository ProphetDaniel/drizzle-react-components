# drizzle-react-components-plus
A set of useful components for common UI elements based on drizzle-react-components with Material-UI. It solving the following problems:

- Lack of ContractParameterizableData
- Lack of ContractAllData
- Spinner for Account balance
- Input form for optional txParams

## Instalation

```bash
npm install drizzle-react-components-plus
```

## Components

### LoadingContainer

This components wraps your entire app (but within the DrizzleProvider) and will show a loading screen until Drizzle, and therefore web3 and your contracts, are initialized.

`loadingComp` (component) The component displayed while Drizzle intializes.

`errorComp` (component) The component displayed if Drizzle initialization fails.

### ContractAllData

`contract` (string, required) Name of the contract to call.

### ContractParameterizableData

`contract` (string, required) Name of the contract to call.

`method` (string, required) Method of the contract to call.

`methodArgs` (array) Arguments for the contract method call. EX: The address for an ERC20 balanceOf() function. The last argument can optionally be an options object with the typical from, gas and gasPrice keys.

`hideIndicator` (boolean) If true, hides the loading indicator during contract state updates. Useful for things like ERC20 token symbols which do not change.

`toUtf8` (boolean) Converts the return value to a UTF-8 string before display.

`toAscii` (boolean) Converts the return value to an Ascii string before display.

### ContractData

`contract` (string, required) Name of the contract to call.

`method` (string, required) Method of the contract to call.

`methodArgs` (array) Arguments for the contract method call. EX: The address for an ERC20 balanceOf() function. The last argument can optionally be an options object with the typical from, gas and gasPrice keys.

`hideIndicator` (boolean) If true, hides the loading indicator during contract state updates. Useful for things like ERC20 token symbols which do not change.

`toUtf8` (boolean) Converts the return value to a UTF-8 string before display.

`toAscii` (boolean) Converts the return value to an Ascii string before display.

### ContractForm

`contract` (string, required) Name of the contract whose method will be the basis the form.

`method` (string, required) Method whose inputs will be used to create corresponding form fields.

`labels` (array) Custom labels; will follow ABI input ordering. Useful for friendlier names. For example "_to" becoming "Recipient Address".
