// // SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";
contract RadNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // This is our SVG code. All we need to change is the word that's displayed. Everything else stays the same.
    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = ["God", "Fake", "Real", "Agile", "Shit", "Quick", "Competetive", "Focused", "Confident", "Gifted", "Dumb", "Outstanding", "Honorable", "Loser", "Champion", "Adaptable", "Slow"];
    string[] secondWords = ["Ferrari", "Mercedes", "RedBull", "Alpine", "Haas", "Alfa", "AlphaTauri", "McLaren", "AstonMartin", "Williams", "Lotus", "Renault", "Maserati", "Toyota", "Honda", "Porsche", "Ford"];
    string[] thirdWords = ["Leclerc", "Sainz", "Verstappen", "Russell", "Hamilton", "Ocon", "Perez", "Magnussen", "Bottas", "Norris", "Tsunoda", "Gasly", "Alonso", "Zhou", "Schumacher", "Ricciardo", "Vettel"];
    constructor() ERC721("RadNFT", "RAD") {
        console.log("This is my Rad NFT");
    }

    function pickRandomWord(uint256 tokenId, string[] memory words) public pure returns (string memory){
        // seed
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % words.length;
        return words[rand];
    }

    function random(string memory input) internal pure returns(uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function makeARadNFT() public {
        uint256 newItemId = _tokenIds.current();
        string memory first = pickRandomWord(newItemId, firstWords);
        string memory second = pickRandomWord(newItemId, secondWords);
        string memory third = pickRandomWord(newItemId, thirdWords);
        string memory combinedWord = string(abi.encodePacked(first, second, third));
        string memory finalSvg = string(abi.encodePacked(baseSvg, first, second, third,  "</text></svg>"));

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

        _tokenIds.increment();

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
    }
}
