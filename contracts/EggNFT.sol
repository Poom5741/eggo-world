// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IFoodNFT {
    function mintFood(address to) external returns (uint256);
}

contract EggNFT is ERC721 {
    struct Egg {
        uint8 rarity;
        uint256 mintedAt;
    }

    IERC20 public immutable usdt;
    IFoodNFT public immutable foodNft;
    address public immutable projectWallet;

    uint256 public constant EGG_PRICE = 25 * 1e6; // 25 USDT (6 decimals)
    uint256 public constant MEMBERSHIP_DAYS = 30;

    uint256 private _nextTokenId;
    mapping(uint256 => Egg) private _eggs;
    mapping(address => uint256) public membershipExpiry;
    mapping(address => address) private _referrers;

    event EggMinted(address indexed buyer, uint256 indexed tokenId, uint8 rarity);
    event CommissionPaid(address indexed referrer, uint256 amount, uint8 generation);

    constructor(address _usdt, address _foodNft, address _projectWallet)
        ERC721("EggoWorld Egg", "EGGOW")
    {
        usdt = IERC20(_usdt);
        foodNft = IFoodNFT(_foodNft);
        projectWallet = _projectWallet;
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    function mintEgg(address referrer) external {
        require(usdt.allowance(msg.sender, address(this)) >= EGG_PRICE, "Wrong payment amount");
        require(usdt.transferFrom(msg.sender, address(this), EGG_PRICE), "Transfer failed");

        // Register referrer on first mint
        if (_referrers[msg.sender] == address(0) && referrer != address(0)) {
            _referrers[msg.sender] = referrer;
        }

        // Mint Egg
        uint256 tokenId = ++_nextTokenId;
        uint8 rarity = uint8((uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, tokenId))) % 5) + 1);
        _eggs[tokenId] = Egg({rarity: rarity, mintedAt: block.timestamp});
        _safeMint(msg.sender, tokenId);

        // Mint Food NFT
        foodNft.mintFood(msg.sender);

        // Extend membership
        uint256 currentExpiry = membershipExpiry[msg.sender];
        uint256 base = currentExpiry > block.timestamp ? currentExpiry : block.timestamp;
        membershipExpiry[msg.sender] = base + MEMBERSHIP_DAYS * 1 days;

        // Distribute commission
        _distributeCommission(msg.sender);

        emit EggMinted(msg.sender, tokenId, rarity);
    }

    function getRarity(uint256 tokenId) external view returns (uint8) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        return _eggs[tokenId].rarity;
    }

    function hasValidMembership(address user) external view returns (bool) {
        return membershipExpiry[user] > block.timestamp;
    }

    function getReferrer(address user) external view returns (address) {
        return _referrers[user];
    }

    function _distributeCommission(address buyer) internal {
        // Walk up to 4 generations
        address current = _referrers[buyer];
        uint256 remaining = EGG_PRICE;

        for (uint8 gen = 1; gen <= 4 && current != address(0); gen++) {
            uint256 commission;
            if (gen == 1) {
                commission = EGG_PRICE * 20 / 100; // 20%
            } else {
                commission = EGG_PRICE * 10 / 100; // 10%
            }
            remaining -= commission;
            require(usdt.transfer(current, commission), "Commission transfer failed");
            emit CommissionPaid(current, commission, gen);
            current = _referrers[current];
        }

        // Remaining to project wallet
        if (remaining > 0) {
            require(usdt.transfer(projectWallet, remaining), "Project transfer failed");
        }
    }
}
