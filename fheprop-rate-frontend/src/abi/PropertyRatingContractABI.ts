
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const PropertyRatingContractABI = {
  "abi": [
    {
      "inputs": [],
      "name": "AlreadyRated",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidScore",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ProjectExpired",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ProjectNotFound",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "Unauthorized",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "ProjectCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "rater",
          "type": "address"
        }
      ],
      "name": "RatingSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        }
      ],
      "name": "StatisticsUpdated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "location",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "dimensions",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        }
      ],
      "name": "createProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        }
      ],
      "name": "getAllProjectRatings",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "raters",
          "type": "address[]"
        },
        {
          "internalType": "bool[]",
          "name": "hasRated",
          "type": "bool[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProjectCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        }
      ],
      "name": "getProjectInfo",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "location",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "dimensions",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        }
      ],
      "name": "getProjectStatistics",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "totalScore",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "ratingCount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "locationTotal",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "qualityTotal",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amenitiesTotal",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "transportTotal",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "valueTotal",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "potentialTotal",
              "type": "uint256"
            }
          ],
          "internalType": "struct PropertyRatingContract.ProjectStatistics",
          "name": "stats",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserRating",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "locationScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "qualityScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amenitiesScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "transportScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "valueScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "potentialScore",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "hasUserRated",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isMockMode",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextProjectId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "projects",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "location",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "dimensions",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "ratingCount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "internalType": "externalEuint32",
          "name": "locationRating",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "locationProof",
          "type": "bytes"
        },
        {
          "internalType": "externalEuint32",
          "name": "qualityRating",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "qualityProof",
          "type": "bytes"
        },
        {
          "internalType": "externalEuint32",
          "name": "amenitiesRating",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "amenitiesProof",
          "type": "bytes"
        },
        {
          "internalType": "externalEuint32",
          "name": "transportRating",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "transportProof",
          "type": "bytes"
        },
        {
          "internalType": "externalEuint32",
          "name": "valueRating",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "valueProof",
          "type": "bytes"
        },
        {
          "internalType": "externalEuint32",
          "name": "potentialRating",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "potentialProof",
          "type": "bytes"
        }
      ],
      "name": "submitRating",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "locationRating",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "qualityRating",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amenitiesRating",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "transportRating",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "valueRating",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "potentialRating",
          "type": "uint256"
        }
      ],
      "name": "submitRatingMock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userRatings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "locationScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "qualityScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amenitiesScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "transportScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "valueScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "potentialScore",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "hasRated",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
} as const;

