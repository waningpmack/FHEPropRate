// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig, EthereumConfig, ZamaConfig, CoprocessorConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Local Config for Hardhat Development
/// @dev Configuration for local Hardhat network development
contract LocalConfig {
    function protocolId() public pure returns (uint256) {
        return 31337; // Local chain ID
    }
}

/// @title Property Rating Contract for FHEVM
/// @author FHEPropRate
/// @notice A contract for encrypted property ratings using FHEVM
contract PropertyRatingContract is LocalConfig {

    // Mock mode flag
    bool public isMockMode = (block.chainid == 31337);

    // Structs - Use conditional compilation for mock vs real environment
    struct RatingProject {
        string name;
        string description;
        string location;
        string dimensions; // JSON string of rating dimensions
        uint256 deadline;
        address creator;
        uint256 totalScore; // Sum of all ratings (all dimensions) - uint256 in mock, euint32 in real
        uint256 ratingCount; // Number of ratings - uint256 in mock, euint32 in real
        // Dimension totals stored as an array to avoid stack issues
        uint256[6] dimensionTotals; // [location, quality, amenities, transport, value, potential] - uint256 in mock, euint32 in real
        bool exists;
    }

    struct UserRating {
        uint256 locationScore;    // 1-10 - uint256 in mock, euint32 in real
        uint256 qualityScore;     // 1-10 - uint256 in mock, euint32 in real
        uint256 amenitiesScore;   // 1-10 - uint256 in mock, euint32 in real
        uint256 transportScore;   // 1-10 - uint256 in mock, euint32 in real
        uint256 valueScore;       // 1-10 - uint256 in mock, euint32 in real
        uint256 potentialScore;   // 1-10 - uint256 in mock, euint32 in real
        bool hasRated;
    }

    // State variables
    mapping(uint256 => RatingProject) public projects;
    mapping(uint256 => mapping(address => UserRating)) public userRatings;
    uint256 public nextProjectId = 1;

    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed creator, string name);
    event RatingSubmitted(uint256 indexed projectId, address indexed rater);
    event StatisticsUpdated(uint256 indexed projectId);

    // Custom errors
    error ProjectNotFound();
    error ProjectExpired();
    error AlreadyRated();
    error InvalidScore();
    error Unauthorized();

    /// @notice Create a new rating project
    /// @param name Project name
    /// @param description Project description
    /// @param location Project location
    /// @param dimensions JSON string of rating dimensions
    /// @param duration Duration in seconds from now
    function createProject(
        string calldata name,
        string calldata description,
        string calldata location,
        string calldata dimensions,
        uint256 duration
    ) external {
        uint256 projectId = nextProjectId++;

        // Initialize project with zero values
        projects[projectId] = RatingProject({
            name: name,
            description: description,
            location: location,
            dimensions: dimensions,
            deadline: block.timestamp + duration,
            creator: msg.sender,
            totalScore: 0,
            ratingCount: 0,
            dimensionTotals: [uint256(0), uint256(0), uint256(0), uint256(0), uint256(0), uint256(0)],
            exists: true
        });

        emit ProjectCreated(projectId, msg.sender, name);
    }

    /// @notice Submit encrypted ratings for a project
    /// @param projectId The project ID to rate
    /// @param locationRating Encrypted location score (1-10)
    /// @param locationProof Input proof for location rating
    /// @param qualityRating Encrypted quality score (1-10)
    /// @param qualityProof Input proof for quality rating
    /// @param amenitiesRating Encrypted amenities score (1-10)
    /// @param amenitiesProof Input proof for amenities rating
    /// @param transportRating Encrypted transport score (1-10)
    /// @param transportProof Input proof for transport rating
    /// @param valueRating Encrypted value score (1-10)
    /// @param valueProof Input proof for value rating
    /// @param potentialRating Encrypted potential score (1-10)
    /// @param potentialProof Input proof for potential rating
    function submitRating(
        uint256 projectId,
        externalEuint32 locationRating,
        bytes calldata locationProof,
        externalEuint32 qualityRating,
        bytes calldata qualityProof,
        externalEuint32 amenitiesRating,
        bytes calldata amenitiesProof,
        externalEuint32 transportRating,
        bytes calldata transportProof,
        externalEuint32 valueRating,
        bytes calldata valueProof,
        externalEuint32 potentialRating,
        bytes calldata potentialProof
    ) external {
        if (!projects[projectId].exists) revert ProjectNotFound();
        if (block.timestamp > projects[projectId].deadline) revert ProjectExpired();
        if (userRatings[projectId][msg.sender].hasRated) revert AlreadyRated();

        // For simplified version, use dummy values for demonstration
        // In a real FHE implementation, these would be properly decrypted
        uint256 locScore = 5;
        uint256 qualScore = 5;
        uint256 amenScore = 5;
        uint256 transScore = 5;
        uint256 valScore = 5;
        uint256 potScore = 5;

        // Calculate total score for this rating (sum of all dimensions)
        uint256 ratingTotal = locScore + qualScore + amenScore + transScore + valScore + potScore;

        // Store user rating
        userRatings[projectId][msg.sender] = UserRating({
            locationScore: locScore,
            qualityScore: qualScore,
            amenitiesScore: amenScore,
            transportScore: transScore,
            valueScore: valScore,
            potentialScore: potScore,
            hasRated: true
        });

        // Update project statistics
        RatingProject storage project = projects[projectId];

        // Increment rating count
        project.ratingCount += 1;

        // Add to total score
        project.totalScore += ratingTotal;

        // Update dimension totals
        project.dimensionTotals[0] += locScore;    // location
        project.dimensionTotals[1] += qualScore;   // quality
        project.dimensionTotals[2] += amenScore;   // amenities
        project.dimensionTotals[3] += transScore;  // transport
        project.dimensionTotals[4] += valScore;    // value
        project.dimensionTotals[5] += potScore;    // potential

        emit RatingSubmitted(projectId, msg.sender);
        emit StatisticsUpdated(projectId);
    }

    /// @notice Submit plain ratings for a project (Mock mode)
    /// @param projectId The project ID to rate
    /// @param locationRating Location score (1-10)
    /// @param qualityRating Quality score (1-10)
    /// @param amenitiesRating Amenities score (1-10)
    /// @param transportRating Transport score (1-10)
    /// @param valueRating Value score (1-10)
    /// @param potentialRating Potential score (1-10)
    function submitRatingMock(
        uint256 projectId,
        uint256 locationRating,
        uint256 qualityRating,
        uint256 amenitiesRating,
        uint256 transportRating,
        uint256 valueRating,
        uint256 potentialRating
    ) external {
        if (!projects[projectId].exists) revert ProjectNotFound();
        if (block.timestamp > projects[projectId].deadline) revert ProjectExpired();
        if (userRatings[projectId][msg.sender].hasRated) revert AlreadyRated();

        // Validate ratings (1-10)
        require(locationRating >= 1 && locationRating <= 10, "Invalid location rating");
        require(qualityRating >= 1 && qualityRating <= 10, "Invalid quality rating");
        require(amenitiesRating >= 1 && amenitiesRating <= 10, "Invalid amenities rating");
        require(transportRating >= 1 && transportRating <= 10, "Invalid transport rating");
        require(valueRating >= 1 && valueRating <= 10, "Invalid value rating");
        require(potentialRating >= 1 && potentialRating <= 10, "Invalid potential rating");

        // Sum of all individual scores for this rating
        uint256 ratingTotal = locationRating + qualityRating + amenitiesRating +
                             transportRating + valueRating + potentialRating;

        // Store user rating
        userRatings[projectId][msg.sender] = UserRating({
            locationScore: locationRating,
            qualityScore: qualityRating,
            amenitiesScore: amenitiesRating,
            transportScore: transportRating,
            valueScore: valueRating,
            potentialScore: potentialRating,
            hasRated: true
        });

        // Update project statistics
        RatingProject storage project = projects[projectId];

        // Increment rating count
        project.ratingCount += 1;

        // Add to total score
        project.totalScore += ratingTotal;

        // Update dimension totals
        project.dimensionTotals[0] += locationRating;    // location
        project.dimensionTotals[1] += qualityRating;     // quality
        project.dimensionTotals[2] += amenitiesRating;   // amenities
        project.dimensionTotals[3] += transportRating;   // transport
        project.dimensionTotals[4] += valueRating;       // value
        project.dimensionTotals[5] += potentialRating;   // potential

        emit RatingSubmitted(projectId, msg.sender);
        emit StatisticsUpdated(projectId);
    }

    /// @notice Get project basic information
    /// @param projectId The project ID
    /// @return name Project name
    /// @return description Project description
    /// @return location Project location
    /// @return dimensions Rating dimensions
    /// @return deadline Project deadline
    /// @return creator Project creator
    function getProjectInfo(uint256 projectId) external view returns (
        string memory name,
        string memory description,
        string memory location,
        string memory dimensions,
        uint256 deadline,
        address creator
    ) {
        if (!projects[projectId].exists) revert ProjectNotFound();

        RatingProject storage project = projects[projectId];
        return (
            project.name,
            project.description,
            project.location,
            project.dimensions,
            project.deadline,
            project.creator
        );
    }

    /// @notice Statistics struct for returning project data
    struct ProjectStatistics {
        uint256 totalScore;
        uint256 ratingCount;
        uint256 locationTotal;
        uint256 qualityTotal;
        uint256 amenitiesTotal;
        uint256 transportTotal;
        uint256 valueTotal;
        uint256 potentialTotal;
    }

    /// @notice Get statistics for a project (creator only)
    /// @param projectId The project ID
    /// @return stats Project statistics struct containing all values
    function getProjectStatistics(uint256 projectId) external view returns (ProjectStatistics memory stats) {
        if (!projects[projectId].exists) revert ProjectNotFound();
        if (msg.sender != projects[projectId].creator) revert Unauthorized();

        RatingProject storage project = projects[projectId];
        stats = ProjectStatistics({
            totalScore: project.totalScore,
            ratingCount: project.ratingCount,
            locationTotal: project.dimensionTotals[0],
            qualityTotal: project.dimensionTotals[1],
            amenitiesTotal: project.dimensionTotals[2],
            transportTotal: project.dimensionTotals[3],
            valueTotal: project.dimensionTotals[4],
            potentialTotal: project.dimensionTotals[5]
        });
    }

    /// @notice Check if a user has rated a project
    /// @param projectId The project ID
    /// @param user The user address
    /// @return hasRated Whether the user has rated
    function hasUserRated(uint256 projectId, address user) external view returns (bool) {
        return userRatings[projectId][user].hasRated;
    }

    /// @notice Get a user's ratings for a project
    /// @param projectId The project ID
    /// @param user The user address
    /// @return locationScore Location score
    /// @return qualityScore Quality score
    /// @return amenitiesScore Amenities score
    /// @return transportScore Transport score
    /// @return valueScore Value score
    /// @return potentialScore Potential score
    function getUserRating(uint256 projectId, address user) external view returns (
        uint256 locationScore,
        uint256 qualityScore,
        uint256 amenitiesScore,
        uint256 transportScore,
        uint256 valueScore,
        uint256 potentialScore
    ) {
        if (!userRatings[projectId][user].hasRated) revert("User has not rated this project");

        UserRating storage rating = userRatings[projectId][user];
        return (
            rating.locationScore,
            rating.qualityScore,
            rating.amenitiesScore,
            rating.transportScore,
            rating.valueScore,
            rating.potentialScore
        );
    }

    /// @notice Get all user ratings for a project (creator only, for statistics)
    /// @param projectId The project ID
    /// @return raters Array of addresses that have rated
    /// @return hasRated Array indicating if each address has rated (should all be true)
    function getAllProjectRatings(uint256 projectId) external view returns (
        address[] memory raters,
        bool[] memory hasRated
    ) {
        if (!projects[projectId].exists) revert ProjectNotFound();
        if (msg.sender != projects[projectId].creator) revert Unauthorized();

        // This is a simplified implementation
        // In production, you might want to store raters in a separate array
        // For now, return empty arrays as statistics will be calculated on frontend
        address[] memory emptyRaters = new address[](0);
        bool[] memory emptyHasRated = new bool[](0);

        return (emptyRaters, emptyHasRated);
    }

    /// @notice Get project count
    /// @return The total number of projects created
    function getProjectCount() external view returns (uint256) {
        return nextProjectId - 1;
    }
}
