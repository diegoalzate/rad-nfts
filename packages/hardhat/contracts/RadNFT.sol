// // SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";
contract RadNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public constant MAX_NFTS = 50;
    // We split the SVG at the part where it asks for the background color.
    string svgPartOne = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPartTwo = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
    string[] firstWords = ["God", "Fake", "Real", "Agile", "Shit", "Quick", "Competetive", "Focused", "Confident", "Gifted", "Dumb", "Outstanding", "Honorable", "Loser", "Champion", "Adaptable", "Slow"];
    string[] secondWords = ["Ferrari", "Mercedes", "RedBull", "Alpine", "Haas", "Alfa", "AlphaTauri", "McLaren", "AstonMartin", "Williams", "Lotus", "Renault", "Maserati", "Toyota", "Honda", "Porsche", "Ford"];
    string[] thirdWords = ["Leclerc", "Sainz", "Verstappen", "Russell", "Hamilton", "Ocon", "Perez", "Magnussen", "Bottas", "Norris", "Tsunoda", "Gasly", "Alonso", "Zhou", "Schumacher", "Ricciardo", "Vettel"];
    string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green"];   
    event NewRadNFTMinted(address sender, uint256 tokenId);
    constructor() ERC721("RadNFT", "RAD") {
        console.log("This is Rad");
    }

    function pickRandomWord(uint256 tokenId, string[] memory words) public pure returns (string memory){
        // seed
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % words.length;
        return words[rand];
    }

    function pickRandomColor(uint256 tokenId) internal view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
        rand = rand % colors.length;
        return colors[rand];
    }
    
    function random(string memory input) internal pure returns(uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function makeARadNFT() public {
        require(_tokenIds.current() < MAX_NFTS, "All NFTs have been minted");
        uint256 newItemId = _tokenIds.current();
        string memory first = pickRandomWord(newItemId, firstWords);
        string memory second = pickRandomWord(newItemId, secondWords);
        string memory third = pickRandomWord(newItemId, thirdWords);
        string memory combinedWord = string(abi.encodePacked(first, second, third));
        string memory randomColor = pickRandomColor(newItemId);
        string memory finalSvg = string(abi.encodePacked(svgPartOne, randomColor, svgPartTwo, combinedWord,  "</text></svg>"));

        console.log("\n--------------------");
        console.log(finalSvg);
        console.log("--------------------\n");

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        combinedWord,
                        '",',
                        '"description": "A collection for real ones",',
                        '"image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(abi.encodePacked("data:application/json;base64,", json));
        console.log(
            string(
                abi.encodePacked(
                    "https://nftpreview.0xdev.codes/?code=",
                    finalTokenUri
                )
            )
        );        
        
        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, finalTokenUri);
        
        emit NewRadNFTMinted(msg.sender, newItemId);

        _tokenIds.increment();

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
    }

    function getTotalMinted() external view returns (uint256) {
        return _tokenIds.current();
    }
}
