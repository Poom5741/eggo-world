// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FoodNFT is ERC721 {
    address public minter;
    uint256 private _nextTokenId;

    constructor() ERC721("EggoWorld Food", "FOOD") {}

    modifier onlyMinter() {
        require(msg.sender == minter, "Only minter");
        _;
    }

    function setMinter(address _minter) external {
        require(minter == address(0) || msg.sender == minter, "Unauthorized");
        minter = _minter;
    }

    function mintFood(address to) external onlyMinter returns (uint256) {
        uint256 tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
        return tokenId;
    }
}
