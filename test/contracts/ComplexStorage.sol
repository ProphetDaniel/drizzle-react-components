pragma solidity ^0.4.0;

contract ComplexStorage {

	uint public storeduint1 = 15; 								// ok
	uint public constant constuint = 16;						// ok
	uint128 public investmentsLimit = 17055;					// ok
	uint32 public investmentsDeadlineTimeStamp = uint32(now); 	// ok

	bytes16 public string1 = "test1";							// ok
	bytes32 public string2 = "test1236";						// ok
	string public string3 = "lets string something";			// ok

	mapping (address => uint) uints1;							// TODO
	mapping (address => DeviceData) structs1;					// TODO

	uint[] public uintarray;									// ok
	DeviceData[] public deviceDataArray;						// ok
    DeviceData public singleDD;									// ok

	struct DeviceData {
		string deviceBrand;
		string deviceYear;
		string batteryWearLevel;
	}

	function ComplexStorage() public {
		address address1 = 0xbCcc714d56bc0da0fd33d96d2a87b680dD6D0DF6; 		// ok
		address address2 = 0xaee905FdD3ED851e48d22059575b9F4245A82B04;		// ok

		uints1[address1] = 88;			// TODO
		uints1[address2] = 99;			// TODO

		var dev1 = DeviceData("deviceBrand", "deviceYear", "wearLevel");	// ok
		var dev2 = DeviceData("deviceBrand2", "deviceYear2", "wearLevel2");	// ok
        var dev3 = DeviceData("deviceBrand3", "deviceYear3", "wearLevel3");	// ok

		structs1[address1] = dev1;		// TODO
		structs1[address2] = dev2;		// TODO
        singleDD = dev3;				// ok

		uintarray.push(8000); 			// ok
		uintarray.push(9000); 			// ok

		deviceDataArray.push(dev1);		// ok
		deviceDataArray.push(dev2);		// ok
	}
}
