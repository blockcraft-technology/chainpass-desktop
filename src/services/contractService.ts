import { ethers } from 'ethers';

const abi: any[] = [
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "pointer",
          "type": "address"
        }
      ],
      "name": "DataItemAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "oldPointer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newPointer",
          "type": "address"
        }
      ],
      "name": "DataItemPointerUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "pointer",
          "type": "address"
        }
      ],
      "name": "DataItemRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "pointer",
          "type": "address"
        }
      ],
      "name": "DataItemShared",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newPointer",
          "type": "address"
        }
      ],
      "name": "SettingsPointerUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "pointer",
          "type": "address"
        }
      ],
      "name": "SharedDataItemRemoved",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "pointer",
          "type": "address"
        }
      ],
      "name": "addDataItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "me",
          "type": "address"
        }
      ],
      "name": "getDataSharedWithMe",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "pointer",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            }
          ],
          "internalType": "struct FileSharing.DataItem[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserData",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "pointer",
          "type": "address"
        }
      ],
      "name": "removeDataItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "pointer",
          "type": "address"
        }
      ],
      "name": "removeSharedDataItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "pointer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        }
      ],
      "name": "shareDataItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "sharedWithUser",
      "outputs": [
        {
          "internalType": "address",
          "name": "pointer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "oldPointer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "newPointer",
          "type": "address"
        }
      ],
      "name": "updateDataItemPointer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newPointer",
          "type": "address"
        }
      ],
      "name": "updateSettingsPointer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userDataItems",
      "outputs": [
        {
          "internalType": "address",
          "name": "pointer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userPointers",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userSettingsPointer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

class ContractService {
  private contractAddress: string;
  private providerUrl: string;
  private privateKey: string;
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(contractAddress: string, providerUrl: string, privateKey: string) {
    if (!privateKey) {
      throw new Error('Private key not provided');
    }

    this.contractAddress = contractAddress;
    this.providerUrl = providerUrl;
    this.privateKey = privateKey;

    // Set up the provider and wallet
    this.provider = new ethers.JsonRpcProvider(this.providerUrl);
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);

    this.contract = new ethers.Contract(this.contractAddress, abi, this.wallet);
    console.log('Contract initialized successfully');
  }

  public async updateSettingsPointer(newPointer: string): Promise<void> {
    try {
      const tx = await this.contract.updateSettingsPointer(newPointer);
      console.log('Transaction submitted:', tx.hash);
      await tx.wait(); // Wait for transaction confirmation
      console.log('Transaction confirmed');
    } catch (error) {
      console.error('Error updating settings pointer:', error);
    }
  }

  public async addDataItem(pointer: string): Promise<void> {
    try {
      const tx = await this.contract.addDataItem(pointer, {
        gasLimit: 6700000,
      });
      console.log('Transaction submitted:', tx.hash);
      await tx.wait(); // Wait for transaction confirmation
      console.log('Transaction confirmed');
    } catch (error) {
      console.error('Error adding data item:', error);
    }
  }

  public async shareDataItem(pointer: string, recipient: string): Promise<void> {
    try {
      const tx = await this.contract.shareDataItem(pointer, recipient);
      console.log('Transaction submitted:', tx.hash);
      await tx.wait(); // Wait for transaction confirmation
      console.log('Transaction confirmed');
    } catch (error) {
      console.error('Error sharing data item:', error);
    }
  }

  public async getFilesSharedWithMe(address: string): Promise<any[]> {
    try {
      const sharedFiles = await this.contract.getFilesSharedWithMe(address);
      console.log('Files shared with user:', sharedFiles);
      return sharedFiles;
    } catch (error) {
      console.error('Error getting files shared with user:', error);
      return [];
    }
  }

  public async removeSharedDataItem(recipient: string, pointer: string): Promise<void> {
    try {
      const tx = await this.contract.removeSharedDataItem(recipient, pointer);
      console.log('Transaction submitted:', tx.hash);
      await tx.wait(); // Wait for transaction confirmation
      console.log('Transaction confirmed');
    } catch (error) {
      console.error('Error removing shared data item:', error);
    }
  }

  public async getUserData(userAddress: string): Promise<address[]> {
    try {
      const dataItems = await this.contract.getUserData(userAddress);
      console.log('User data items:', dataItems);
      return dataItems;
    } catch (error) {
      console.error('Error fetching user data items:', error);
      return [];
    }
  }

  // Remove data item by pointer
  public async removeDataItem(pointer: string): Promise<void> {
    try {
      const tx = await this.contract.removeDataItem(pointer);
      console.log('Transaction submitted:', tx.hash);
      await tx.wait(); // Wait for transaction confirmation
      console.log('Transaction confirmed');
    } catch (error) {
      console.error('Error removing data item:', error);
    }
  }

  // Update data item pointer
  public async updateDataItemPointer(oldPointer: string, newPointer: string): Promise<void> {
    try {
      const tx = await this.contract.updateDataItemPointer(oldPointer, newPointer);
      console.log('Transaction submitted:', tx.hash);
      await tx.wait(); // Wait for transaction confirmation
      console.log('Transaction confirmed');
    } catch (error) {
      console.error('Error updating data item pointer:', error);
    }
  }

  // Get data shared with user
  public async sharedWithUser(owner: string, user: string): Promise<any> {
    try {
      const sharedData = await this.contract.sharedWithUser(owner, user);
      console.log('Shared data:', sharedData);
      return sharedData;
    } catch (error) {
      console.error('Error fetching shared data:', error);
      return null;
    }
  }

  // Get user settings pointer
  public async getUserSettingsPointer(userAddress: string): Promise<string> {
    try {
      const settingsPointer = await this.contract.userSettingsPointer(userAddress);
      console.log('User settings pointer:', settingsPointer);
      return settingsPointer;
    } catch (error) {
      console.error('Error fetching user settings pointer:', error);
      return '';
    }
  }

}

export default ContractService;
